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
                a <code>DifferentialEquations.jl</code> backend.
                The solvers take a <code>Manifold</code>, compile its Christoffel symbols once
                and reuse them on every solve, and work in any number of dimensions. Results come back as
                a <code>Trajectory</code>, which can be passed straight to the plotting functions.
            </p>

            <FunctionDocs
                id="trajectory"
                name="Trajectory"
                code={`Trajectory(times, positions, velocities, vectors, solution)`}
                description={<>A solved path on a manifold, returned by <code>solve_geodesic</code> and <code>solve_parallel_transport</code>. Positions, velocities, and transported vectors are stored as ordinary vectors of coordinate values, so there is no packed state vector to slice. It is accepted by <code>plot_path!</code> and <code>plot_vectors!</code>.</>}
                args={[
                    ['times', 'Vector{Float64}', <>The times the solution was saved at.</>],
                    ['positions', 'Vector{Vector{Float64}}', <>The coordinates of the path at each time.</>],
                    ['velocities', 'Vector{Vector{Float64}} or nothing', <>The velocity of the path at each time, if known.</>],
                    ['vectors', 'Vector{Vector{Float64}} or nothing', <>The parallel-transported vector at each time, for a transport solve.</>],
                    ['solution', 'Any', <>The underlying <code>DifferentialEquations.jl</code> solution, which can be evaluated at any time in the solved interval.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`trajectory = solve_geodesic(M, [π/2, π/6], [0.5, -0.5], range(0.0, 15.0, 250))

trajectory.positions[1]    # [π/2, π/6]
trajectory.velocities[1]   # [0.5, -0.5]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="solve-geodesic"
                name="solve_geodesic"
                code={`solve_geodesic(M, x0, v0, times; abstol=1e-10, reltol=1e-10)`}
                description={<>Solves the geodesic equation <Math display>{'\\ddot{x}^i = -\\Gamma^i_{jk} \\dot{x}^j \\dot{x}^k'}</Math> for a curve on a manifold, given an initial position and velocity. The Christoffel symbols of <code>M</code> are compiled to a numeric function once, cached on the manifold, and evaluated in place at each step. Returns a <code>Trajectory</code> with positions and velocities.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to solve on, of any dimension.</>],
                    ['x0', 'Vector{Float64}', <>The initial position in coordinate space.</>],
                    ['v0', 'Vector{Float64}', <>The initial velocity in coordinate space.</>],
                    ['times', 'AbstractRange', <>The times to save the solution at.</>],
                ]}
                kwargs={[
                    ['abstol', 'Float64', '1e-10', <>Absolute tolerance passed to the ODE solver.</>],
                    ['reltol', 'Float64', '1e-10', <>Relative tolerance passed to the ODE solver.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`x0 = [π/2, π/6]
v0 = [0.5, -0.5]
times = range(0.0, 15.0, 250)

trajectory = solve_geodesic(M, x0, v0, times)
plot_path!(ax3, M, trajectory, color=:lightblue, linewidth=5)`}
                    img={geodesic}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Plot tangent vectors along the geodesic
plot_vectors!(ax3, M, trajectory, spacing=10,
    normalize=true, lengthscale=0.1, colormap=:viridis)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Geodesics in any dimension: flat space in spherical coordinates
@variables r th ph
M3 = Manifold((r, th, ph), Tensor([1 0 0; 0 r^2 0; 0 0 (r*sin(th))^2], :co, :co))
solve_geodesic(M3, [1.0, π/2, 0.0], [0.0, 0.0, 1.0], 0:0.25:1)`}
                />
            </FunctionDocs>

            <PageNav prev="Vector Fields" next="Parallel Transport" />
        </>
    );
}
