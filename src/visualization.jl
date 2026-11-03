"""
Plot an embedded surface in an Axis3

plot_surface!(ax, M; kwargs...)

M is a Manifold with an embedding and ranges.
"""
function plot_surface!(args...; kwargs...)
    error("Load GLMakie before using plot_surface!")
end

"""
Plot a scalar field on a manifold: a heatmap if flat, a coloring of the surface if embedded

plot_scalar!(ax, M, f; kwargs...)
"""
function plot_scalar!(args...; kwargs...)
    error("Load GLMakie before using plot_scalar!")
end

"""
Plot a vector field over a manifold, or individual vectors at given positions

plot_vectors!(ax, M, X; spacing=1, normalize=false, kwargs...)
plot_vectors!(ax, M, positions, Xs; normalize=false, kwargs...)
"""
function plot_vectors!(args...; kwargs...)
    error("Load GLMakie before using plot_vectors!")
end

"""
Plot a parametric path on a manifold

plot_path!(ax, M, path, times; kwargs...)
"""
function plot_path!(args...; kwargs...)
    error("Load GLMakie before using plot_path!")
end
