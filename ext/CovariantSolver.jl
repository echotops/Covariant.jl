module CovariantSolver

using Covariant
using DifferentialEquations
using ForwardDiff

"""
Geodesic problem for the solver

# State vector
u[1:2] - position
u[3:4] - velocity
"""
function Covariant.geodesic!(coordinates, Γ, du, u, p, t)
    Γ_num = evaluate(Γ, Dict(coordinates[1]=>u[1], coordinates[2]=>u[2]))
    v = Tensor([u[3], u[4]])
    a = Γ_num[:i][:j, :k] * v[:j] * v[:k]
    du[1] = u[3]
    du[2] = u[4]
    du[3] = -a.tensor[1]
    du[4] = -a.tensor[2]
end

"""
Solve the geodesic problem given initial conditions
"""
function Covariant.solve_geodesic(coordinates, basis, x0, v0, times; abstol=1e-10, reltol=1e-10)
    Γ = christoffel(coordinates, basis)
    u0 = [x0..., v0...]
    problem = ODEProblem(
        (du, u, p, t) -> geodesic!(coordinates, Γ, du, u, p, t),
        u0, (times[begin], times[end])
    )
    return solve(problem, abstol=abstol, reltol=reltol, saveat=times)
end

"""
Parallel transport problem for the solver

# State vector
u[1:2] - position
u[3:4] - velocity (geodesic)
u[5:6] - vector being transported
"""
function Covariant.parallel_transport!(coordinates, Γ, du, u, p, t)
    Γ_num = evaluate(Γ, Dict(coordinates[1]=>u[1], coordinates[2]=>u[2]))
    v = Tensor([u[3], u[4]])
    w = Tensor([u[5], u[6]])
    a = Γ_num[:i][:j, :k] * w[:j] * v[:k]
    du[1] = u[3]
    du[2] = u[4]
    du[3] = 0.0
    du[4] = 0.0
    du[5] = -a.tensor[1]
    du[6] = -a.tensor[2]
end

"""
Solve the parallel transport problem given initial conditions
"""
function Covariant.solve_parallel_transport(coordinates, basis, x0, v0, w0, times; abstol=1e-5, reltol=1e-5)
    Γ = christoffel(coordinates, basis)
    u0 = [x0..., v0..., w0...]
    problem = ODEProblem(
        (du, u, p, t) -> parallel_transport!(coordinates, Γ, du, u, p, t),
        u0, (times[begin], times[end])
    )
    return solve(problem, abstol=abstol, reltol=reltol, saveat=times)
end

"""
Parallel transport along a path problem for the solver

# State vector
u[1:2] - vector being transported
"""
function Covariant.parallel_transport_path!(coordinates, Γ, path, du, u, p, t)
    Γ_num = evaluate(Γ, Dict(coordinates[1]=>path(t)[1], coordinates[2]=>path(t)[2]))
    v = Tensor(ForwardDiff.derivative(path, t))
    w = Tensor([u[1], u[2]])
    a = Γ_num[:i][:j, :k] * w[:j] * v[:k]
    du[1] = -a.tensor[1]
    du[2] = -a.tensor[2]
end

"""
Solve the parallel transport along a path problem given initial conditions

The path's velocity is computed automatically via automatic differentiation,
so only the path itself needs to be provided.
"""
function Covariant.solve_parallel_transport_path(coordinates, basis, path, w0, times; abstol=1e-5, reltol=1e-5)
    Γ = christoffel(coordinates, basis)
    problem = ODEProblem(
        (du, u, p, t) -> parallel_transport_path!(coordinates, Γ, path, du, u, p, t),
        w0, (times[begin], times[end])
    )
    return solve(problem, abstol=abstol, reltol=reltol, saveat=times)
end

end