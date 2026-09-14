import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function Derivatives() {
    return (
        <>
            <p className="learn-title">Derivatives</p>
            <p className="learn-body">
                Differentiation in Covariant is performed via <code>Base.:*</code>, contracting
                an indexed derivative operator against an <code>IndexedTensor</code>. The derivative
                index is appended as a new covariant index on the result. If that index label already
                appears in the tensor, a contraction is performed automatically, yielding a divergence.
            </p>

            <FunctionDocs
                id="partial-differentiation"
                name="Base.:* (PartialDerivative)"
                code={`Base.:*(∂::IndexedPartialDerivative, A::IndexedTensor)`}
                description={<>Differentiates each component of <code>A</code> with respect to every coordinate in <code>∂</code>, appending a new covariant index to the result. Given an <Math>{'(m, n)'}</Math>-tensor, returns an <Math>{'(m, n+1)'}</Math>-tensor. If the derivative index label already appears in <code>A</code>, the result is contracted over that index, yielding a divergence. Correct only when the basis vectors are constant — for a non-constant basis, use <Ref to={refLinks.CovariantDerivative}>CovariantDerivative</Ref>.</>}
                args={[
                    ['∂', 'IndexedPartialDerivative', <>The indexed partial derivative operator, produced by <code>PartialDerivative((coords...))[:i]</code>.</>],
                    ['A', 'IndexedTensor', <>The tensor to differentiate. Components must be symbolic expressions in the coordinates of <code>∂</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables u v
∂ = PartialDerivative((u, v))

# Differentiating a vector field yields a (1, 1)-tensor
X = Tensor([u * v, v^2 - 1])
∂[:i] * X[:j]`}
                    result={`(1, 1)-Tensor:
Num[v u; 0 2v]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Differentiating a (1, 1)-tensor yields a (1, 2)-tensor
A = Tensor([[u, 2v]', [3u, v^2]'])
∂[:k] * A[:i][:j]`}
                    result={`(1, 2)-Tensor:
Num[1 0; 3 0;;; 0 2; 0 2v]
    (:contra, :co, :co)
    (:i,), (:j, :k)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Repeated index triggers contraction — yields the divergence
∂[:i] * X[:i]`}
                    result={`v + 2v`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="covariant-differentiation"
                name="Base.:* (CovariantDerivative)"
                code={`Base.:*(∇::IndexedCovariantDerivative, A::IndexedTensor)`}
                description={<>Computes the covariant derivative of <code>A</code>, correcting the partial derivative for the curvature of the underlying space via the connection coefficients. Given an <Math>{'(m, n)'}</Math>-tensor, returns an <Math>{'(m, n+1)'}</Math>-tensor. For each contravariant index of <code>A</code>, a term <Math>{'+ \\Gamma^i_{kj} A^{\\cdots}_{\\cdots}'}</Math> is added; for each covariant index, a term <Math>{'- \\Gamma^k_{ij} A^{\\cdots}_{\\cdots}'}</Math> is subtracted. If the derivative index label already appears in <code>A</code>, the result is contracted, yielding a covariant divergence.</>}
                args={[
                    ['∇', 'IndexedCovariantDerivative', <>The indexed covariant derivative operator, produced by <code>CovariantDerivative(Γ, ∂)[:i]</code> or <code>levicivita((coords...), basis)[:i]</code>.</>],
                    ['A', 'IndexedTensor', <>The tensor to differentiate. Components must be symbolic expressions in the coordinates of the underlying <code>PartialDerivative</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
∇ = levicivita((θ, φ), e)

# Covariant derivative of a vector field on the 2-sphere
X = Tensor([sin(θ), 0])
∇[:i] * X[:j]`}
                    result={`(1, 1)-Tensor:
Num[cos(θ) 0; 0 cos(θ)]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Covariant derivative of a covector field
ω = Tensor([1, sin(θ)]')
∇[:i] * ω[:j]`}
                    result={`(0, 2)-Tensor:
Num[0 cos(θ); -cos(θ) 0]
    (:co, :co)
    (), (:j, :i)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Repeated index yields the covariant divergence
∇[:i] * X[:i]`}
                    result={`2cos(θ)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="exterior-differentiation"
                name="Base.:* (ExteriorDerivative)"
                code={`Base.:*(d::IndexedExteriorDerivative, A::IndexedTensor)`}
                description={<>Computes the exterior derivative of a differential form, taking a <Math>{'p'}</Math>-form to a <Math>{'(p+1)'}</Math>-form. The input must be a purely covariant <Math>{'(0, p)'}</Math>-tensor. Implemented by differentiating with the underlying <code>PartialDerivative</code> and fully antisymmetrizing the result, scaled by <Math>{'(p+1)!'}</Math>. Returns a <Ref to={refLinks.Tensor}>Tensor</Ref> directly rather than an <code>IndexedTensor</code>. The exterior derivative is nilpotent — applying it twice always returns the zero form, <Math>{'d^2 = 0'}</Math>.</>}
                args={[
                    ['d', 'IndexedExteriorDerivative', <>The indexed exterior derivative operator, produced by <code>ExteriorDerivative(∂)[:i]</code>.</>],
                    ['A', 'IndexedTensor', <>A purely covariant <Math>{'(0, p)'}</Math>-tensor representing a differential <Math>{'p'}</Math>-form.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables x y z
∂ = PartialDerivative((x, y, z))
d = ExteriorDerivative(∂)

# Exterior derivative of a 1-form yields an antisymmetric 2-form
α = Tensor([x^2, y*z, x]')
d[:k] * α[:i]`}
                    result={`(0, 2)-Tensor:
Num[0.0 0.0 -1.0; 0.0 0.0 y; 1.0 -y 0.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`@variables u v
∂ = PartialDerivative((u, v))
d = ExteriorDerivative(∂)

# Exterior derivative of a 0-form (scalar function) yields a 1-form
f = Tensor([u^2 * v]')
d[:i] * f[:i]`}
                    result={`(0, 1)-Tensor:
Num[2u*v, u^2]
    (:co,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Nilpotency: applying d twice always yields the zero form
β = d[:k] * α[:i]
d[:l] * β[:l, :i]`}
                    result={`(0, 3)-Tensor:
Num[0.0 0.0 0.0; 0.0 0.0 0.0; 0.0 0.0 0.0]
    (:co, :co, :co)`}
                />
            </FunctionDocs>

            <PageNav prev="Symmetry & Duality" next="Hodge Star" />
        </>
    );
}