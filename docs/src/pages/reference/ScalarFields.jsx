import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import scalarfield from '../../assets/learn/scalarfield.png';

export default function ScalarFields() {
    return (
        <>
            <p className="learn-title">Scalar Fields</p>

            <FunctionDocs
                id="scalar"
                name="scalar_2d!"
                code={`scalar_2d!(ax, coordinates, xs, ys, f; kwargs...)`}
                description={<>Plots a symbolic scalar field as a heatmap in <Math>{'\\mathbb{R}^2'}</Math> by evaluating the field at each point on a coordinate grid using <code>evaluate</code>. The field <code>f</code> must be a symbolic <code>Num</code> expression in the given coordinates. Passes the result to GLMakie's <code>heatmap!</code>. Defaults to the <code>:viridis</code> colormap without interpolation.</>}
                args={[
                    ['ax', 'Axis', <>The GLMakie <code>Axis</code> to plot into.</>],
                    ['coordinates', 'Tuple{Num}', <>A tuple of the symbolic variables the field is expressed in, matching the order of <code>xs</code> and <code>ys</code>.</>],
                    ['xs', 'AbstractRange', <>The range of values for the first coordinate.</>],
                    ['ys', 'AbstractRange', <>The range of values for the second coordinate.</>],
                    ['f', 'Num', <>A symbolic scalar expression in the given coordinates.</>],
                ]}
                kwargs={[
                    ['colormap', 'Any', ':viridis', <>The colormap passed to <code>heatmap!</code>. Any GLMakie colormap is accepted.</>],
                    ['interpolate', 'Bool', 'false', <>Whether to interpolate between heatmap cells.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`fig = Figure()
ax = Axis(fig[1, 1])

@variables u v
xs = range(-π, π, 100)
ys = range(-π, π, 100)

f = sin(u) * cos(v)
scalar_2d!(ax, (u, v), xs, ys, f)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Plotting the Ricci scalar of a curved coordinate system
@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
R = ricci_scalar((θ, φ), e, simple=true)
s = scalar_2d!(ax, (θ, φ), range(0.1, π-0.1, 100), range(0, 2π, 100), R,
    colormap=:RdBu)
Colorbar(fig[1, 2], s)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="scalar-embed"
                name="scalar_2dembed!"
                code={`scalar_2dembed!(ax, coordinates, embedding, xs, ys, f; kwargs...)`}
                description={<>Plots a symbolic scalar field on a 2-dimensional surface embedded in <Math>{'\\mathbb{R}^3'}</Math> by evaluating the field at each point on the coordinate grid and using it to color the surface. The surface geometry is determined by the embedding, and the coloring by the scalar values, passed together to GLMakie's <code>surface!</code>. Defaults to the <code>:viridis</code> colormap.</>}
                args={[
                    ['ax', 'Axis3', <>The GLMakie <code>Axis3</code> to plot into.</>],
                    ['coordinates', 'Tuple{Num}', <>A tuple of the symbolic variables the field is expressed in, matching the order of <code>xs</code> and <code>ys</code>.</>],
                    ['embedding', 'Function', <>A function <code>(u, v) -&gt; [x, y, z]</code> mapping coordinate values to a point in <Math>{'\\mathbb{R}^3'}</Math>.</>],
                    ['xs', 'AbstractRange', <>The range of values for the first coordinate.</>],
                    ['ys', 'AbstractRange', <>The range of values for the second coordinate.</>],
                    ['f', 'Num', <>A symbolic scalar expression in the given coordinates.</>],
                ]}
                kwargs={[
                    ['colormap', 'Any', ':viridis', <>The colormap passed to <code>surface!</code>. Any GLMakie colormap is accepted.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`fig = Figure()
ax3 = Axis3(fig[1, 1])

embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
θs = range(0.01, π, 50)
φs = range(0, 2π, 50)

R = ricci_scalar((θ, φ), e, simple=true)
s = scalar_2dembed!(ax3, (θ, φ), embedding, θs, φs, R,
    colormap=:RdBu, colorrange=(0, 2))
Colorbar(fig[1, 2], s)`}
                    img={scalarfield}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Plotting an arbitrary symbolic field on the sphere
f = sin(θ)^2 * cos(φ)
scalar_2dembed!(ax3, (θ, φ), embedding, θs, φs, f, colormap=:plasma)`}
                />
            </FunctionDocs>

            <PageNav prev="Surfaces & Paths" next="Vector Fields" />
        </>
    );
}
