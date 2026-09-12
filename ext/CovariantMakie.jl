module CovariantMakie

using Covariant
using GLMakie

"""
Plot a 2D surface embedded in R3
"""
function Covariant.surface_2dembed!(ax, embedding, xs, ys; kwargs...)
    defaults = (colormap=[:grey, :grey],)
    us = [embedding(x, y)[1] for x in xs, y in ys]
    vs = [embedding(x, y)[2] for x in xs, y in ys]
    ws = [embedding(x, y)[3] for x in xs, y in ys]
    surface!(ax, us, vs, ws;
        merge(defaults, kwargs)...
    )
end

"""
Plot a scalar field in R2
"""
function Covariant.scalar_2d!(ax, coordinates, xs, ys, f; kwargs...)
    defaults = (colormap=:viridis, interpolate=false,)
    u, v = coordinates
    scalars = [evaluate(f, Dict(u=>x, v=>y)) for x in xs, y in ys]
    heatmap!(ax, xs, ys, scalars;
        merge(defaults, kwargs)...
    )
end

"""
Plot a scalar field on a 2D surface embedded in R3
"""
function Covariant.scalar_2dembed!(ax, coordinates, embedding, xs, ys, f; kwargs...)
    defaults = (colormap=:viridis,)
    u, v = coordinates
    us = [embedding(x, y)[1] for x in xs, y in ys]
    vs = [embedding(x, y)[2] for x in xs, y in ys]
    ws = [embedding(x, y)[3] for x in xs, y in ys]
    scalars = [evaluate(f, Dict(u=>x, v=>y)) for x in xs, y in ys]
    surface!(ax, us, vs, ws, color=scalars;
        merge(defaults, kwargs)...
    )
end

"""
Plot a path on a 2D surface embedded in R3
"""
function Covariant.path_2dembed!(ax, embedding, path, times; kwargs...)
    defaults = (linewidth=2, color=:lightblue,)
    positions_embedded = [Point3f(embedding(path(t)...)) for t in times]
    lines!(ax, positions_embedded;
        merge(defaults, kwargs)...
    )
end

"""
Plot individual vectors on a 2D surface embedded in R3
"""
function Covariant.vector_2dembed!(ax, coordinates, basis, embedding, positions, Xs; normalize=false, kwargs...)
    defaults = (lengthscale=1, colormap=:viridis,)
    positions_embedded = [Point3f(embedding(p...)) for p in positions]
    vecs = Any[]
    for i in eachindex(positions)
        x, y = positions[i]
        push!(vecs, evaluate(Xs[i][:i] * basis[:i], Dict(coordinates[1]=>x, coordinates[2]=>y)).data)
    end
    lengths = [hypot(v...) for v in vecs]
    if normalize
        vecs = vecs ./ lengths
    end
    clim = maximum(abs.(lengths))
    arrows3d!(ax, positions_embedded, vecs, color=vec(lengths), colorrange=(-clim, clim);
        merge(defaults, kwargs)...
    )
end

"""
Plot a vector field in R2
"""
function Covariant.vectors_2d!(ax, coordinates, xs, ys, X; spacing=1, normalize=false, kwargs...)
    defaults = (lengthscale=1, colormap=:viridis,)
    u, v = coordinates
    grid = [(x, y) for x in xs[begin:spacing:end], y in ys[begin:spacing:end]]
    vecs = [evaluate(X, Dict(u=>x, v=>y)).data for (x, y) in grid]
    lengths = [hypot(v...) for v in vecs]
    if normalize
        vecs = vecs ./ lengths
    end
    clim = maximum(abs.(lengths))
    arrows2d!(ax, grid, vecs, color=lengths, colorrange=(-clim, clim);
        merge(defaults, kwargs)...
    )
end

"""
Plot a vector field on a 2D surface in R3
"""
function Covariant.vectors_2dembed!(ax, coordinates, basis, embedding, xs, ys, X; spacing=1, normalize=false, kwargs...)
    defaults = (lengthscale=1, colormap=:viridis,)
    u, v = coordinates
    grid = [(x, y) for x in xs[begin:spacing:end], y in ys[begin:spacing:end]]
    grid3 = [Point3f(embedding(x, y)) for (x, y) in grid]
    vecs = [Vec3f(evaluate(X[:i] * basis[:i], Dict(u=>x, v=>y)).data) for (x, y) in grid]
    lengths = [hypot(v...) for v in vecs]
    if normalize
        vecs = vecs ./ lengths
    end
    clim = maximum(abs.(lengths))
    arrows3d!(ax, grid3, vecs, color=vec(lengths), colorrange=(-clim, clim);
        merge(defaults, kwargs)...
    )
end

end