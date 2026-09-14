import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function DifferentialGeometry() {
    return (
        <>
            <p className="learn-title">Differential Geometry</p>
            <p className="learn-heading" id="metric-tensor">Metric Tensor</p>
            <p className="learn-body">
                The metric tensor holds the inner products of basis vectors — the same information
                as the Gram matrix from linear algebra, just packaged so it transforms correctly
                under a change of basis. The <Ref to={refLinks.metric}>metric</Ref>
                function constructs the metric tensor from a <Ref to={refLinks.Basis}>Basis</Ref>, and an optional
                inner product, with the standard Euclidean inner product as default
            </p>
            <CodeBlock lang="julia"
code={`e = Basis([
    Tensor([1, 0]),
    Tensor([0, 1])
])
g = metric(e)`} 
result={`(0, 2)-Tensor:
[1 0; 0 1]
    (:co, :co)`}
            />
            <p className="learn-body">
                By passing in the included <Ref to={refLinks.minkowski}>minkowski</Ref> metric, the Minkowski metric
                can be constructed for Special Relativity
            </p>
            <CodeBlock lang="julia"
code={`η = metric(
    Basis([
        Tensor([1, 0, 0, 0]),
        Tensor([0, 1, 0, 0]),
        Tensor([0, 0, 1, 0]),
        Tensor([0, 0, 0, 1])
    ]),
    minkowski
)`} 
result={`(0, 2)-Tensor:
[-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]
  (:co, :co)`}
            />
            <p className="learn-body">
                The metric, along with the inverse metric, found by <Ref to={refLinks.inv}>inv</Ref>, allows index
                raising and lowering via contraction
            </p>
            <CodeBlock lang="julia"
code={`𝔤 = inv(g)
ω = Tensor([1, -2]') ⊗ Tensor([-3, 2]') # A (0, 2)-tensor
𝔤[:i, :j] * ω[:i, :k]`}
result={`(1, 1)-Tensor:
Symbolics.Num[-3 2; 6 -4]
    (:contra, :co)
    (:j,), (:k,)`}
            />
            <p className="learn-heading" id="covariant-derivative">Covariant Derivative</p>
            <p className="learn-body">
                Coordinates can be defined using <code>Symbolics.jl</code> and the <code>@variables</code> macro.
                This allows the construction of tensors that are functions of the coordinates. Differentiating
                tensor components is performed with the <Ref to={refLinks.PartialDerivative}>PartialDerivative</Ref> type.
                In linear algebra the basis is fixed, so differentiating components tells you
                everything about how a vector changes; here the basis can vary from point to point,
                so <code>PartialDerivative</code> alone only gives the correct derivative when the
                basis vectors happen to be constant
            </p>
            <CodeBlock lang="julia"
code={`@variables u v
∂ = PartialDerivative((u, v))
X = Tensor([u * v, v^2 - 1])
∂[:i] * X[:j]`} 
result={`(1, 1)-Tensor:
Num[v u; 0 2v]
    (:contra, :co)
    (:j,), (:i,)`}
            />
            <p className="learn-body">
                For differentiating tensors with a non-constant basis, the <Ref to={refLinks.CovariantDerivative}>CovariantDerivative</Ref> type
                is used. Defining a <code>CovariantDerivative</code> requires connection coefficients (also
                called Christoffel symbols). You can define your own coefficients and pass them in,
                or use <Ref to={refLinks.christoffel}>christoffel</Ref> to calculate the coefficients of the Levi-Civita
                connection. Alternatively, the shortcut <Ref to={refLinks.levicivita}>levicivita</Ref> can define the
                Levi-Civita connection in one line.
            </p>
            <CodeBlock lang="julia"
code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
∂ = PartialDerivative((θ, φ))
Γ = christoffel((θ, φ), e) # The Christoffel symbols of the Levi-Civita connection
∇ = CovariantDerivative(Γ, ∂) # Alternatively ∇ = levicivita((θ, φ), e)
X = Tensor([sin(θ), 0])
∇[:i] * X[:j]`} 
result={`(1, 1)-Tensor:
Num[cos(θ) 0; 0 cos(θ)]
    (:contra, :co)
    (:j,), (:i,)`}
            />
            <p className="learn-heading" id="curvature">Curvature</p>
            <p className="learn-body">
                Curvature measures how much a basis twists as it moves across a space — the reason
                a vector parallel-transported around a small loop doesn't come back to where it
                started (covered on the Solver page). There are a few measurements of curvature
                provided, the first being the Riemann
                tensor. Passing the <code>simple=true</code> argument applies <Ref to={refLinks.simplify}>simplify</Ref> to
                the result
            </p>
            <CodeBlock lang="julia"
code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
riemann((θ, φ), e, simple=true)`} 
result={`(1, 3)-Tensor:
Num[0.0 0.0; 0.0 -1.0;;; 0.0 sin(θ)^2; 0 0;;;; 0.0 0; 1.0 0;;; -(sin(θ)^2) 0; 0 0]
    (:contra, :co, :co, :co)`}
            />
            <p className="learn-body">
                Contracting two indices of the Riemann tensor yields the Ricci tensor
            </p>
            <CodeBlock lang="julia"
code={`ricci((θ, φ), e, simple=true)`} 
result={`(0, 2)-Tensor:
Num[1.0 0.0; 0.0 sin(θ)^2]
    (:co, :co)`}
            />
            <p className="learn-body">
                And then raising via the metric and contracting the Ricci tensor yields
                the Ricci scalar
            </p>
            <CodeBlock lang="julia"
code={`ricci_scalar((θ, φ), e, simple=true)`} 
result={`2`}
            />
            <p className="learn-body">
                Combining the metric, Ricci tensor, and Ricci scalar yields the Einstein tensor, which
                has the special property that its divergence is <Math>{`0`}</Math>
            </p>
            <CodeBlock lang="julia"
code={`einstein((θ, φ), e, simple=true)`} 
result={`(0, 2)-Tensor:
Num[0.0 0.0; 0.0 0]
    (:co, :co)`}
            />
            <p className="learn-heading" id="lie-bracket">Lie Bracket</p>
            <p className="learn-body">
                The Lie bracket of two vector fields <Ref to={refLinks.lie}>lie</Ref> measures the failure of the
                vector fields to commute — similar in spirit to the matrix commutator <Math>{'AB - BA'}</Math>,
                but for flows rather than fixed linear maps. Starting from a point, it measures the difference between
                infinitesimal flows along X and then Y, and infinitesimal flows along Y and then X
            </p>
            <CodeBlock lang="julia"
code={`@variables u v
∂ = PartialDerivative((u, v))
X = Tensor([u, v])
Y = Tensor([u^2, -v + 2])
lie(X, Y, ∂)`} 
result={`(1, 0)-Tensor:
Num[u^2, -2]
    (:contra,)`}
            />
            <PageNav prev="Tensor Algebra" next="Differential Forms" />
        </>
    );
}