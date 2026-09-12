import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';
import Math from '../../components/Math/Math';

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
                indices. Any free indices are retained for subsequent operations and an <code>IndexedTensor</code>
                is returned, unless the result is a scalar
            </p>
            <CodeBlock lang="julia"
code={`v = Tensor([2, -1])
ω = Tensor([-2, 3]')
v[:i] * ω[:i]`}
result={`7`}
            />
            <CodeBlock lang="julia"
code={`A = Tensor([[2, -3], [-4, -1]]')
B = Tensor([[-1, 1], [2, 2]]')
A[:i][:j] * B[:j][:k]`}
result={`(1, 1)-Tensor:
[-6 -4; 2 -8]
    (:contra, :co)
    (:i,), (:k,)`}
            />
            <p className="learn-body">
                A tensor can also be contracted against one of its own indices
            </p>
            <CodeBlock lang="julia"
code={`A = Tensor([[2, 1], [-3, -1]]')
A[:i][:i]`}
result={`1`}
            />
            <p className="learn-body">
                Contraction with two indices of the same variance requires the metric, which itself
                requires a basis and inner product, topics on the next page
            </p>
            <p className="learn-heading" id="symmetrization">Symmetrization</p>
            <p className="learn-body">
                For symmetrization, Covariant provides <code>symmetrize</code>, which symmetrizes
                a tensor along the specified indices, all of the same variance. Mathematically, the
                function sums permutations of the indices, and dividies by the number of permutations.
                For a (2, 0)-tensor, this looks like <Math>{'\\frac{1}{2}(A^{ij} + A^{ji})'}</Math>
            </p>
            <CodeBlock lang="julia"
code={`A = Tensor([[2, 1], [-3, 1]])
symmetrize(A[:i, :j], :i, :j)`}
result={`(2, 0)-Tensor:
[2.0 -1.0; -1.0 1.0]
    (:contra, :contra)`}
            />
            <p className="learn-body">
                Similarly, antisymmetrization can be performed with <code>antisymmetrize</code>, with
                similar implementation to <code>symmetrize</code>, but that it takes the difference instead
                of the sum. For a (2, 0)-tensor, this looks like <Math>{'\\frac{1}{2}(A^{ij} - A^{ji})'}</Math>
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
                One of the few operations that takes in a <code>Tensor</code>, the tensor product takes
                an (m, n)-tensor and a (p, q)-tensor to an (m+p, n+q)-tensor
            </p>
            <CodeBlock lang="julia"
code={`v = Tensor([2, -1])
w = Tensor([3, 4])
L = v ⊗ w`}
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
                A basis is an ordered set of tensors that allows you to build the metric tensor
                and take derivatives, two operations that are vital in geometry. Tensor components
                can be used to take linear combinations of basis vectors
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
                A vector basis and a covector basis are considered dual if the <Math>{`i`}</Math>th basis
                vector times the <Math>{`j`}</Math>th basis covector yields
                <Math>{`\\ 1`}</Math> if <Math>{`i=j`}</Math> and <Math>{`0`}</Math> if <Math>{`i \\neq j`}</Math>.
                This condition is so common that it is called the Kronecker Delta <Math>{`\\delta^i_j`}</Math>.
                Covariant includes the <code>KrockerDelta</code> type with this condition, along with
                <code>dual_basis</code> that finds a dual basis
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