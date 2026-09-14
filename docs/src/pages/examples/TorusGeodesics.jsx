import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/Topbar/Topbar';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import style from '../examples.module.css';

export default function TorusGeodesics() {
    useEffect(() => {
        document.title = 'Geodesics on a Torus — Covariant.jl';
    }, []);

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.wrap} style={{ maxWidth: 800 }}>
                    <p className={style.title}>Geodesics on a Torus</p>
                    <div className={style.cardTags} style={{ marginBottom: 30 }}>
                        <span>Geometry</span>
                        <span>Solver</span>
                    </div>
                    <p className="learn-body">
                        Every geodesic on a sphere is a great circle — closed, and all identical up
                        to rotation. A torus has no such symmetry: where a geodesic starts changes
                        its entire character. This example contrasts two of them, launched from the
                        outer and inner equators of the same torus.
                    </p>

                    <p className="learn-heading">Setup</p>
                    <p className="learn-body">
                        A torus with major radius <code>R</code> (distance from the center of the
                        hole to the center of the tube) and minor radius <code>r</code> (the tube's
                        own radius) is embedded as
                    </p>
                    <CodeBlock lang="julia"
code={`using Covariant, Symbolics, DifferentialEquations, GLMakie

R, r = 3.0, 1.0
embedding(θ, φ) = [
    (R + r*cos(θ))*cos(φ),
    (R + r*cos(θ))*sin(φ),
    r*sin(θ)
]`}
                    />
                    <p className="learn-body">
                        where <code>θ</code> goes around the tube and <code>φ</code> goes around
                        the hole. The basis vectors are the partial derivatives of the embedding,
                        entered directly the same way as every other surface on the Visualization page
                    </p>
                    <CodeBlock lang="julia"
code={`@variables θ φ
basis = Basis([
    Tensor([-r*sin(θ)*cos(φ), -r*sin(θ)*sin(φ), r*cos(θ)]),
    Tensor([-(R + r*cos(θ))*sin(φ), (R + r*cos(θ))*cos(φ), 0])
])
metric(basis, simple=true)`}
result={`(0, 2)-Tensor:
Num[1 0; 0 ((3.0 + cos(θ))^2)*(cos(φ)^2) + ((-3.0 - cos(θ))^2)*(sin(φ)^2)]
    (:co, :co)`}
                    />
                    <p className="learn-body">
                        The metric is already diagonal — <code>θ</code> and <code>φ</code> are
                        orthogonal directions everywhere on the torus — though <code>simplify</code>{' '}
                        doesn't quite collapse the <code>φφ</code>-component the rest of the way: it's
                        exactly <Math>{'(R + r\\cos\\theta)^2'}</Math>, but reaching that requires
                        knowing <Math>{'(-x)^2 = x^2'}</Math> and <Math>{'\\cos^2\\varphi + \\sin^2\\varphi = 1'}</Math>{' '}
                        at once, which the symbolic engine doesn't chain together automatically.
                    </p>

                    <p className="learn-heading">The Outer Equator Is Stable</p>
                    <p className="learn-body">
                        The outer equator, <Math>{'\\theta = 0'}</Math>, is the circle farthest from
                        the central axis. Its Gaussian curvature is positive there, the same sign as
                        a sphere's, and a geodesic launched slightly off of it behaves the same way a
                        pendulum does near the bottom of its swing: it oscillates around the equator
                        rather than wandering away from it.
                    </p>
                    <CodeBlock lang="julia"
code={`x0 = [0.05, 0.0]   # Just off the outer equator
v0 = [0.0, 1.0]     # Moving purely around the hole
times = range(0.0, 100.0, 4000)
solution = solve_geodesic((θ, φ), basis, x0, v0, times)

θs = [u[1] for u in solution.u]
round.(extrema(θs); digits=2)`}
result={`(-0.05, 0.05)`}
                    />
                    <CodeBlock lang="julia"
code={`fig = Figure()
ax3 = Axis3(fig[1,1])
surface_2dembed!(ax3, embedding, range(0, 2π, 100), range(0, 2π, 100))
lines!(ax3, [Point3f(embedding(u[1], u[2])) for u in solution.u])`}
                    />

                    <p className="learn-heading">The Inner Equator Is Unstable</p>
                    <p className="learn-body">
                        The inner equator, <Math>{'\\theta = \\pi'}</Math>, sits on the side of the
                        tube closest to the central axis, where the surface curves like a saddle —
                        negative Gaussian curvature. The same tiny perturbation that only oscillated
                        near the outer equator does something much more dramatic here.
                    </p>
                    <CodeBlock lang="julia"
code={`x0 = [π + 0.05, 0.0]   # Just off the inner equator
v0 = [0.0, 1.0]
times = range(0.0, 15.0, 1500)
solution = solve_geodesic((θ, φ), basis, x0, v0, times)

θs = [u[1] for u in solution.u]
round.(extrema(θs); digits=2)`}
result={`(3.19, 9.37)`}
                    />
                    <p className="learn-body">
                        <Math>{'\\theta'}</Math> lingers near <Math>{'\\pi \\approx 3.14'}</Math>{' '}
                        at first, barely moving — then sweeps rapidly all the way across, past the
                        outer equator at <Math>{'\\theta = 2\\pi \\approx 6.28'}</Math>, and slows to
                        a stop again near <Math>{'3\\pi \\approx 9.42'}</Math>, a second copy of the
                        same inner equator one full loop later. It's the geometric analog of a
                        pendulum released a hair's breadth from balancing upside down: a long pause,
                        a fast swing through the bottom, and a long pause again at the top.
                    </p>
                    <CodeBlock lang="julia"
code={`lines!(ax3, [Point3f(embedding(u[1], u[2])) for u in solution.u])`}
                    />
                    <p className="learn-body">
                        Unlike the sphere, where every great circle looks the same, the torus has
                        geometry that genuinely depends on where you are — the same equation, the
                        same nearly-identical starting conditions, and two completely different
                        outcomes.
                    </p>

                    <Link to="/examples" className={style.backLink}>← Back to Examples</Link>
                </div>
            </div>
        </>
    );
}
