import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../../components/Topbar/Topbar';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import style from '../examples.module.css';

export default function SpecialRelativity() {
    useEffect(() => {
        document.title = 'Special Relativity Intervals — Covariant.jl';
    }, []);

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.wrap} style={{ maxWidth: 800 }}>
                    <p className={style.title}>Special Relativity Intervals</p>
                    <div className={style.cardTags} style={{ marginBottom: 30 }}>
                        <span>Relativity</span>
                    </div>
                    <p className="learn-body">
                        Special relativity is the flat special case of the Schwarzschild example's
                        orthonormal-frame trick — the basis doesn't even need to depend on position.
                        What makes it interesting is what stays the same when the coordinates
                        themselves change: the spacetime interval between two events, no matter which
                        inertial observer measures it.
                    </p>

                    <p className="learn-heading">Setup</p>
                    <p className="learn-body">
                        The standard basis paired with <code>minkowski</code> gives flat spacetime
                        directly, the same way it's introduced on the Differential Geometry page
                    </p>
                    <CodeBlock lang="julia"
code={`using Covariant

basis = Basis([
    Tensor([1.0, 0, 0, 0]),
    Tensor([0, 1.0, 0, 0]),
    Tensor([0, 0, 1.0, 0]),
    Tensor([0, 0, 0, 1.0])
])
metric(basis, minkowski)`}
result={`(0, 2)-Tensor:
[-1.0 0.0 0.0 0.0; 0.0 1.0 0.0 0.0; 0.0 0.0 1.0 0.0; 0.0 0.0 0.0 1.0]
    (:co, :co)`}
                    />
                    <p className="learn-body">
                        Two events, five seconds and three light-seconds apart along{' '}
                        <Math>{'x'}</Math>, one light-second apart along <Math>{'y'}</Math>, give a
                        displacement vector whose interval comes straight from{' '}
                        <code>minkowski</code>
                    </p>
                    <CodeBlock lang="julia"
code={`Δx = Tensor([5.0, 3.0, 1.0, 0.0])
minkowski(Δx, Δx)`}
result={`-15.0`}
                    />
                    <p className="learn-body">
                        Negative, so the events are timelike separated — a slower-than-light
                        observer could witness both.
                    </p>

                    <p className="learn-heading">Invariance Under a Boost</p>
                    <p className="learn-body">
                        A Lorentz boost isn't part of Covariant's API — it's just the linear
                        transformation of coordinates that a moving observer would use, written as
                        an ordinary Julia function
                    </p>
                    <CodeBlock lang="julia"
code={`function boost(v, β)
    γ = 1/sqrt(1 - β^2)
    t, x, y, z = v
    return [γ*(t - β*x), γ*(x - β*t), y, z]
end

Δx_boosted = Tensor(boost(Δx.data, 0.6))   # An observer moving at 0.6c`}
result={`(1, 0)-Tensor:
[4.0, 0.0, 1.0, 0.0]
    (:contra,)`}
                    />
                    <p className="learn-body">
                        The boosted observer disagrees about both the time and the distance between
                        the events — but recomputing the interval from their own numbers
                    </p>
                    <CodeBlock lang="julia"
code={`minkowski(Δx_boosted, Δx_boosted)`}
result={`-15.0`}
                    />
                    <p className="learn-body">
                        gives back exactly the same <Math>{'-15.0'}</Math>. This is what it means for
                        a boost to be a symmetry of Minkowski space: it can also be applied directly
                        to the basis vectors themselves, and the metric they produce doesn't change
                        at all
                    </p>
                    <CodeBlock lang="julia"
code={`boosted_basis = Basis([Tensor(boost(e.data, 0.6)) for e in basis.elements])
metric(boosted_basis, minkowski)`}
result={`(0, 2)-Tensor:
[-1.0 0.0 0.0 0.0; 0.0 1.0 0.0 0.0; 0.0 0.0 1.0 0.0; 0.0 0.0 0.0 1.0]
    (:co, :co)`}
                    />
                    <p className="learn-body">
                        The same <Math>{'\\eta'}</Math> as before — a boosted observer's basis is
                        just as orthonormal as the original one, which is exactly why the interval
                        it measures always agrees.
                    </p>

                    <Link to="/examples" className={style.backLink}>← Back to Examples</Link>
                </div>
            </div>
        </>
    );
}
