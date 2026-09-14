import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function TensorAlgebra() {
    return (
        <>
            <p className="learn-title">Tensor Algebra</p>
            <p className="learn-heading" id="addition">Addition</p>
            <p className="learn-body">
                Tensor addition and subtraction are performed element-wise. The tensors must have
                identical variances
            </p>
            <CodeBlock lang="julia"
code={`v = Tensor([1, 2])
w = Tensor([-3, 1])
v[:i] + w[:i]`}
result={`(1, 0)-Tensor:
[-2, 3]
    (:contra,)
    (:i,), ()`}
            />
            <p className="learn-body">
                Addition returns an <code>IndexedTensor</code> that can be used in subsequent operations
            </p>
            <CodeBlock lang="julia"
code={`L = Tensor([[4, -2], [3, 3]])
M = Tensor([[0, 0], [-3, 3]])
L[:i, :j] - M[:i, :j]`}
result={`(2, 0)-Tensor:
[4 -2; 6 0]
    (:contra, :contra)
    (:i, :j), ()`}
            />
            <p className="learn-heading" id="scaling">Scaling</p>
            <p className="learn-body">
                Scaling is also performed element-wise, and returns an <code>IndexedTensor</code>
            </p>
            <CodeBlock lang="julia"
code={`g = Tensor([[2, -1]', [0, 2]']')
2 * g[:i, :j]`}
result={`(0, 2)-Tensor:
[4 -2; 0 4]
    (:co, :co)
    (), (:i, :j)`}
            />
            <p className="learn-heading" id="contraction">Contraction</p>
            <p className="learn-body">
                Contraction takes a linear combination along a pair of contravariant and covariant
                indices — this is the single operation behind the dot product, matrix-vector and
                matrix-matrix multiplication, and the trace, all of which are just sums over a
                repeated index. Any free indices are retained for subsequent operations and an
                <code>IndexedTensor</code> is returned, unless the result is a scalar
            </p>
            <CodeBlock lang="julia"
code={`v = Tensor([2, -1])
ω = Tensor([-2, 3]')
v[:i] * ω[:i]   # The dot product v · ω`}
result={`7`}
            />
            <CodeBlock lang="julia"
code={`A = Tensor([[2, -3], [-4, -1]]')
B = Tensor([[-1, 1], [2, 2]]')
A[:i][:j] * B[:j][:k]   # Matrix multiplication`}
result={`(1, 1)-Tensor:
[-6 -4; 2 -8]
    (:contra, :co)
    (:i,), (:k,)`}
            />
            <p className="learn-body">
                A tensor can also be contracted against one of its own indices, generalizing the
                trace of a matrix
            </p>
            <CodeBlock lang="julia"
code={`A = Tensor([[2, 1], [-3, -1]]')
A[:i][:i]   # tr(A)`}
result={`1`}
            />
            <p className="learn-body">
                Contraction with two indices of the same variance requires the metric, which itself
                requires a basis and inner product, topics on the next page
            </p>
            <p className="learn-heading" id="symmetrization">Symmetrization</p>
            <p className="learn-body">
                For symmetrization, Covariant provides <Ref to={refLinks.symmetrize}>symmetrize</Ref>, which symmetrizes
                a tensor along the specified indices, all of the same variance. Mathematically, the
                function sums permutations of the indices, and dividies by the number of permutations.
                For a (2, 0)-tensor, this looks like <Math>{'\\frac{1}{2}(A^{ij} + A^{ji})'}</Math> — the
                same <Math>{'(A + A^T)/2'}</Math> used to pull the symmetric part out of a matrix
            </p>
            <CodeBlock lang="julia"
code={`A = Tensor([[2, 1], [-3, 1]])
symmetrize(A[:i, :j], :i, :j)`}
result={`(2, 0)-Tensor:
[2.0 -1.0; -1.0 1.0]
    (:contra, :contra)`}
            />
            <p className="learn-body">
                Similarly, antisymmetrization can be performed with <Ref to={refLinks.antisymmetrize}>antisymmetrize</Ref>, with
                similar implementation to <Ref to={refLinks.symmetrize}>symmetrize</Ref>, but that it takes the difference instead
                of the sum. For a (2, 0)-tensor, this looks like <Math>{'\\frac{1}{2}(A^{ij} - A^{ji})'}</Math> — the
                other half of the matrix, <Math>{'(A - A^T)/2'}</Math>
            </p>
            <CodeBlock lang="julia"
code={`A = Tensor([[2, 1], [-3, 1]])
antisymmetrize(A[:i, :j], :i, :j)`}
result={`(2, 0)-Tensor:
[0.0 2.0; -2.0 0.0]
    (:contra, :contra)`}
            />
            <p className="learn-heading" id="tensor-product">Tensor Product</p>
            <p className="learn-body">
                Tensor product doesn't have a real linear algebra equivalent for general tensors —
                the closest is the outer product <Math>{'vw^T'}</Math>, which turns two vectors into
                a matrix. The tensor product generalizes that: instead of a fixed matrix, it takes
                an (m, n)-tensor and a (p, q)-tensor to an (m+p, n+q)-tensor
            </p>
            <CodeBlock lang="julia"
code={`v = Tensor([2, -1])
w = Tensor([3, 4])
L = v ⊗ w   # The outer product vwᵀ`}
result={`(2, 0)-Tensor:
[6 8; -3 -4]
    (:contra, :contra)`}
            />
            <p className="learn-body">
                Tensor products can be chained together to generate higher order tensors
            </p>
            <CodeBlock lang="julia"
code={`α = Tensor([2, 3]')
L ⊗ α ⊗ v`}
result={`(3, 1)-Tensor:
[24 32; -12 -16;;; 36 48; -18 -24;;;; -12 -16; 6 8;;; -18 -24; 9 12]
    (:contra, :contra, :co, :contra)`}
            />
            <p className="learn-heading" id="basis-and-duality">Basis and Duality</p>
            <p className="learn-body">
                A basis, in the usual linear algebra sense, is an ordered set of linearly
                independent vectors that every other vector can be written as a combination
                of — this is what makes the metric tensor and derivatives well-defined later on.
                Covariant represents one as an array of vector-type tensors, and a vector's
                components relative to that basis are recovered by contracting against it
            </p>
            <CodeBlock lang="julia"
code={`e = Basis([
    Tensor([1, 1]),
    Tensor([0, 1])
])
v = Tensor([2, -1])
v[:i] * e[:i]`}
result={`(1, 0)-Tensor:
[2, 1]
  (:contra,)`}
            />
            <p className="learn-body">
                Every vector basis has a dual covector basis — the covector analog of the dual
                vectors introduced on the previous page — defined by the same property used in
                linear algebra: the <Math>{`i`}</Math>th dual basis covector paired with the{' '}
                <Math>{`j`}</Math>th basis vector yields <Math>{`\\ 1`}</Math> if <Math>{`i=j`}</Math> and{' '}
                <Math>{`0`}</Math> if <Math>{`i \\neq j`}</Math>.
                This condition is so common that it is called the Kronecker Delta <Math>{`\\delta^i_j`}</Math>.
                Covariant includes the <Ref to={refLinks.KroneckerDelta}>KroneckerDelta</Ref> type with this condition, along with
                <Ref to={refLinks.dual_basis}>dual_basis</Ref> that finds a dual basis
            </p>
            <CodeBlock lang="julia"
code={`ϵ = dual_basis(e)
δ = KroneckerDelta()
for i in 1:2, j in 1:2
    println(ϵ[i][:k] * e[j][:k] == δ[i, j])
end`}
result={`true
true
true
true`}
            />
            <PageNav prev="Tensors" next="Differential Geometry" />
        </>
    );
}