import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function TensorOperations() {
    return (
        <>
            <p className="learn-title">Tensor Operations</p>

            <FunctionDocs
                id="tensor-product"
                name="⊗"
                code={`⊗(A::Tensor, B::Tensor)
⊗(e::Basis, f::Basis)`}
                description={<>The tensor product, taking an <Math>{'(m, n)'}</Math>-tensor and a <Math>{'(p, q)'}</Math>-tensor to an <Math>{'(m+p, n+q)'}</Math>-tensor by multiplying every component of <Math>{'A'}</Math> with every component of <Math>{'B'}</Math>. Also defined on two <Ref to={refLinks.Basis}>Basis</Ref> objects, producing a higher-rank basis by taking the tensor product of every pair of elements. Both forms can be chained to build higher-rank tensors and bases.</>}
                args={[
                    ['A', 'Tensor | Basis', <>The left operand.</>],
                    ['B', 'Tensor | Basis', <>The right operand. Must be the same type as <code>A</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`v = Tensor([1, 2])
w = Tensor([3, 5]')
v ⊗ w   # (1, 0) ⊗ (0, 1) → (1, 1)`}
                    result={`(1, 1)-Tensor
[3 5; 6 10]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Tensor products can be chained for higher rank
α = Tensor([2, 3]')
L = v ⊗ w
L ⊗ α ⊗ v`}
                    result={`(2, 2)-Tensor
[6 10; 12 20;;; 9 15; 18 30;;;; 12 20; 24 40;;; 18 30; 36 60]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Also defined on bases — produces a higher-rank basis
e = Basis([Tensor([1, 0]), Tensor([0, 1])])
ε = Basis([Tensor([1, 0]'), Tensor([0, 1]')])
e ⊗ ε`}
                    result={`(1, 1)-Basis
[1 0; 0 0]
[0 1; 0 0]
[0 0; 1 0]
[0 0; 0 1]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="wedge-product"
                name="∧"
                code={`∧(A::Tensor, B::Tensor)`}
                description={<>The wedge product, taking a differential <Math>{'p'}</Math>-form and a <Math>{'q'}</Math>-form to a <Math>{'(p+q)'}</Math>-form. Both operands must be purely covariant <Math>{'(0, p)'}</Math>- and <Math>{'(0, q)'}</Math>-tensors of the same dimension. Implemented as the antisymmetrization of the tensor product, scaled by the multinomial coefficient <Math>{'\\frac{(p+q)!}{p!\\,q!}'}</Math>. The wedge product is anticommutative — <Math>{'\\alpha \\wedge \\beta = -( \\beta \\wedge \\alpha)'}</Math> — so wedging a form with itself always yields zero.</>}
                args={[
                    ['A', 'Tensor', <>A purely covariant <Math>{'(0, p)'}</Math>-tensor representing a differential <Math>{'p'}</Math>-form.</>],
                    ['B', 'Tensor', <>A purely covariant <Math>{'(0, q)'}</Math>-tensor representing a differential <Math>{'q'}</Math>-form, of the same dimension as <code>A</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`α = Tensor([1, -2]')
β = Tensor([3, 1]')
α ∧ β   # 1-form ∧ 1-form → 2-form`}
                    result={`(0, 2)-Tensor
[0 7; -7 0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Anticommutativity: α ∧ β = -(β ∧ α)
β ∧ α`}
                    result={`(0, 2)-Tensor
[0 -7; 7 0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Wedging a form with itself always yields zero
α ∧ α`}
                    result={`(0, 2)-Tensor
[0 0; 0 0]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="dot-product"
                name="LinearAlgebra.⋅"
                code={`LinearAlgebra.:⋅(A::Tensor, B::Tensor)`}
                description={<>The standard Euclidean inner product on two vectors. Both operands must be <Math>{'(1, 0)'}</Math>-tensors. For inner products in a curved space or with a non-Euclidean metric, use the metric tensor and contraction instead.</>}
                args={[
                    ['A', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor.</>],
                    ['B', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor of the same dimension as <code>A</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`v = Tensor([1, 2])
w = Tensor([3, -1])
v ⋅ w`}
                    result={`1`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# For a metric inner product, use the metric tensor and contraction
@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
g = metric(e)
𝔤 = inv(g)
X = Tensor([1, 0]')
Y = Tensor([0, 1]')
𝔤[:i, :j] * X[:i] * Y[:j]   # Inner product via metric`}
                    result={`0`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Only (1, 0)-tensors are accepted
v = Tensor([1, 2])
ω = Tensor([3, -1]')
v ⋅ ω`}
                    result={`ERROR: ⋅ needs two (1, 0)-tensors, but the variances are (:contra,) and (:co,)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="trace"
                name="LinearAlgebra.tr"
                code={`LinearAlgebra.tr(A::Tensor)`}
                description={<>Computes the trace of a <Math>{'(1, 1)'}</Math>-tensor, the sum of its diagonal <Math>{'A^i{}_i'}</Math>. A <Math>{'(1, 1)'}</Math>-tensor is an endomorphism, a linear map from a space to itself, and its trace is the same in every basis, so it needs no metric. It is equivalent to the self-contraction <code>A[:i][:i]</code>.</>}
                args={[
                    ['A', 'Tensor', <>A square <Math>{'(1, 1)'}</Math>-tensor.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`A = Tensor([2 -3; 4 -1])
tr(A)`}
                    result={`1`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Only endomorphisms have an invariant trace
tr(Tensor([2 -3; 4 -1], :co, :co))`}
                    result={`ERROR: tr needs a (1, 1)-tensor, but the variance is (:co, :co)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="determinant"
                name="LinearAlgebra.det"
                code={`LinearAlgebra.det(A::Tensor)`}
                description={<>Computes the determinant of a <Math>{'(1, 1)'}</Math>-tensor, the factor by which the linear map it defines scales volumes. Like the trace, the determinant of an endomorphism is the same in every basis, so it needs no metric or volume form. Integer entries give an exact result.</>}
                args={[
                    ['A', 'Tensor', <>A square <Math>{'(1, 1)'}</Math>-tensor.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`A = Tensor([2 -3; 4 -1])
det(A)`}
                    result={`10`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The determinant of a rotation is 1
@variables θ
R = Tensor([cos(θ) -sin(θ); sin(θ) cos(θ)])
simplify(det(R))`}
                    result={`1`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="interior-product"
                name="interior"
                code={`interior(X::Tensor, ω::Tensor)`}
                description={<>Computes the interior product <Math>{'\\iota_X \\omega'}</Math> of a vector <Math>{'X'}</Math> with a differential form <Math>{'\\omega'}</Math>, contracting <Math>{'X'}</Math> into the first index: <Math display>{'(\\iota_X \\omega)_{j_2...j_p} = X^i \\omega_{i j_2...j_p}'}</Math> Given a <Math>{'(0, p)'}</Math>-form it returns a <Math>{'(0, p-1)'}</Math>-tensor, or a scalar when <Math>{'p = 1'}</Math>.</>}
                args={[
                    ['X', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor.</>],
                    ['ω', 'Tensor', <>A differential form, a tensor with only covariant indices, of the same dimension as <code>X</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`X = Tensor([2, 3])
interior(X, Tensor([5, 7]'))`}
                    result={`31`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Contracting a vector into a 2-form gives a 1-form
ω = Tensor([0 1; -1 0], :co, :co)
interior(X, ω)`}
                    result={`(0, 1)-Tensor
[-3, 2]`}
                />
            </FunctionDocs>

            <PageNav prev="Indexing" next="Indexed Arithmetic" />
        </>
    );
}