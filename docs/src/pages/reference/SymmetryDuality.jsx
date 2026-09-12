import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function SymmetryDuality() {
    return (
        <>
            <p className="learn-title">Symmetry & Duality</p>

            <FunctionDocs
                id="symmetrize"
                name="symmetrize"
                code={`symmetrize(A::IndexedTensor, indices...)`}
                description={<>Symmetrizes a tensor across the specified indices by summing over all permutations of those indices and dividing by the number of permutations. For a <Math>{'(2, 0)'}</Math>-tensor this yields <Math>{'\\frac{1}{2}(A^{ij} + A^{ji})'}</Math>, and the pattern extends naturally to higher rank. All specified indices must belong to <code>A</code> and must share the same variance — mixing contravariant and covariant indices raises an error. Returns a <code>Tensor</code>.</>}
                args={[
                    ['A', 'IndexedTensor', <>The tensor to symmetrize.</>],
                    ['indices...', 'Symbol', <>Two or more index labels to symmetrize over. All must be present in <code>A</code> and share the same variance.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`A = Tensor([[2, 1], [-3, 1]])
symmetrize(A[:i, :j], :i, :j)`}
                    result={`(2, 0)-Tensor:
[2.0 -1.0; -1.0 1.0]
    (:contra, :contra)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Symmetrizing an already symmetric tensor leaves it unchanged
g = Tensor([[1, 0]', [0, 1]']')
symmetrize(g[:i, :j], :i, :j)`}
                    result={`(0, 2)-Tensor:
[1.0 0.0; 0.0 1.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Mixing contravariant and covariant indices raises an error
L = Tensor([[2, 1]', [-3, 1]'])
symmetrize(L[:i][:j], :i, :j)`}
                    result={`ERROR: Indices not all the same variance`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="antisymmetrize"
                name="antisymmetrize"
                code={`antisymmetrize(A::IndexedTensor, indices...)`}
                description={<>Antisymmetrizes a tensor across the specified indices by summing over all permutations of those indices weighted by their sign, then dividing by the number of permutations. For a <Math>{'(2, 0)'}</Math>-tensor this yields <Math>{'\\frac{1}{2}(A^{ij} - A^{ji})'}</Math>. The result is guaranteed to be fully antisymmetric in the specified indices — swapping any two of them negates the tensor. All specified indices must belong to <code>A</code> and share the same variance. Returns a <code>Tensor</code>.</>}
                args={[
                    ['A', 'IndexedTensor', <>The tensor to antisymmetrize.</>],
                    ['indices...', 'Symbol', <>Two or more index labels to antisymmetrize over. All must be present in <code>A</code> and share the same variance.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`A = Tensor([[2, 1], [-3, 1]])
antisymmetrize(A[:i, :j], :i, :j)`}
                    result={`(2, 0)-Tensor:
[0.0 2.0; -2.0 0.0]
    (:contra, :contra)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Antisymmetrizing an already antisymmetric tensor leaves it unchanged
ω = Tensor([[0, 1]', [-1, 0]']')
antisymmetrize(ω[:i, :j], :i, :j)`}
                    result={`(0, 2)-Tensor:
[0.0 1.0; -1.0 0.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Antisymmetrizing a symmetric tensor yields zero
g = Tensor([[1, 0]', [0, 1]']')
antisymmetrize(g[:i, :j], :i, :j)`}
                    result={`(0, 2)-Tensor:
[0.0 0.0; 0.0 0.0]
    (:co, :co)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="dual-basis"
                name="dual_basis"
                code={`dual_basis(basis::Basis)`}
                description={<>Computes the dual basis of a vector or covector basis. The dual of a vector basis is a covector basis, and vice versa, with the duality condition <Math>{'\\varepsilon^i(e_j) = \\delta^i_j'}</Math> — the <Math>{'i'}</Math>th dual element contracts with the <Math>{'j'}</Math>th basis element to yield <Math>{'1'}</Math> if <Math>{'i = j'}</Math> and <Math>{'0'}</Math> otherwise. Computed by inverting the matrix of basis element components. Only rank-1 bases (vector or covector) are accepted. Returns a <code>Basis</code> of opposite variance.</>}
                args={[
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> or covector <Math>{'(:co,)'}</Math> basis. Higher-rank bases are not supported.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`e = Basis([Tensor([1, 0]), Tensor([0, 1])])
ϵ = dual_basis(e)   # Dual of a vector basis is a covector basis`}
                    result={`Basis(Tensor{Float64, 1}[...], (:co,))`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Verifying the duality condition
δ = KroneckerDelta()
for i in 1:2, j in 1:2
    println(ϵ[i][:k] * e[j][:k] == δ[i, j])
end`}
                    result={`true
true
true
true`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Works for non-orthogonal bases too
e = Basis([
    Tensor([1, 2]),
    Tensor([0, 1])
])
ϵ = dual_basis(e)
for i in 1:2, j in 1:2
    println(ϵ[i][:k] * e[j][:k] == δ[i, j])
end`}
                    result={`true
true
true
true`}
                />
            </FunctionDocs>

            <PageNav prev="Indexed Arithmetic" next="Derivatives" />
        </>
    );
}