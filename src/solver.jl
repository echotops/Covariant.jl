"""
A solved path on a manifold, with the quantities carried along it

Returned by solve_geodesic and solve_parallel_transport, and accepted by plot_path! and plot_vectors!.

# Fields
times::Vector{Float64}
    - The times the solution was saved at
positions::Vector{Vector{Float64}}
    - The coordinates of the path at each time
velocities::Union{Vector{Vector{Float64}}, Nothing}
    - The velocity of the path at each time, if known
vectors::Union{Vector{Vector{Float64}}, Nothing}
    - The parallel-transported vector at each time, if there is one
solution::Any
    - The underlying DifferentialEquations.jl solution
"""
struct Trajectory
    times::Vector{Float64}
    positions::Vector{Vector{Float64}}
    velocities::Union{Vector{Vector{Float64}}, Nothing}
    vectors::Union{Vector{Vector{Float64}}, Nothing}
    solution::Any
end

function Base.show(io::IO, T::Trajectory)
    print(io, "Trajectory(", length(T.times), " points, t = ", first(T.times), " to ", last(T.times), ")")
end

"""
Solve the geodesic equation on a manifold given an initial position and velocity

solve_geodesic(M, x0, v0, times; abstol=1e-10, reltol=1e-10)

Returns a Trajectory with positions and velocities.
"""
function solve_geodesic(args...; kwargs...)
    error("Load DifferentialEquations before using solve_geodesic")
end

"""
Parallel transport a vector along a path on a manifold

solve_parallel_transport(M, path, w0, times; abstol=1e-5, reltol=1e-5)

The path is either a function t -> coordinates, whose velocity is found by automatic differentiation,
or a Trajectory such as the one returned by solve_geodesic. Returns a Trajectory with positions,
velocities, and the transported vectors.
"""
function solve_parallel_transport(args...; kwargs...)
    error("Load DifferentialEquations before using solve_parallel_transport")
end
