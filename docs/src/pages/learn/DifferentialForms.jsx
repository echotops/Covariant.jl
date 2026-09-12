import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';
import Math from '../../components/Math/Math';

export default function DifferentialForms() {
    return (
        <>
            <p className="learn-title">Differential Forms</p>
            <p className="learn-heading" id="wedge-product">Wedge Product</p>
            <p className="learn-body">
                A differential k-form is an antisymmetric (0, k)-tensor. Both (0, 0)- and
                (0, 1)-tensors are inherently antisymmetric, so all scalars are 0-forms and
                all covectors are 1-forms, however not all (0, 2)-tensors are 2-forms. Just
                as the tensor product can take a (0, k)-tensor and a (0, p)-tensor to a
                (0, k+p)-tensor, the wedge product takes a k-form and a p-form to a k+p-form
            </p>
            <CodeBlock lang="julia"
code={`α = Tensor([1, -2]')
β = Tensor([3, 1]')
γ = α ∧ β`} 
result={`(0, 2)-Tensor:
[0.0 7.0; -7.0 0.0]
    (:co, :co)`}
            />
            <p className="learn-body">
                Note that the wedge product maintains antisymmetry, so <code>α ∧ β = -(β ∧ α)</code>.
                A direct consequence is that wedging a form with itself always returns
                the <Math>{`0`}</Math> form
            </p>
            <CodeBlock lang="julia"
code={`α ∧ α`} 
result={`(0, 2)-Tensor:
[0.0 0.0; 0.0 0.0]
    (:co, :co)`}
            />
            <p className="learn-heading" id="exterior-derivative">Exterior Derivative</p>
            <p className="learn-body">
                The exterior derivative takes a k-form to a k+1-form by differentiating and
                antisymmetrizing the components. One notable property of the exterior derivative
                is that applying it twice returns the <Math>{`0`}</Math> form
            </p>
            <CodeBlock lang="julia"
code={`@variables u v
∂ = PartialDerivative((u, v))
d = ExteriorDerivative(∂)
α = Tensor([u^2 * v, v + 2]')
d[:i] * α[:j]`} 
result={`(0, 2)-Tensor:
Num[0.0 u^2; -(u^2) 0.0]
    (:co, :co)`}
            />
            <p className="learn-heading" id="hodge-star">Hodge Star</p>
            <p className="learn-body">
                The Hodge star is an isomorphism that maps between k-forms and n-k-forms, where
                n is the dimension of the underlying space, and requires the definition of a metric
            </p>
            <CodeBlock lang="julia"
code={`e = Basis([
    Tensor([1, 0]),
    Tensor([0, 1])
])
g = metric(e)
⋆ = HodgeStar(g)
ω = Tensor([2, 1]')
⋆(ω)`} 
result={`(0, 1)-Tensor:
Num[-1.0, 2.0]
    (:co,)`}
            />
            <PageNav prev="Differential Geometry" next="Symbolic" />
        </>
    );
}