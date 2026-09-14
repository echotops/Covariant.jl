import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';
import surface from '../../assets/learn/surface.png';
import path from '../../assets/learn/path.png';
import scalarfield from '../../assets/learn/scalarfield.png';
import vectorfield from '../../assets/learn/vectorfield.png';

export default function Visualization() {
    return (
        <>
            <p className="learn-title">Visualization</p>
            <p className="learn-heading" id="setup">Setup</p>
            <p className="learn-body">
                Plotting with Covariant can be accomplished with GLMakie in <code>Makie.jl</code>.
                Most of the visualization functions are for 2-dimensional manifolds embedded in 3
                dimensions. The main two objects needed are the embedding and the vector basis
            </p>
            <CodeBlock lang="julia"
code={`fig = Figure()
ax3 = Axis3(fig[1,1])
# Unit sphere embedding in 3D
embedding(u, v) = [
    cos(v)*sin(u),
    sin(v)*sin(u),
    cos(u)
]
# Coordinate ranges
θs = range(0, π, 50)
φs = range(0, 2π, 50)
# Unit sphere basis vectors
@variables θ, φ
basis = Basis([
    Tensor([cos(φ)*cos(θ), sin(φ)*cos(θ), -sin(θ)]),
    Tensor([-sin(φ)*sin(θ), cos(φ)*sin(θ), 0])
])`}
            />
            <p className="learn-heading" id="surfaces">Surfaces</p>
            <p className="learn-body">
                Surfaces can be plotted with <Ref to={refLinks['surface_2dembed!']}>surface_2dembed!</Ref>
            </p>
            <CodeBlock lang="julia"
code={`surface_2dembed!(ax3, embedding, θs, φs)`} 
img={surface}
            />
            <p className="learn-heading" id="paths">Paths</p>
            <p className="learn-body">
                Paths are defined as parametrics and then plotted with <Ref to={refLinks['path_2dembed!']}>path_2dembed!</Ref>
            </p>
            <CodeBlock lang="julia"
code={`λ(t) = [t - π/2, t^3 - 3t + π/2]
times = range(0, 1.0, 50)
path_2dembed!(ax3, embedding, λ, times)`}
img={path}
            />
            <p className="learn-heading" id="scalar-fields">Scalar Fields</p>
            <p className="learn-body">
                Scalar functions of the <code>@variables</code> can be plotted with <Ref to={refLinks['scalar_2dembed!']}>scalar_2dembed!</Ref>
            </p>
            <CodeBlock lang="julia"
code={`R = ricci_scalar((θ, φ), basis)
scalar_2dembed!(ax3, (θ, φ), embedding, θs, φs, R)`}
img={scalarfield}
            />
            <p className="learn-heading" id="vector-fields">Vector Fields</p>
            <p className="learn-body">
                Vector functions of the <code>@variables</code> can be plotted with <Ref to={refLinks['vectors_2dembed!']}>vectors_2dembed!</Ref>
            </p>
            <CodeBlock lang="julia"
code={`X = Tensor([sin(θ), cos(φ)])
vectors_2dembed!(ax3, (θ, φ), basis, embedding, θs, φs, X, spacing=2, normalize=true)`}
img={vectorfield}
            />
            <p className="learn-body">
                Each of these functions also accepts standard GLMakie styling keywords like
                <code>colormap</code> and <code>colorrange</code> — see the <Ref to="/reference/surfaces-and-paths">Reference</Ref> for
                the full list.
            </p>
            <PageNav prev="Symbolic" next="Solver" />
        </>
    );
}