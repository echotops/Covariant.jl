module CovariantMakie

using Covariant
using GLMakie

is_embedded(M::Manifold) = M.embedding !== nothing

function require_embedded(M::Manifold, name)
    is_embedded(M) || error("$name needs a Manifold with an embedding")
end

# Internal. The ranges to plot over, for a 2-dimensional manifold
function plot_ranges(M::Manifold)
    length(M.coordinates) == 2 || error("Plotting needs a 2-dimensional manifold")
    M.ranges === nothing && error("Plotting needs a Manifold with ranges")
    return M.ranges
end

# Internal. The coordinate points to sample a field at, subsampled by spacing
function grid_points(M::Manifold, spacing=1)
    us, vs = plot_ranges(M)
    return vec([(u, v) for u in us[begin:spacing:end], v in vs[begin:spacing:end]])
end

# Internal. Where a coordinate point is drawn
function base_point(M::Manifold, p)
    return is_embedded(M) ? Point3f(M.embedding(p...)) : Point2f(p...)
end

# Internal. Turns vector components at a coordinate point into a vector to draw. Components are
# lifted through the basis on an embedded surface, or the coordinate basis of the embedding if it has no
# basis, and drawn as given on a flat one.
function tangent_vector(M::Manifold)
    if !is_embedded(M)
        return (p, c) -> Vec2f(c...)
    end
    if M.basis === nothing
        return (p, c) -> Vec3f(sum(c[i] * e for (i, e) in enumerate(embedding_basis(M.embedding, p))))
    end
    basis_fns = [lambdify(e, M.coordinates) for e in M.basis.elements]
    return (p, c) -> Vec3f(sum(c[i] * basis_fns[i](p) for i in eachindex(c)))
end

# Internal. Draws arrows colored by length, with the colorrange centered on zero
function draw_arrows!(ax, M::Manifold, points, vecs, normalize, kwargs)
    defaults = (lengthscale=1, colormap=:viridis,)
    lengths = [hypot(v...) for v in vecs]
    if normalize
        vecs = vecs ./ lengths
    end
    clim = maximum(abs.(lengths))
    arrows = is_embedded(M) ? arrows3d! : arrows2d!
    return arrows(ax, points, vecs, color=lengths, colorrange=(-clim, clim);
        merge(defaults, kwargs)...
    )
end

"""
Plot an embedded surface in an Axis3
"""
function Covariant.plot_surface!(ax, M::Manifold; kwargs...)
    require_embedded(M, "plot_surface!")
    defaults = (colormap=[:grey, :grey],)
    us, vs = plot_ranges(M)
    points = [M.embedding(u, v) for u in us, v in vs]
    return surface!(ax, getindex.(points, 1), getindex.(points, 2), getindex.(points, 3);
        merge(defaults, kwargs)...
    )
end

"""
Plot a scalar field on a surface
"""
function Covariant.plot_scalar!(ax, M::Manifold, f; kwargs...)
    F = lambdify(f, M.coordinates)
    us, vs = plot_ranges(M)
    scalars = [F((u, v)) for u in us, v in vs]
    if is_embedded(M)
        defaults = (colormap=:viridis,)
        points = [M.embedding(u, v) for u in us, v in vs]
        return surface!(ax, getindex.(points, 1), getindex.(points, 2), getindex.(points, 3), color=scalars;
            merge(defaults, kwargs)...
        )
    end
    defaults = (colormap=:viridis, interpolate=false,)
    return heatmap!(ax, us, vs, scalars; merge(defaults, kwargs)...)
end

"""
Plot a vector field, a (1, 0)-tensor of symbolic components, over a surface
"""
function Covariant.plot_vectors!(ax, M::Manifold, X::Tensor; spacing=1, normalize=false, kwargs...)
    components = lambdify(X, M.coordinates)
    tangent = tangent_vector(M)
    points = grid_points(M, spacing)
    vecs = [tangent(p, components(p)) for p in points]
    return draw_arrows!(ax, M, [base_point(M, p) for p in points], vecs, normalize, kwargs)
end

"""
Plot individual vectors at given coordinate positions on a surface
"""
function Covariant.plot_vectors!(ax, M::Manifold, positions, Xs; normalize=false, kwargs...)
    tangent = tangent_vector(M)
    vecs = [tangent(p, X.data) for (p, X) in zip(positions, Xs)]
    return draw_arrows!(ax, M, [base_point(M, p) for p in positions], vecs, normalize, kwargs)
end

"""
Plot a parametric path on a surface
"""
function Covariant.plot_path!(ax, M::Manifold, path, times; kwargs...)
    defaults = (linewidth=2, color=:lightblue,)
    points = [base_point(M, path(t)) for t in times]
    return lines!(ax, points; merge(defaults, kwargs)...)
end

"""
Plot the path of a solved Trajectory on a manifold
"""
function Covariant.plot_path!(ax, M::Manifold, T::Trajectory; kwargs...)
    defaults = (linewidth=2, color=:lightblue,)
    return lines!(ax, [base_point(M, p) for p in T.positions]; merge(defaults, kwargs)...)
end

"""
Plot vectors along a solved Trajectory: the transported vectors if it has them, or its velocities

Choose with `which=:vectors` or `which=:velocities`.
"""
function Covariant.plot_vectors!(ax, M::Manifold, T::Trajectory; which=nothing, spacing=1, normalize=false, kwargs...)
    which = which === nothing ? (T.vectors !== nothing ? :vectors : :velocities) : which
    components = getfield(T, which)
    components === nothing && error("The trajectory has no $which")
    tangent = tangent_vector(M)
    indices = 1:spacing:length(T.positions)
    points = [base_point(M, T.positions[i]) for i in indices]
    vecs = [tangent(T.positions[i], components[i]) for i in indices]
    return draw_arrows!(ax, M, points, vecs, normalize, kwargs)
end

end
