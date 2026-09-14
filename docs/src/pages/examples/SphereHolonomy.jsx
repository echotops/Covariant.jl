import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/Topbar/Topbar';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import style from '../examples.module.css';

export default function SphereHolonomy() {
    useEffect(() => {
        document.title = 'Holonomy on a Sphere — Covariant.jl';
    }, []);

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.wrap} style={{ maxWidth: 800 }}>
                    <p className={style.title}>Holonomy on a Sphere</p>
                    <div className={style.cardTags} style={{ marginBottom: 30 }}>
                        <span>Curvature</span>
                        <span>Solver</span>
                    </div>
                    <p className="learn-body">
                        Parallel-transport a vector around any closed loop on a curved surface and
                        it comes back rotated — the rotation angle equals the total curvature
                        enclosed by the loop. This is Gauss-Bonnet in its most direct form, and it
                        holds for <em>any</em> simple closed loop, not just ones made of geodesics.
                        That means we can use the simplest possible loop: a rectangle in coordinate
                        space.
                    </p>

                    <p className="learn-heading">Setup</p>
                    <p className="learn-body">
                        The unit sphere basis is the same one from the Visualization and Solver
                        pages. The loop bounds a latitude-longitude rectangle — two meridian arcs
                        and two latitude arcs — deliberately kept away from the poles, where the{' '}
                        <code>(θ, φ)</code> coordinates become singular
                    </p>
                    <CodeBlock lang="julia"
code={`using Covariant, Symbolics, DifferentialEquations, GLMakie

@variables θ φ
basis = Basis([
    Tensor([cos(φ)*cos(θ), sin(φ)*cos(θ), -sin(θ)]),
    Tensor([-sin(φ)*sin(θ), cos(φ)*sin(θ), 0])
])

θ1, θ2 = π/3, 2π/3
Δφ = π/2`}
                    />
                    <p className="learn-body">
                        For the unit sphere, the area enclosed by this rectangle — and therefore the
                        holonomy angle Gauss-Bonnet predicts — has a closed form
                    </p>
                    <CodeBlock lang="julia"
code={`predicted = Δφ * (cos(θ1) - cos(θ2))`}
result={`1.5707963267948963`}
                    />
                    <p className="learn-body">
                        exactly <Math>{'\\pi/2'}</Math>, for this choice of <code>θ1</code>,{' '}
                        <code>θ2</code>, and <code>Δφ</code>.
                    </p>

                    <p className="learn-heading">Tracing the Loop</p>
                    <p className="learn-body">
                        The path only needs to be written down once — its velocity is found
                        automatically, the same as on the Solver page
                    </p>
                    <CodeBlock lang="julia"
code={`function path(t)
    if t < 1
        [θ1, Δφ*t]
    elseif t < 2
        [θ1 + (θ2-θ1)*(t-1), Δφ]
    elseif t < 3
        [θ2, Δφ*(3-t)]
    else
        [θ2 + (θ1-θ2)*(t-3), 0.0]
    end
end

w0 = [1.0, 0.0]
times = range(0.0, 4.0, 4000)
solution = solve_parallel_transport_path((θ, φ), basis, path, w0, times)`}
                    />

                    <p className="learn-heading">Measuring the Rotation</p>
                    <CodeBlock lang="julia"
code={`w_initial = Tensor(w0)
w_final = Tensor([solution.u[end][1], solution.u[end][2]])
acos(w_initial ⋅ w_final / (norm(w_initial) * norm(w_final)))`}
result={`1.5713436617822683`}
                    />
                    <p className="learn-body">
                        Within the solver's tolerance, that's <Math>{'\\pi/2'}</Math> — the vector
                        comes back rotated by exactly the enclosed curvature, with nothing about
                        curvature entering the calculation except the shape of the loop itself.
                    </p>

                    <p className="learn-heading">Visualizing It</p>
                    <CodeBlock lang="julia"
code={`embedding(θ, φ) = [cos(φ)*sin(θ), sin(φ)*sin(θ), cos(θ)]

fig = Figure()
ax3 = Axis3(fig[1,1])
surface_2dembed!(ax3, embedding, range(0, π, 100), range(0, 2π, 100))
path_2dembed!(ax3, embedding, path, times)

positions = [(θ1, 0.0), (θ1, 0.0)]   # The loop closes, so both vectors sit at the same point
vectors = [Tensor(w0), Tensor([solution.u[end][1], solution.u[end][2]])]
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions, vectors, colormap=:reds)`}
                    />

                    <Link to="/examples" className={style.backLink}>← Back to Examples</Link>
                </div>
            </div>
        </>
    );
}
