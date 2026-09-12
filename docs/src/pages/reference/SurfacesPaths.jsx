import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import surface from '../../assets/learn/surface.png';
import path from '../../assets/learn/path.png';

export default function SurfacesPaths() {
    return (
        <>
            <p className="learn-title">Surfaces & Paths</p>
            <p className="learn-body">
                Visualization in Covariant requires <code>CovariantMakie</code>, which
                provides GLMakie implementations of the plotting functions. All functions
                follow the GLMakie convention of mutating a passed <code>Axis3</code> and
                accepting any GLMakie keyword arguments via <code>kwargs</code>.
            </p>

            <FunctionDocs
                id="surface-embed"
                name="surface_2dembed!"
                code={`surface_2dembed!(ax, embedding, xs, ys; kwargs...)`}
                description={<>Plots a 2-dimensional surface embedded in <Math>{'\\mathbb{R}^3'}</Math> by evaluating the embedding function over a grid of coordinate values and passing the resulting point cloud to GLMakie's <code>surface!</code>. The embedding must be a function of two parameters returning a 3-element array. Defaults to a grey colormap.</>}
                args={[
                    ['ax', 'Axis3', <>The GLMakie <code>Axis3</code> to plot into.</>],
                    ['embedding', 'Function', <>A function <code>(u, v) -&gt; [x, y, z]</code> mapping coordinate values to a point in <Math>{'\\mathbb{R}^3'}</Math>.</>],
                    ['xs', 'AbstractRange', <>The range of values for the first coordinate.</>],
                    ['ys', 'AbstractRange', <>The range of values for the second coordinate.</>],
                ]}
                kwargs={[
                    ['colormap', 'Any', '[:grey, :grey]', <>The colormap passed to <code>surface!</code>. Any GLMakie colormap is accepted.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`fig = Figure()
ax3 = Axis3(fig[1, 1])

embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
θs = range(0, π, 50)
φs = range(0, 2π, 50)

surface_2dembed!(ax3, embedding, θs, φs)`}
                    img={surface}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Custom colormap and transparency
surface_2dembed!(ax3, embedding, θs, φs, colormap=:plasma, alpha=0.8)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="path-embed"
                name="path_2dembed!"
                code={`path_2dembed!(ax, embedding, path, times; kwargs...)`}
                description={<>Plots a parametric path on a surface embedded in <Math>{'\\mathbb{R}^3'}</Math> by evaluating the path function at each time, lifting the result through the embedding, and passing the resulting points to GLMakie's <code>lines!</code>. The path must return a 2-element array of coordinate values. Defaults to a light blue line of width 2.</>}
                args={[
                    ['ax', 'Axis3', <>The GLMakie <code>Axis3</code> to plot into.</>],
                    ['embedding', 'Function', <>A function <code>(u, v) -&gt; [x, y, z]</code> mapping coordinate values to a point in <Math>{'\\mathbb{R}^3'}</Math>.</>],
                    ['path', 'Function', <>A parametric function <code>t -&gt; [u, v]</code> returning coordinate values at each parameter value.</>],
                    ['times', 'AbstractRange', <>The range of parameter values at which to sample the path.</>],
                ]}
                kwargs={[
                    ['linewidth', 'Number', '2', <>The width of the plotted line.</>],
                    ['color', 'Any', ':lightblue', <>The color of the plotted line. Any GLMakie color is accepted.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`λ(t) = [t - π/2, t^3 - 3t + π/2]
times = range(0, 1.0, 50)
path_2dembed!(ax3, embedding, λ, times)`}
                    img={path}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A closed path — a latitude circle at θ = π/3
circle(t) = [π/3, t]
path_2dembed!(ax3, embedding, circle, range(0, 2π, 100),
    color=:red, linewidth=3)`}
                />
            </FunctionDocs>

            <PageNav prev="Simplify & Evaluate" next="Scalar Fields" />
        </>
    );
}
