import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/Topbar/Topbar';
import CodeBlock from '../../components/Code/CodeBlock';
import style from '../examples.module.css';

export default function EllipsoidCurvature() {
    useEffect(() => {
        document.title = 'Curvature of an Ellipsoid — Covariant.jl';
    }, []);

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.wrap} style={{ maxWidth: 800 }}>
                    <p className={style.title}>Curvature of an Ellipsoid</p>
                    <div className={style.cardTags} style={{ marginBottom: 30 }}>
                        <span>Curvature</span>
                        <span>Symbolic</span>
                    </div>
                    <p className="learn-body">
                        Every example on the Learn pages uses a sphere, whose curvature happens to
                        be the same constant everywhere — which hides an important fact: curvature
                        is usually a function of position, not a single number. An ellipsoid makes
                        that visible immediately.
                    </p>

                    <p className="learn-heading">Setup</p>
                    <p className="learn-body">
                        A spheroid — an ellipsoid of revolution with equatorial radius <code>a</code>{' '}
                        and polar radius <code>c</code> — is embedded the same way as the sphere on
                        the Visualization page, just with independent scale factors on each axis
                    </p>
                    <CodeBlock lang="julia"
code={`using Covariant, Symbolics, GLMakie

a, c = 1.5, 0.5
embedding(θ, φ) = [a*sin(θ)*cos(φ), a*sin(θ)*sin(φ), c*cos(θ)]

@variables θ φ
basis = Basis([
    Tensor([a*cos(θ)*cos(φ), a*cos(θ)*sin(φ), -c*sin(θ)]),
    Tensor([-a*sin(θ)*sin(φ), a*sin(θ)*cos(φ), 0])
])
metric(basis, simple=true)`}
result={`(0, 2)-Tensor:
Num[2.25(cos(θ)^2) + 0.25(sin(θ)^2) 0; 0 2.25(sin(θ)^2)]
    (:co, :co)`}
                    />
                    <p className="learn-body">
                        Unlike the sphere's metric, the <code>θθ</code>-component here isn't
                        constant — it depends on <code>θ</code>, which is already a hint that the
                        curvature won't be either.
                    </p>

                    <p className="learn-heading">A Curvature That Isn't Constant</p>
                    <p className="learn-body">
                        Computing <code>ricci_scalar</code> and evaluating it at the
                        equator versus near a pole gives two very different numbers
                    </p>
                    <CodeBlock lang="julia"
code={`R = ricci_scalar((θ, φ), basis)
evaluate(R, Dict(θ => π/2, φ => 0.0))   # At the equator`}
result={`8.0`}
                    />
                    <CodeBlock lang="julia"
code={`evaluate(R, Dict(θ => 0.5, φ => 0.0))   # Away from the equator, toward a pole`}
result={`0.1559973648806882`}
                    />
                    <p className="learn-body">
                        The flattened equator, where the surface bends sharply, is over 50 times
                        more curved than the region nearer the poles, where it's almost flat. Notice
                        that <code>simple=true</code> was left off here — for this particular metric,
                        passing it to <code>ricci_scalar</code> causes <code>Symbolics.simplify</code> to
                        rewrite the expression into an algebraically equivalent form with enormous
                        coefficients that don't cancel cleanly in floating point, corrupting the
                        result once it's evaluated numerically. It's a genuine sharp edge in the
                        symbolic engine, not just this example — reach for <code>simple=true</code>{' '}
                        when you want a nicer symbolic expression to look at, but evaluate from the
                        unsimplified result when you need reliable numbers.
                    </p>

                    <p className="learn-heading">Visualizing It</p>
                    <p className="learn-body">
                        Passing the same curvature expression to <code>scalar_2dembed!</code> colors
                        the whole surface by its local curvature at once
                    </p>
                    <CodeBlock lang="julia"
code={`fig = Figure()
ax3 = Axis3(fig[1,1])
θs = range(0.05, π - 0.05, 100)
φs = range(0, 2π, 100)
scalar_2dembed!(ax3, (θ, φ), embedding, θs, φs, R, colormap=:viridis)`}
                    />
                    <p className="learn-body">
                        The band around the equator should stand out sharply from the much dimmer
                        caps near the poles — the same contrast the two numbers above already showed,
                        now visible over the entire surface at once.
                    </p>

                    <Link to="/examples" className={style.backLink}>← Back to Examples</Link>
                </div>
            </div>
        </>
    );
}
