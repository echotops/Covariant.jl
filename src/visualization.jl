"""
Plot a 2D surface embedded in R3

surface_2dembed!(ax, embedding, xs, ys; kwargs...)
"""
function surface_2dembed!(args...; kwargs...)
    error("Load GLMakie before using surface_2dembed!")
end

"""
Plot a scalar field in R2

scalar_2d!(ax, coordinates, xs, ys, f; kwargs...)
"""
function scalar_2d!(args...; kwargs...)
    error("Load GLMakie before using scalar_2d!")
end

"""
Plot a scalar field on a 2D surface embedded in R3

scalar_2dembed!(ax, coordinates, embedding, xs, ys, f; kwargs...)
"""
function scalar_2dembed!(args...; kwargs...)
    error("Load GLMakie before using scalar_2dembed!")
end

"""
Plot a path on a 2D surface embedded in R3

path_2dembed!(ax, embedding, path, times; kwargs...)
"""
function path_2dembed!(args...; kwargs...)
    error("Load GLMakie before using scalar_2dembed!")
end

"""
Plot individual vectors on a 2D surface embedded in R3

vector_2dembed!(ax, coordinates, basis, embedding, positions, Xs; normalize=false, kwargs...)
"""
function vector_2dembed!(args...; kwargs...)
    error("Load GLMakie before using scalar_2dembed!")
end

"""
Plot a vector field in R2

vectors_2d!(ax, coordinates, xs, ys, X; spacing=1, normalize=false, kwargs...)
"""
function vectors_2d!(args...; kwargs...)
    error("Load GLMakie before using vectors_2d!")
end

"""
Plot a vector field on a 2D surface in R3

vectors_2dembed!(ax, coordinates, basis, embedding, xs, ys, X; spacing=1, normalize=false, kwargs...)
"""
function vectors_2dembed!(args...; kwargs...)
    error("Load GLMakie before using vectors_2dembed!")
end