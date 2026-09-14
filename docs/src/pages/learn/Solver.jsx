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
                The examples below continue from the <code>embedding</code>, <code>basis</code>,
                coordinates, and <code>ax3</code> axis set up on the Visualization page, solving
                differential equations along the manifold they define and plotting the results
                onto the same figure
            </p>
            <p className="learn-heading" id="geodesics">Geodesics</p>
            <p className="learn-body">
                A geodesic is the straightest path available on a curved manifold, the generalization
                of a straight line to a space where "straight" depends on position. Where the
                Christoffel symbols vanish, the geodesic equation reduces to zero acceleration —
                ordinary straight-line motion, <code>x(t) = x0 + v0*t</code>. Solving the
                geodesic equation requires an initial position and velocity. The solution
                can then be plotted with <code>lines!</code> from GLMakie
            </p>
            <CodeBlock lang="julia"
code={`x0 = [π/2, π/6]
v0 = [0.5, -0.5]
times = range(0.0, 15.0, 250)
solution = solve_geodesic((θ, φ), basis, x0, v0, times)
lines!(ax3, [Point3f(embedding(u[1], u[2])) for u in solution.u])`}
img={geodesic}
            />
            <p className="learn-heading" id="parallel-transport">Parallel Transport</p>
            <p className="learn-body">
                Parallel transport carries a vector along a path while changing it as little as the
                geometry allows, using the covariant derivative to correct for the basis curving
                underneath it at every step. In flat space with a fixed basis this is trivial —
                constant components already mean a constant vector — so it only becomes interesting
                once the basis is allowed to vary. It can either be solved by defining an initial position
                and velocity with <Ref to={refLinks.solve_parallel_transport}>solve_parallel_transport</Ref> or by parametrizing a path.
                The first approach allows parallel transport in a constant direction, while the
                second can be used for transport around a loop
            </p>
            <CodeBlock lang="julia"
code={`x0 = [π/4, 3π/4]
v0 = [0.5, 2]
w0 = [2,  0]
times = range(0.0, 1.5, 15)
solution = solve_parallel_transport((θ, φ), basis, x0, v0, w0, times)
positions = [(u[1], u[2]) for u in solution.u]
vectors = [Tensor([u[5], u[6]]) for u in solution.u]
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions, [Tensor(v0) for _ in positions])
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions, vectors)`}
img={ptvector}
            />
            <p className="learn-body">
                Transporting a vector around a closed loop and back to its start doesn't generally
                return it to its original orientation, a mismatch called holonomy, and direct
                evidence that the manifold is curved. Passing a closed path
                to <Ref to={refLinks.solve_parallel_transport_path}>solve_parallel_transport_path</Ref> makes it visible
            </p>
            <CodeBlock lang="julia"
code={`path(t) = [0.4cos(t) + 0.1sin(2t) + π/3, 0.7sin(t) - 2π/3]
times = range(0.0, 2π, 101)
w0 = [2, -1]
solution = solve_parallel_transport_path((θ, φ), basis, path, w0, times)
positions = [path(t) for t in times[begin:5:end]]
vectors = [Tensor([u[1], u[2]]) for u in solution.u[begin:5:end]]
path_2dembed!(ax3, embedding, path, times)
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions, vectors)
scatter!(ax3, [Point3f(embedding(p[1], p[2])) for p in positions])`}
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