import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/Topbar/Topbar';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import style from '../examples.module.css';

export default function Schwarzschild() {
    useEffect(() => {
        document.title = 'Schwarzschild Spacetime — Covariant.jl';
    }, []);

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.wrap} style={{ maxWidth: 800 }}>
                    <p className={style.title}>Schwarzschild Spacetime</p>
                    <div className={style.cardTags} style={{ marginBottom: 30 }}>
                        <span>Relativity</span>
                        <span>Symbolic</span>
                    </div>
                    <p className="learn-body">
                        Every other example on this page embeds a surface in ordinary 3D space and
                        builds a basis from its tangent vectors. Spacetime around a black hole
                        doesn't embed anywhere so simple — instead, this example builds the metric
                        directly from an orthonormal frame, the same trick used for special
                        relativity on the Differential Geometry page, just with a frame that now
                        depends on position.
                    </p>

                    <p className="learn-heading">An Orthonormal Frame</p>
                    <p className="learn-body">
                        The Schwarzschild metric describes the vacuum spacetime around a
                        non-rotating mass <Math>{'M'}</Math>. Rather than deriving a basis from an
                        embedding, this example writes down four "basis vectors" that are just
                        scaled coordinate directions, chosen so that the Minkowski inner product
                        between them reproduces the metric directly
                    </p>
                    <CodeBlock lang="julia"
code={`using Covariant, Symbolics

@variables t r θ φ M
f = 1 - 2M/r

basis = Basis([
    Tensor([sqrt(f), 0, 0, 0]),
    Tensor([0, 1/sqrt(f), 0, 0]),
    Tensor([0, 0, r, 0]),
    Tensor([0, 0, 0, r*sin(θ)])
])
metric(basis, minkowski, simple=true)`}
result={`(0, 2)-Tensor:
Num[-1 - ((-2M) / r) 0 0 0; 0 r / (-2M + r) 0 0; 0 0 r^2 0; 0 0 0 (r^2)*(sin(θ)^2)]
    (:co, :co)`}
                    />
                    <p className="learn-body">
                        which is exactly the familiar line element{' '}
                        <Math>{'ds^2 = -(1-\\tfrac{2M}{r})dt^2 + \\frac{dr^2}{1-\\tfrac{2M}{r}} + r^2d\\theta^2 + r^2\\sin^2\\theta\\, d\\varphi^2'}</Math>.
                    </p>

                    <p className="learn-heading">Christoffel Symbols</p>
                    <p className="learn-body">
                        Every curvature function accepts an <code>inner_product</code>, the same
                        way <code>metric</code> does, so <code>minkowski</code> carries through the
                        whole calculation
                    </p>
                    <CodeBlock lang="julia"
code={`Γ = christoffel((t, r, θ, φ), basis, minkowski)
evaluate(Γ, Dict(M => 1.0, r => 5.0, θ => π/3, φ => 0.0))`}
result={`(1, 2)-Tensor:
[0.0 0.06666666666666667 0.0 0.0; 0.024 0.0 0.0 0.0; 0.0 0.0 0.0 0.0; 0.0 0.0 0.0 0.0;;; 0.06666666666666667 0.0 0.0 0.0; 0.0 -0.06666666666666667 0.0 0.0; 0.0 0.0 0.2 0.0; 0.0 0.0 0.0 0.2;;; 0.0 0.0 0.0 0.0; 0.0 0.0 -3.0 0.0; 0.0 0.2 0.0 0.0; 0.0 0.0 0.0 0.577350269189626;;; 0.0 0.0 0.0 0.0; 0.0 0.0 0.0 -2.2499999999999996; 0.0 0.0 0.0 -0.4330127018922194; 0.0 0.2 0.577350269189626 0.0]
  (:contra, :co, :co)`}
                    />
                    <p className="learn-body">
                        These match the standard textbook Christoffel symbols for Schwarzschild
                        component by component — <Math>{'\\Gamma^r_{tt} = \\frac{Mf}{r^2}'}</Math>,{' '}
                        <Math>{'\\Gamma^\\theta_{r\\theta} = \\frac{1}{r}'}</Math>, and so on.
                    </p>

                    <p className="learn-heading">A Vacuum Solution</p>
                    <p className="learn-body">
                        The defining property of the Schwarzschild metric is that it solves
                        Einstein's field equations in a vacuum — its Ricci tensor is exactly zero
                        everywhere outside the mass, even though the Riemann tensor (the tidal
                        forces an observer would actually feel) is not
                    </p>
                    <CodeBlock lang="julia"
code={`ricci((t, r, θ, φ), basis, minkowski, simple=true)`}
result={`(0, 2)-Tensor:
Num[0 0.0 0.0 0.0; 0.0 0 0 0.0; 0.0 0 0 0.0; 0.0 0.0 0.0 0]
    (:co, :co)`}
                    />
                    <p className="learn-body">
                        Zero, exactly, straight out of the symbolic engine — the entire curvature of
                        Schwarzschild spacetime lives in the part of the Riemann tensor that the
                        Ricci trace doesn't see.
                    </p>

                    <Link to="/examples" className={style.backLink}>← Back to Examples</Link>
                </div>
            </div>
        </>
    );
}
