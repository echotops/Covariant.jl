module CovariantSolver

using Covariant
using DifferentialEquations
using ForwardDiff

# Internal. The Christoffel symbols compiled once per manifold into an in-place function
compiled_Γ(M::Manifold) = get!(() -> Covariant.lambdify!(christoffel(M), M.coordinates), M.cache, :christoffel_function)

# Internal. The state is position then velocity, in n dimensions. p holds the compiled Γ and a buffer for
# its values, so a step allocates nothing.
function geodesic_rhs!(du, u, p::Tuple{Any, Any, Val{N}}, t) where N
    Γ!, Γ = p[1], p[2]
    Γ!(Γ, ntuple(i -> u[i], Val(N)))
    @inbounds for i in 1:N
        a = 0.0
        for j in 1:N, k in 1:N
            a += Γ[i, j, k] * u[N + j] * u[N + k]
        end
        du[i] = u[N + i]
        du[N + i] = -a
    end
end

# Internal. The state is the transported vector w in n dimensions, carried along a path with position and
# velocity given by the functions pos(t) and vel(t).
function transport_rhs!(du, w, p::Tuple{Any, Any, Val{N}, Any, Any}, t) where N
    Γ!, Γ, pos, vel = p[1], p[2], p[4], p[5]
    x = pos(t)
    v = vel(t)
    Γ!(Γ, ntuple(i -> x[i], Val(N)))
    @inbounds for i in 1:N
        a = 0.0
        for j in 1:N, k in 1:N
            a += Γ[i, j, k] * w[j] * v[k]
        end
        du[i] = -a
    end
end

# Internal. Splits states into n-vectors
split_states(us, range) = [Float64[u[i] for i in range] for u in us]

# Internal. Solves with a dense solution, so it can be evaluated at the requested times and, for a geodesic
# used as a path, at any time in between
function solve_dense(problem, times, abstol, reltol)
    sol = solve(problem, abstol=abstol, reltol=reltol, dense=true)
    return sol, [sol(t) for t in times]
end

function Covariant.solve_geodesic(M::Manifold{N}, x0, v0, times; abstol=1e-10, reltol=1e-10) where N
    p = (compiled_Γ(M), zeros(N, N, N), Val(N))
    problem = ODEProblem(geodesic_rhs!, Float64[x0..., v0...], (times[begin], times[end]), p)
    sol, states = solve_dense(problem, times, abstol, reltol)
    return Trajectory(collect(Float64, times), split_states(states, 1:N), split_states(states, N+1:2N), nothing, sol)
end

# Internal. The position and velocity of a path, from a function or a solved geodesic
path_functions(path::Function, ::Val) = (path, t -> ForwardDiff.derivative(path, t))
function path_functions(path::Trajectory, ::Val{N}) where N
    path.velocities === nothing && error("The trajectory has no velocities to transport along")
    sol = path.solution
    return (t -> sol(t), t -> view(sol(t), N+1:2N))
end

function Covariant.solve_parallel_transport(M::Manifold{N}, path, w0, times; abstol=1e-5, reltol=1e-5) where N
    pos, vel = path_functions(path, Val(N))
    p = (compiled_Γ(M), zeros(N, N, N), Val(N), pos, vel)
    problem = ODEProblem(transport_rhs!, Float64[w0...], (times[begin], times[end]), p)
    sol, states = solve_dense(problem, times, abstol, reltol)
    positions = [Float64[pos(t)[i] for i in 1:N] for t in times]
    velocities = [Float64[vel(t)[i] for i in 1:N] for t in times]
    return Trajectory(collect(Float64, times), positions, velocities, split_states(states, 1:N), sol)
end

end
