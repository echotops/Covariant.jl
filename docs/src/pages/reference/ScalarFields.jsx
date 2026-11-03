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
                id="plot-scalar"
                name="plot_scalar!"
                code={`plot_scalar!(ax, M, f; kwargs...)`}
                description={<>Plots a symbolic scalar field over a surface by compiling the field to a numeric function and evaluating it at each point of the ranges of <code>M</code>. On a flat chart the values are drawn as a heatmap, and on an embedded surface they color the surface, passed to GLMakie's <code>heatmap!</code> or <code>surface!</code>. Returns the plot, which can be passed to <code>Colorbar</code>. Defaults to the <code>:viridis</code> colormap.</>}
                args={[
                    ['ax', 'Axis3 or Axis', <>The GLMakie <code>Axis3</code> for an embedded surface, or <code>Axis</code> for a flat chart.</>],
                    ['M', 'Manifold', <>The manifold to plot over, with ranges and, to plot in 3D, an embedding.</>],
                    ['f', 'Num', <>A symbolic scalar expression in the coordinates of <code>M</code>.</>],
                ]}
                kwargs={[
                    ['colormap', 'Any', ':viridis', <>The colormap passed to the plot. Any GLMakie colormap is accepted.</>],
                    ['interpolate', 'Bool', 'false', <>Whether to interpolate between heatmap cells. Only used on a flat chart.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# On a flat chart
fig = Figure()
ax = Axis(fig[1, 1])

@variables u v
F = Manifold((u, v); ranges=(range(-π, π, 100), range(-π, π, 100)))
plot_scalar!(ax, F, sin(u) * cos(v))`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The Ricci scalar on the sphere
fig = Figure()
ax3 = Axis3(fig[1, 1])

@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
M = Manifold((θ, φ), e; ranges=(range(0.01, π, 50), range(0, 2π, 50)),
    embedding=(u, v) -> [cos(v)*sin(u), sin(v)*sin(u), cos(u)])

R = simplify(ricci_scalar(M))
s = plot_scalar!(ax3, M, R, colormap=:RdBu, colorrange=(0, 2))
Colorbar(fig[1, 2], s)`}
                    img={scalarfield}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# An arbitrary symbolic field on the sphere
plot_scalar!(ax3, M, sin(θ)^2 * cos(φ), colormap=:plasma)`}
                />
            </FunctionDocs>

            <PageNav prev="Surfaces & Paths" next="Vector Fields" />
        </>
    );
}
