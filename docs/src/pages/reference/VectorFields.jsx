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
                The three vector plotting functions differ in two ways — whether the output
                space is <Math>{'\\mathbb{R}^2'}</Math> or embedded in <Math>{'\\mathbb{R}^3'}</Math>,
                and whether the input is a field defined over a coordinate grid or a list of
                individual vectors at specified positions. All three evaluate symbolic tensor
                components via <code>evaluate</code> and pass arrows to GLMakie, with vector
                lengths mapped to color by default.
            </p>

            <FunctionDocs
                id="vectors"
                name="vectors_2d!"
                code={`vectors_2d!(ax, coordinates, xs, ys, X; spacing=1, normalize=false, kwargs...)`}
                description={<>Plots a symbolic vector field as arrows in <Math>{'\\mathbb{R}^2'}</Math> by evaluating the field at each point on a subsampled coordinate grid. Arrow colors are mapped to vector lengths, with the colorrange centered symmetrically. The field <code>X</code> must be a <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the given coordinates.</>}
                args={[
                    ['ax', 'Axis', <>The GLMakie <code>Axis</code> to plot into.</>],
                    ['coordinates', 'Tuple{Num}', <>A tuple of the symbolic variables <code>X</code> is expressed in, matching the order of <code>xs</code> and <code>ys</code>.</>],
                    ['xs', 'AbstractRange', <>The range of values for the first coordinate.</>],
                    ['ys', 'AbstractRange', <>The range of values for the second coordinate.</>],
                    ['X', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the given coordinates.</>],
                ]}
                kwargs={[
                    ['spacing', 'Int', '1', <>Subsampling stride applied to <code>xs</code> and <code>ys</code> before evaluation. Increasing this reduces arrow density.</>],
                    ['normalize', 'Bool', 'false', <>When <code>true</code>, all arrows are scaled to unit length before plotting, showing direction only.</>],
                    ['lengthscale', 'Number', '1', <>Scale factor applied to arrow lengths.</>],
                    ['colormap', 'Any', ':viridis', <>The colormap used to color arrows by length.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`fig = Figure()
ax = Axis(fig[1, 1])

@variables u v
xs = range(-2, 2, 30)
ys = range(-2, 2, 30)

# Rotational vector field
X = Tensor([-v, u])
vectors_2d!(ax, (u, v), xs, ys, X, spacing=2, normalize=true)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Gradient field of a scalar function
f = u^2 + v^2
∂ = PartialDerivative((u, v))
grad = Tensor([∂[:i] * Tensor([f])[1] for i in 1:2])  # ∇f as a vector
vectors_2d!(ax, (u, v), xs, ys, grad, spacing=2, lengthscale=0.2, colormap=:plasma)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="vectors-embed"
                name="vectors_2dembed!"
                code={`vectors_2dembed!(ax, coordinates, basis, embedding, xs, ys, X; spacing=1, normalize=false, kwargs...)`}
                description={<>Plots a symbolic vector field on a 2-dimensional surface embedded in <Math>{'\\mathbb{R}^3'}</Math>. At each grid point, the symbolic vector components are evaluated and contracted with the basis to produce a tangent vector in <Math>{'\\mathbb{R}^3'}</Math>, which is then drawn as an arrow at the embedded position. Arrow colors are mapped to vector lengths.</>}
                args={[
                    ['ax', 'Axis3', <>The GLMakie <code>Axis3</code> to plot into.</>],
                    ['coordinates', 'Tuple{Num}', <>A tuple of the symbolic variables <code>X</code> is expressed in, matching the order of <code>xs</code> and <code>ys</code>.</>],
                    ['basis', 'Basis', <>The vector basis used to lift components from coordinate space to <Math>{'\\mathbb{R}^3'}</Math>.</>],
                    ['embedding', 'Function', <>A function <code>(u, v) -&gt; [x, y, z]</code> mapping coordinate values to a point in <Math>{'\\mathbb{R}^3'}</Math>.</>],
                    ['xs', 'AbstractRange', <>The range of values for the first coordinate.</>],
                    ['ys', 'AbstractRange', <>The range of values for the second coordinate.</>],
                    ['X', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the given coordinates.</>],
                ]}
                kwargs={[
                    ['spacing', 'Int', '1', <>Subsampling stride applied to <code>xs</code> and <code>ys</code> before evaluation. Increasing this reduces arrow density.</>],
                    ['normalize', 'Bool', 'false', <>When <code>true</code>, all arrows are scaled to unit length before plotting, showing direction only.</>],
                    ['lengthscale', 'Number', '1', <>Scale factor applied to arrow lengths.</>],
                    ['colormap', 'Any', ':viridis', <>The colormap used to color arrows by length.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`fig = Figure()
ax3 = Axis3(fig[1, 1])

embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
@variables θ φ
basis = Basis([
    Tensor([cos(φ)*cos(θ), sin(φ)*cos(θ), -sin(θ)]),
    Tensor([-sin(φ)*sin(θ), cos(φ)*sin(θ), 0])
])
θs = range(0.1, π-0.1, 20)
φs = range(0, 2π, 20)

X = Tensor([sin(θ), cos(φ)])
vectors_2dembed!(ax3, (θ, φ), basis, embedding, θs, φs, X,
    spacing=2, normalize=true, lengthscale=0.15, colormap=:magma)`}
                    img={vectorfield}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Plotting the gradient of the Ricci scalar as a vector field
∂ = PartialDerivative((θ, φ))
R = ricci_scalar((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]), simple=true)
gradR = Tensor([∂[:i] * Tensor([R])[1] for i in 1:2])
vectors_2dembed!(ax3, (θ, φ), basis, embedding, θs, φs, gradR,
    spacing=2, lengthscale=0.1, colormap=:RdBu)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="vector-embed"
                name="vector_2dembed!"
                code={`vector_2dembed!(ax, coordinates, basis, embedding, positions, Xs; normalize=false, kwargs...)`}
                description={<>Plots a list of individual vectors at specified positions on a surface embedded in <Math>{'\\mathbb{R}^3'}</Math>. Unlike <code>vectors_2dembed!</code>, which evaluates a symbolic field over a grid, this function accepts explicit lists of positions and vectors — making it the natural choice for visualizing parallel-transported vectors or geodesic tangents at discrete points. Each vector in <code>Xs</code> is contracted with the basis at the corresponding position to produce a tangent vector in <Math>{'\\mathbb{R}^3'}</Math>.</>}
                args={[
                    ['ax', 'Axis3', <>The GLMakie <code>Axis3</code> to plot into.</>],
                    ['coordinates', 'Tuple{Num}', <>A tuple of the symbolic variables used to evaluate the basis at each position.</>],
                    ['basis', 'Basis', <>The vector basis used to lift components from coordinate space to <Math>{'\\mathbb{R}^3'}</Math>.</>],
                    ['embedding', 'Function', <>A function <code>(u, v) -&gt; [x, y, z]</code> mapping coordinate values to a point in <Math>{'\\mathbb{R}^3'}</Math>.</>],
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
solution = solve_parallel_transport((θ, φ), basis, x0, v0, w0, times)
positions = [(u[1], u[2]) for u in solution.u]
vectors  = [Tensor([u[5], u[6]]) for u in solution.u]

# Initial velocity vectors in red, transported vectors in blue
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions,
    [Tensor(v0) for _ in positions], lengthscale=0.1, colormap=:reds)
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions,
    vectors, lengthscale=0.1, colormap=:ice)`}
                    img={ptvector}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Plotting tangent vectors along a geodesic
x0 = [π/2, π/6]
v0 = [0.5, -0.5]
times = range(0.0, 5.0, 20)
solution = solve_geodesic((θ, φ), basis, x0, v0, times)
positions = [(u[1], u[2]) for u in solution.u]
tangents  = [Tensor([u[3], u[4]]) for u in solution.u]
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions,
    tangents, normalize=true, lengthscale=0.1, colormap=:viridis)`}
                />
            </FunctionDocs>

            <PageNav prev="Scalar Fields" next="Geodesics" />
        </>
    );
}
