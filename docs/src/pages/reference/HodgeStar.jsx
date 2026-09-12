import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function HodgeStar() {
    return (
        <>
            <p className="learn-title">Hodge Star</p>

            <FunctionDocs
                id="hodge-star"
                name="HodgeStar"
                code={`(hodge::HodgeStar)(A::Tensor)`}
                description={<>Applies the Hodge star operator to a differential form, mapping a <Math>{'p'}</Math>-form to an <Math>{'(n-p)'}</Math>-form, where <Math>{'n'}</Math> is the dimension of the space. The input must be a purely covariant <Math>{'(0, p)'}</Math>-tensor. Internally, all <Math>{'p'}</Math> indices are raised using the inverse metric, the result is contracted with the Levi-Civita symbol across <Math>{'p'}</Math> indices, and the whole expression is scaled by <Math>{'\\frac{\\sqrt{|\\det g|}}{p!}'}</Math>. When the input is a top-form (<Math>{'p = n'}</Math>), the result is a scalar. Applied by calling the <code>HodgeStar</code> instance directly on a <code>Tensor</code>.</>}
                args={[
                    ['A', 'Tensor', <>A purely covariant <Math>{'(0, p)'}</Math>-tensor representing a differential <Math>{'p'}</Math>-form.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`e = Basis([Tensor([1, 0]), Tensor([0, 1])])
g = metric(e)
⋆ = HodgeStar(g)

# In 2D, a 1-form maps to a 1-form
α = Tensor([3, -1]')
⋆(α)`}
                    result={`(0, 1)-Tensor:
Num[1.0, 3.0]
    (:co,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# In 3D, a 1-form maps to a 2-form
e3 = Basis([Tensor([1,0,0]), Tensor([0,1,0]), Tensor([0,0,1])])
⋆3 = HodgeStar(metric(e3))
β = Tensor([1, 0, 0]')
⋆3(β)`}
                    result={`(0, 2)-Tensor:
Num[0.0 0.0 0.0; 0.0 0.0 1.0; 0.0 -1.0 0.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A top-form maps to a scalar
ω = Tensor([[0, 1]', [-1, 0]']')   # A 2-form in 2D
⋆(ω)`}
                    result={`-1.0`}
                />
            </FunctionDocs>

            <PageNav prev="Derivatives" next="Metric & Connections" />
        </>
    );
}