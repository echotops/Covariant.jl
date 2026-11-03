import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';
import ptvector from '../../assets/learn/ptvector.png';
import ptpath from '../../assets/learn/ptpath.png';

export default function ParallelTransport() {
    return (
        <>
            <p className="learn-title">Parallel Transport</p>
            <p className="learn-body">
                A vector is transported along a path, which is either a parametric function or
                a <Ref to={refLinks.Trajectory}>Trajectory</Ref> from <Ref to={refLinks.solve_geodesic}>solve_geodesic</Ref>.
                A single function covers both, so transport along a geodesic, along a straight line in
                coordinates, and around a closed loop are all the same call with a different path.
            </p>

            <FunctionDocs
                id="solve-parallel-transport"
                name="solve_parallel_transport"
                code={`solve_parallel_transport(M, path, w0, times; abstol=1e-5, reltol=1e-5)`}
                description={<>Solves the parallel transport equation <Math display>{'\\dot{w}^i = -\\Gamma^i_{jk} w^j \\dot{x}^k'}</Math> along a path, given an initial vector to transport. When the path is a function, its velocity is computed automatically via automatic differentiation, so only the path itself needs to be provided, and it need not be a geodesic. When it is a <code>Trajectory</code>, its saved velocities are used, so the vector is carried along the geodesic exactly. Returns a <code>Trajectory</code> with the positions and velocities of the path and the transported vectors.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to solve on, of any dimension.</>],
                    ['path', 'Function or Trajectory', <>A parametric function <code>t -&gt; [u, v]</code> giving the position at each time, or a solved <code>Trajectory</code> that has velocities.</>],
                    ['w0', 'Vector{Float64}', <>The initial vector to transport in coordinate space.</>],
                    ['times', 'AbstractRange', <>The times to save the solution at.</>],
                ]}
                kwargs={[
                    ['abstol', 'Float64', '1e-5', <>Absolute tolerance passed to the ODE solver.</>],
                    ['reltol', 'Float64', '1e-5', <>Relative tolerance passed to the ODE solver.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Transport along a straight line in coordinates: a constant direction
x0 = [π/4, 3π/4]
v0 = [0.5, 2]
w0 = [2, 0]
times = range(0.0, 1.5, 15)

trajectory = solve_parallel_transport(M, t -> x0 + v0 * t, w0, times)

# The path's velocity in red, the transported vector in blue
plot_vectors!(ax3, M, trajectory, which=:velocities, lengthscale=0.1, colormap=:reds)
plot_vectors!(ax3, M, trajectory, lengthscale=0.1, colormap=:ice)`}
                    img={ptvector}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Around a closed loop. The angle between the initial and final
# transported vector reveals the holonomy of the loop
path(t) = [0.4cos(t) + 0.1sin(2t) + π/3, 0.7sin(t) - 2π/3]
times = range(0.0, 2π, 101)

trajectory = solve_parallel_transport(M, path, [2.0, -1.0], times;
    abstol=1e-5, reltol=1e-5)

plot_path!(ax3, M, trajectory, color=:lightblue)
plot_vectors!(ax3, M, trajectory, spacing=5, lengthscale=0.1, colormap=:ice)`}
                    img={ptpath}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Along a geodesic: pass the solved geodesic as the path
geodesic = solve_geodesic(M, [π/2, π/6], [0.5, -0.5], range(0.0, 5.0, 50))
transported = solve_parallel_transport(M, geodesic, [1.0, 0.0], range(0.0, 5.0, 50))`}
                />
            </FunctionDocs>

            <PageNav prev="Geodesics" />
        </>
    );
}
