import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import vectorfield from '../../assets/learn/vectorfield.png';
import ptvector from '../../assets/learn/ptvector.png';

export default function VectorFields() {
    return (
        <>
            <p className="learn-title">Vector Fields</p>
            <p className="learn-body">
                <code>plot_vectors!</code> has two forms — a field defined over the whole surface,
                or a list of individual vectors at specified positions. Both draw arrows with GLMakie,
                with vector lengths mapped to color by default. On a flat chart the components are drawn
                as given. On an embedded surface they are lifted to <Math>{'\\mathbb{R}^3'}</Math> through
                the basis of the <code>Manifold</code>, which is the tangent basis of its embedding when it was built from one,
                or the coordinate basis of the embedding, computed numerically, if it has a metric but no basis.
            </p>

            <FunctionDocs
                id="vectors"
                name="plot_vectors!"
                code={`plot_vectors!(ax, M, X; spacing=1, normalize=false, kwargs...)`}
                description={<>Plots a symbolic vector field as arrows by evaluating it at each point on a subsampled grid of the ranges of <code>M</code>. Arrow colors are mapped to vector lengths, with the colorrange centered symmetrically. The field <code>X</code> must be a <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the coordinates of <code>M</code>. On an embedded surface the components are in the basis of the <code>Manifold</code>, or the coordinate basis of its embedding if it has none.</>}
                args={[
                    ['ax', 'Axis3 or Axis', <>The GLMakie <code>Axis3</code> for an embedded surface, or <code>Axis</code> for a flat chart.</>],
                    ['M', 'Manifold', <>The manifold to plot over, with ranges and, to plot in 3D, an embedding.</>],
                    ['X', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the coordinates of <code>M</code>.</>],
                ]}
                kwargs={[
                    ['spacing', 'Int', '1', <>Subsampling stride applied to the ranges before evaluation. Increasing this reduces arrow density.</>],
                    ['normalize', 'Bool', 'false', <>When <code>true</code>, all arrows are scaled to unit length before plotting, showing direction only.</>],
                    ['lengthscale', 'Number', '1', <>Scale factor applied to arrow lengths.</>],
                    ['colormap', 'Any', ':viridis', <>The colormap used to color arrows by length.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# On a flat chart
fig = Figure()
ax = Axis(fig[1, 1])

@variables u v
F = Manifold((u, v); ranges=(range(-2, 2, 30), range(-2, 2, 30)))

# Rotational vector field
X = Tensor([-v, u])
plot_vectors!(ax, F, X, spacing=2, normalize=true)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# On the sphere
fig = Figure()
ax3 = Axis3(fig[1, 1])

@variables θ φ
embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
M = Manifold((θ, φ), embedding; ranges=(range(0.1, π-0.1, 20), range(0, 2π, 20)))

X = Tensor([sin(θ), cos(φ)])
plot_vectors!(ax3, M, X,
    spacing=2, normalize=true, lengthscale=0.15, colormap=:magma)`}
                    img={vectorfield}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The gradient of a scalar function as a vector field
f = sin(θ)^2 * cos(φ)
∂ = PartialDerivative((θ, φ))
gradf = (∂[:i] * f).tensor
plot_vectors!(ax3, M, gradf, spacing=2, lengthscale=0.1, colormap=:RdBu)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="vectors-positions"
                name="plot_vectors!"
                code={`plot_vectors!(ax, M, positions, Xs; normalize=false, kwargs...)`}
                description={<>Plots a list of individual vectors at specified positions. Unlike the field form, which evaluates a symbolic field over a grid, this accepts explicit lists of positions and vectors, making it the natural choice for visualizing parallel-transported vectors or geodesic tangents at discrete points. Each vector in <code>Xs</code> holds numeric components at the corresponding position, lifted through the basis of <code>M</code> on an embedded surface.</>}
                args={[
                    ['ax', 'Axis3 or Axis', <>The GLMakie axis to plot into.</>],
                    ['M', 'Manifold', <>The manifold the vectors are on.</>],
                    ['positions', 'Vector', <>An ordered list of coordinate pairs <code>(u, v)</code> at which to draw each vector.</>],
                    ['Xs', 'Vector{Tensor}', <>An ordered list of <Math>{'(1, 0)'}</Math>-tensors, one per position, giving the vector components in coordinate space.</>],
                ]}
                kwargs={[
                    ['normalize', 'Bool', 'false', <>When <code>true</code>, all arrows are scaled to unit length before plotting.</>],
                    ['lengthscale', 'Number', '1', <>Scale factor applied to arrow lengths.</>],
                    ['colormap', 'Any', ':viridis', <>The colormap used to color arrows by length.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Visualizing parallel-transported vectors alongside initial vectors
x0 = [π/4, 3π/4]
v0 = [0.5, 2]
w0 = [2, 0]
times = range(0.0, 1.5, 15)
trajectory = solve_parallel_transport(M, t -> x0 + v0 * t, w0, times)

# The vectors of a Trajectory are plotted directly: the path's velocity
# in red, and the transported vectors in blue
plot_vectors!(ax3, M, trajectory, which=:velocities, lengthscale=0.1, colormap=:reds)
plot_vectors!(ax3, M, trajectory, lengthscale=0.1, colormap=:ice)

# Individual vectors can also be given at explicit positions
positions = trajectory.positions
plot_vectors!(ax3, M, positions, [Tensor(w0) for _ in positions], lengthscale=0.1)`}
                    img={ptvector}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Plotting tangent vectors along a geodesic
x0 = [π/2, π/6]
v0 = [0.5, -0.5]
times = range(0.0, 5.0, 20)
trajectory = solve_geodesic(M, x0, v0, times)
plot_vectors!(ax3, M, trajectory,
    normalize=true, lengthscale=0.1, colormap=:viridis)`}
                />
            </FunctionDocs>

            <PageNav prev="Scalar Fields" next="Geodesics" />
        </>
    );
}
