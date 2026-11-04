import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';
import surface from '../../assets/learn/surface.png';
import path from '../../assets/learn/path.png';

export default function SurfacesPaths() {
    return (
        <>
            <p className="learn-title">Surfaces & Paths</p>
            <p className="learn-body">
                Visualization in Covariant requires <code>CovariantMakie</code>, which
                provides GLMakie implementations of the plotting functions. Every plotting function
                takes a <Ref to={refLinks.Manifold}>Manifold</Ref>, which holds the coordinates, metric, ranges and embedding
                once, so the same object is used for curvature, the solver, and plotting, and follows the GLMakie convention of mutating a passed <code>Axis3</code> (or
                <code>Axis</code> for a flat chart) and accepting any GLMakie keyword arguments
                via <code>kwargs</code>.
            </p>

            <FunctionDocs
                id="plot-surface"
                name="plot_surface!"
                code={`plot_surface!(ax, M; kwargs...)`}
                description={<>Plots an embedded surface by evaluating the embedding over the ranges of <code>M</code> and passing the resulting points to GLMakie's <code>surface!</code>. Requires a <code>Surface</code> with an embedding. Defaults to a grey colormap.</>}
                args={[
                    ['ax', 'Axis3', <>The GLMakie <code>Axis3</code> to plot into.</>],
                    ['M', 'Manifold', <>The manifold to plot, with an embedding and ranges.</>],
                ]}
                kwargs={[
                    ['colormap', 'Any', '[:grey, :grey]', <>The colormap passed to <code>surface!</code>. Any GLMakie colormap is accepted.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`fig = Figure()
ax3 = Axis3(fig[1, 1])

plot_surface!(ax3, M)`}
                    img={surface}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Custom colormap and transparency
plot_surface!(ax3, M, colormap=:plasma, alpha=0.8)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="plot-path"
                name="plot_path!"
                code={`plot_path!(ax, M, path, times; kwargs...)`}
                description={<>Plots a parametric path on a surface by evaluating the path function at each time, lifting the result through the embedding if there is one, and passing the points to GLMakie's <code>lines!</code>. The path must return the coordinate values at each time. Defaults to a light blue line of width 2.</>}
                args={[
                    ['ax', 'Axis3 or Axis', <>The GLMakie axis to plot into.</>],
                    ['M', 'Manifold', <>The manifold the path lies on, with an embedding if it is to be drawn in 3D.</>],
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
plot_path!(ax3, M, λ, times)`}
                    img={path}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A closed path — a latitude circle at θ = π/3
circle(t) = [π/3, t]
plot_path!(ax3, M, circle, range(0, 2π, 100),
    color=:red, linewidth=3)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="embedding-basis"
                name="embedding_basis"
                code={`embedding_basis(embedding, x)`}
                description={<>Computes the tangent basis vectors of an embedding at a point, by automatic differentiation with <code>ForwardDiff</code>. A <Ref to={refLinks.Manifold}>Manifold</Ref> built from an embedding finds the same vectors symbolically, so this is for numeric use, or for embeddings that Symbolics.jl can't trace. The result is the columns of the Jacobian of the embedding, the coordinate basis vectors <Math>{'\\partial / \\partial u^i'}</Math> at <code>x</code>, as a vector of vectors. These are the frame that vector components are plotted in when a <Ref to={refLinks.Manifold}>Manifold</Ref> has an embedding but no basis, so the basis need not be written out by hand.</>}
                args={[
                    ['embedding', 'Function', <>A function <code>(u, v) -&gt; [x, y, z]</code> returning an array.</>],
                    ['x', 'Vector{Float64}', <>The coordinate values to find the tangent vectors at.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
embedding_basis(embedding, [π/2, 0.0])`}
                    result={`2-element Vector{Vector{Float64}}:
 [6.123233995736766e-17, 0.0, -1.0]
 [0.0, 1.0, -0.0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A Manifold built from an embedding finds these vectors itself,
# so vectors can be plotted without writing out a basis
@variables θ φ
M = Manifold((θ, φ), embedding;
    ranges=(range(0.1, π-0.1, 20), range(0, 2π, 20)))
plot_vectors!(ax3, M, Tensor([sin(θ), cos(φ)]), spacing=2, normalize=true)`}
                />
            </FunctionDocs>

            <PageNav prev="Simplify & Evaluate" next="Scalar Fields" />
        </>
    );
}
