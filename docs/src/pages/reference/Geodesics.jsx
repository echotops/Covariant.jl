import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import geodesic from '../../assets/learn/geodesic.png';

export default function Geodesics() {
    return (
        <>
            <p className="learn-title">Geodesics</p>
            <p className="learn-body">
                Geodesic solving requires <code>CovariantSolver</code>, which provides
                a <code>DifferentialEquations.jl</code> backend for the geodesic and parallel
                transport equations. The state vector used internally packs position and
                velocity into a single flat array, and the solution object returned is a
                standard <code>DifferentialEquations.jl</code> solution that can be indexed
                and passed to GLMakie.
            </p>

            <FunctionDocs
                id="geodesic"
                name="geodesic!"
                code={`geodesic!(coordinates, Γ, du, u, p, t)`}
                description={<>The in-place ODE function defining the geodesic equation, for use directly with <code>DifferentialEquations.jl</code>. At each timestep, evaluates the Christoffel symbols <Math>{'\\Gamma'}</Math> at the current position and computes the geodesic acceleration <Math>{'\\ddot{x}^i = -\\Gamma^i_{jk} \\dot{x}^j \\dot{x}^k'}</Math>. The state vector <code>u</code> packs position in <code>u[1:2]</code> and velocity in <code>u[3:4]</code>. Most use cases should call <code>solve_geodesic</code> instead, which wraps this function in an <code>ODEProblem</code> automatically.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>The symbolic coordinate variables, used to evaluate <code>Γ</code> at the current position.</>],
                    ['Γ', 'Tensor', <>The <Math>{'(1, 2)'}</Math>-tensor of Christoffel symbols, computed by <code>christoffel</code>.</>],
                    ['du', 'Vector{Float64}', <>The output derivative vector, mutated in place by the function.</>],
                    ['u', 'Vector{Float64}', <>The current state vector. <code>u[1:2]</code> is position, <code>u[3:4]</code> is velocity.</>],
                    ['p', 'Any', <>Parameters passed through by <code>DifferentialEquations.jl</code>. Not used internally.</>],
                    ['t', 'Float64', <>The current time, passed through by <code>DifferentialEquations.jl</code>. Not used internally.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Using geodesic! directly with DifferentialEquations.jl
@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
Γ = christoffel((θ, φ), e)

x0 = [π/2, π/6]
v0 = [0.5, -0.5]
u0 = [x0..., v0...]
times = range(0.0, 15.0, 250)

problem = ODEProblem(
    (du, u, p, t) -> geodesic!((θ, φ), Γ, du, u, p, t),
    u0, (times[begin], times[end])
)
solution = solve(problem, abstol=1e-10, reltol=1e-10, saveat=times)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="solve-geodesic"
                name="solve_geodesic"
                code={`solve_geodesic(coordinates, basis, x0, v0, times; abstol=1e-10, reltol=1e-10)`}
                description={<>Solves the geodesic equation for a curve on a manifold defined by <code>basis</code>, given an initial position and velocity. Internally computes the Christoffel symbols, constructs an <code>ODEProblem</code> from <code>geodesic!</code>, and solves it with <code>DifferentialEquations.jl</code>. Returns a standard solution object whose <code>.u</code> field is a vector of state vectors, each packing position in indices <code>1:2</code> and velocity in <code>3:4</code>.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>A tuple of symbolic variables defined with <code>@variables</code>, one per dimension.</>],
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis defining the geometry of the manifold.</>],
                    ['x0', 'Vector{Float64}', <>The initial position in coordinate space.</>],
                    ['v0', 'Vector{Float64}', <>The initial velocity in coordinate space.</>],
                    ['times', 'AbstractRange', <>The time range over which to solve, also used as the <code>saveat</code> grid.</>],
                ]}
                kwargs={[
                    ['abstol', 'Float64', '1e-10', <>Absolute tolerance passed to the ODE solver.</>],
                    ['reltol', 'Float64', '1e-10', <>Relative tolerance passed to the ODE solver.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])

x0 = [π/2, π/6]
v0 = [0.5, -0.5]
times = range(0.0, 15.0, 250)

solution = solve_geodesic((θ, φ), e, x0, v0, times; abstol=1e-10, reltol=1e-10)
lines!(ax3, [Point3f(embedding(u[1], u[2])) for u in solution.u],
    color=:lightblue, linewidth=5)`}
                    img={geodesic}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Extracting position and velocity from the solution
positions = [(u[1], u[2]) for u in solution.u]
velocities = [Tensor([u[3], u[4]]) for u in solution.u]

# Plot tangent vectors along the geodesic
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions,
    velocities, normalize=true, lengthscale=0.1, colormap=:viridis)`}
                />
            </FunctionDocs>

            <PageNav prev="Vector Fields" next="Parallel Transport" />
        </>
    );
}
