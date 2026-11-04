import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';
import geodesic from '../../assets/learn/geodesic.png';
import ptpath from '../../assets/learn/ptpath.png';
import ptvector from '../../assets/learn/ptvector.png';

export default function Solver() {
    return (
        <>
            <p className="learn-title">Solver</p>
            <p className="learn-body">
                The examples below continue from the <code>embedding</code>, coordinates,
                <code>M</code> manifold, and <code>ax3</code> axis set up on the Visualization page, solving
                differential equations along the manifold they define and plotting the results
                onto the same figure
            </p>
            <p className="learn-heading" id="geodesics">Geodesics</p>
            <p className="learn-body">
                A geodesic is the straightest path available on a curved manifold, the generalization
                of a straight line to a space where "straight" depends on position. Where the
                Christoffel symbols vanish, the geodesic equation reduces to zero acceleration —
                ordinary straight-line motion, <code>x(t) = x0 + v0*t</code>. Solving the
                geodesic equation requires an initial position and velocity, and returns
                a <Ref to={refLinks.Trajectory}>Trajectory</Ref> holding the positions and velocities along the path,
                which can be plotted directly with <code>plot_path!</code>
            </p>
            <CodeBlock lang="julia"
code={`x0 = [π/2, π/6]
v0 = [0.5, -0.5]
times = range(0.0, 15.0, 250)
trajectory = solve_geodesic(M, x0, v0, times)
plot_path!(ax3, M, trajectory)`}
img={geodesic}
            />
            <p className="learn-heading" id="parallel-transport">Parallel Transport</p>
            <p className="learn-body">
                Parallel transport carries a vector along a path while changing it as little as the
                geometry allows, using the covariant derivative to correct for the basis curving
                underneath it at every step. In flat space with a fixed basis this is trivial —
                constant components already mean a constant vector — so it only becomes interesting
                once the basis is allowed to vary. <Ref to={refLinks.solve_parallel_transport}>solve_parallel_transport</Ref> carries
                a vector along a path, which is either a function of time or a solved geodesic.
                A straight line in coordinates gives transport in a constant direction, while a
                closed path gives transport around a loop
            </p>
            <CodeBlock lang="julia"
code={`x0 = [π/4, 3π/4]
v0 = [0.5, 2]
w0 = [2,  0]
times = range(0.0, 1.5, 15)
trajectory = solve_parallel_transport(M, t -> x0 + v0 * t, w0, times)
plot_vectors!(ax3, M, trajectory, which=:velocities)
plot_vectors!(ax3, M, trajectory)`}
img={ptvector}
            />
            <p className="learn-body">
                Transporting a vector around a closed loop and back to its start doesn't generally
                return it to its original orientation, a mismatch called holonomy, and direct
                evidence that the manifold is curved. Passing a closed path
                to <Ref to={refLinks.solve_parallel_transport}>solve_parallel_transport</Ref> makes it visible
            </p>
            <CodeBlock lang="julia"
code={`path(t) = [0.4cos(t) + 0.1sin(2t) + π/3, 0.7sin(t) - 2π/3]
times = range(0.0, 2π, 101)
w0 = [2, -1]
trajectory = solve_parallel_transport(M, path, w0, times)
plot_path!(ax3, M, trajectory)
plot_vectors!(ax3, M, trajectory, spacing=5)`}
img={ptpath}
            />
            <p className="learn-body">
                As with the plotting functions on the previous page, styling keywords like
                <code>colormap</code> and <code>lengthscale</code> are available, along with
                solver keywords like <code>abstol</code> and <code>reltol</code> — see the
                <Ref to="/reference/parallel-transport">Reference</Ref> for the full list.
            </p>
            <PageNav prev="Visualization" />
        </>
    );
}