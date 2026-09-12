"""
Geodesic problem for the solver

geodesic!(coordinates, Γ, du, u, p, t)

# State vector
u[1:2] - position
u[3:4] - velocity
"""
function geodesic!(args...; kwargs...)
    error("Load DifferentialEquations before using geodesic!")
end

"""
Solve the geodesic problem given initial conditions

solve_geodesic(coordinates, basis, x0, v0, times; abstol=1e-10, reltol=1e-10)
"""
function solve_geodesic(args...; kwargs...)
    error("Load DifferentialEquations before using solve_geodesic")
end

"""
Parallel transport problem for the solver

parallel_transport!(coordinates, Γ, du, u, p, t)

# State vector
u[1:2] - position
u[3:4] - velocity (geodesic)
u[5:6] - vector being transported
"""
function parallel_transport!(args...; kwargs...)
    error("Load DifferentialEquations before using parallel_transport!")
end

"""
Solve the parallel transport problem given initial conditions

solve_parallel_transport(coordinates, basis, x0, v0, w0, times; abstol=1e-5, reltol=1e-5)
"""
function solve_parallel_transport(args...; kwargs...)
    error("Load DifferentialEquations before using solve_parallel_transport")
end

"""
Parallel transport along a path problem for the solver

parallel_transport_path!(coordinates, Γ, path, velocity, du, u, p, t)

# State vector
u[1:2] - vector being transported
"""
function parallel_transport_path!(args...; kwargs...)
    error("Load DifferentialEquations before using parallel_transport_path!")
end

"""
Solve the parallel transport along a path problem given initial conditions

solve_parallel_transport_path(coordinates, basis, path, velocity, w0, times; abstol=1e-5, reltol=1e-5)
"""
function solve_parallel_transport_path(args...; kwargs...)
    error("Load DifferentialEquations before using solve_parallel_transport_path")
end