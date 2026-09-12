import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function IndexedArithmetic() {
    return (
        <>
            <p className="learn-title">Indexed Arithmetic</p>
            <p className="learn-body">
                Most arithmetic in Covariant operates on <code>IndexedTensor</code>s rather than
                raw <code>Tensor</code>s. This ensures that index labels are tracked through every
                operation, allowing the correct components to be aligned and contracted automatically.
            </p>

            <FunctionDocs
                id="addition"
                name="Base.:+"
                code={`Base.:+(A::IndexedTensor, B::IndexedTensor)`}
                description={<>Adds two <code>IndexedTensor</code>s element-wise. Both operands must have identical sets of contravariant and covariant index labels, though the labels need not appear in the same order — components are permuted as needed before summing. Returns an <code>IndexedTensor</code> with the same index labels as <code>A</code>.</>}
                args={[
                    ['A', 'IndexedTensor', <>The left operand.</>],
                    ['B', 'IndexedTensor', <>The right operand. Must carry the same contravariant and covariant index labels as <code>A</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`v = Tensor([1, 2])
w = Tensor([-3, 1])
v[:i] + w[:i]`}
                    result={`(1, 0)-Tensor:
[-2, 3]
    (:contra,)
    (:i,), ()`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`A = Tensor([[2, 1], [-3, 1]])
B = Tensor([[0, -1], [4, 2]])
A[:i, :j] + B[:i, :j]`}
                    result={`(2, 0)-Tensor:
[2 0; 1 3]
    (:contra, :contra)
    (:i, :j), ()`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Mismatched index labels raise an error
A[:i, :j] + B[:i, :k]`}
                    result={`ERROR: Covariant indices must match`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="subtraction"
                name="Base.:-"
                code={`Base.:-(A::IndexedTensor, B::IndexedTensor)`}
                description={<>Subtracts one <code>IndexedTensor</code> from another element-wise. Implemented as <Math>{'A + (-1) \\cdot B'}</Math>, and carries the same index-matching requirement as addition. Returns an <code>IndexedTensor</code> with the same index labels as <code>A</code>.</>}
                args={[
                    ['A', 'IndexedTensor', <>The left operand.</>],
                    ['B', 'IndexedTensor', <>The right operand. Must carry the same contravariant and covariant index labels as <code>A</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`v = Tensor([1, 2])
w = Tensor([-3, 1])
v[:i] - w[:i]`}
                    result={`(1, 0)-Tensor:
[4, 1]
    (:contra,)
    (:i,), ()`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`L = Tensor([[4, -2], [3, 3]])
M = Tensor([[0, 0], [-3, 3]])
L[:i, :j] - M[:i, :j]`}
                    result={`(2, 0)-Tensor:
[4 -2; 6 0]
    (:contra, :contra)
    (:i, :j), ()`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="multiplication-scalar"
                name="Base.:* (scalar)"
                code={`Base.:*(s::Number, A::IndexedTensor)
Base.:*(A::IndexedTensor, s::Number)`}
                description={<>Scales every component of an <code>IndexedTensor</code> by a scalar. Commutative — both operand orders are supported. Returns an <code>IndexedTensor</code> with the same index labels and variance as <code>A</code>.</>}
                args={[
                    ['s', 'Number', <>The scalar to multiply by.</>],
                    ['A', 'IndexedTensor', <>The indexed tensor to scale.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`g = Tensor([[2, -1]', [0, 2]']')
2 * g[:i, :j]`}
                    result={`(0, 2)-Tensor:
[4 -2; 0 4]
    (:co, :co)
    (), (:i, :j)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`v = Tensor([3, -1])
v[:i] * -1`}
                    result={`(1, 0)-Tensor:
[-3, 1]
    (:contra,)
    (:i,), ()`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="division-scalar"
                name="Base.:/ (scalar)"
                code={`Base.:/(A::IndexedTensor, s::Number)`}
                description={<>Divides every component of an <code>IndexedTensor</code> by a scalar. Implemented as <Math>{'\\frac{1}{s} \\cdot A'}</Math>. Returns an <code>IndexedTensor</code> with the same index labels and variance as <code>A</code>.</>}
                args={[
                    ['A', 'IndexedTensor', <>The indexed tensor to divide.</>],
                    ['s', 'Number', <>The scalar to divide by.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`A = Tensor([[1, 2]', [3, -1]'])
A[:i][:j] / 2`}
                    result={`(1, 1)-Tensor:
[0.5 1.0; 1.5 -0.5]
    (:contra, :co)
    (:i,), (:j,)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="multiplication-kronecker-delta"
                name="Base.:* (KroneckerDelta)"
                code={`Base.:*(A::IndexedTensor, δ::IndexedKroneckerDelta)
Base.:*(δ::IndexedKroneckerDelta, A::IndexedTensor)`}
                description={<>Contracts an <code>IndexedTensor</code> with an <code>IndexedKroneckerDelta</code>. The delta must share at least one index label with <code>A</code> — that index is summed over, effectively relabeling it to the delta's other index. When both of the delta's indices match labels in <code>A</code>, the result is a self-contraction. Commutative — both operand orders are supported.</>}
                args={[
                    ['A', 'IndexedTensor', <>The indexed tensor to contract.</>],
                    ['δ', 'IndexedKroneckerDelta', <>The indexed Kronecker delta, produced by <code>KroneckerDelta()[:i, :j]</code>. Must share at least one index label with <code>A</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`δ = KroneckerDelta()
L = Tensor([[1, 2]', [3, -1]'])
L[:i][:j] * δ[:j, :k]   # Relabels covariant index j → k`}
                    result={`(1, 1)-Tensor:
[1 2; 3 -1]
    (:contra, :co)
    (:i,), (:k,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# When both indices match, the result is a trace
L[:i][:j] * δ[:j, :i]`}
                    result={`0`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="multiplication-levi-civita"
                name="Base.:* (LeviCivita)"
                code={`Base.:*(A::IndexedTensor, ε::IndexedLeviCivita)
Base.:*(ε::IndexedLeviCivita, A::IndexedTensor)`}
                description={<>Contracts an <code>IndexedTensor</code> with an <code>IndexedLeviCivita</code>. The Levi-Civita symbol must share at least one index label with <code>A</code> — those indices are summed over, with the remaining free indices of the symbol becoming the output indices. All contracted dimensions must be equal. Commutative — both operand orders are supported.</>}
                args={[
                    ['A', 'IndexedTensor', <>The indexed tensor to contract.</>],
                    ['ε', 'IndexedLeviCivita', <>The indexed Levi-Civita symbol, produced by <code>LeviCivita()[:i, :j, ...]</code>. Must share at least one index label with <code>A</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`ε = LeviCivita()

# Signed area of the parallelogram spanned by v and u
v = Tensor([1, 2])
u = Tensor([-2, 1])
v[:i] * u[:j] * ε[:i, :j]`}
                    result={`5`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Cross product in 3D — free index k becomes the output
a = Tensor([1, 0, 0])
b = Tensor([0, 1, 0])
a[:i] * b[:j] * ε[:i, :j, :k]`}
                    result={`(1, 0)-Tensor:
[0, 0, 1]
    (:contra,)
    (:k,), ()`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="multiplication-linearalgebra"
                name="Base.:* (contraction)"
                code={`Base.:*(A::IndexedTensor, B::IndexedTensor)`}
                description={<>The central operation of Covariant — contracts two <code>IndexedTensor</code>s along any pair of indices where one is contravariant in <code>A</code> and covariant in <code>B</code>, or vice versa. Matching index labels are summed over (Einstein summation); non-matching labels become free indices of the result. If no indices match, the tensor product <Math>{'A \\otimes B'}</Math> is returned. If all indices are contracted, a scalar is returned. Repeated contravariant–contravariant or covariant–covariant labels across both operands raise an error.</>}
                args={[
                    ['A', 'IndexedTensor', <>The left operand.</>],
                    ['B', 'IndexedTensor', <>The right operand. Any index label that appears as contravariant in one operand and covariant in the other is contracted over.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Covector acting on a vector — full contraction returns a scalar
v = Tensor([2, -1])
ω = Tensor([-2, 3]')
v[:i] * ω[:i]`}
                    result={`-7`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Linear map acting on a vector — one free index remains
L = Tensor([[2, 1]', [-1, 3]'])
v = Tensor([1, 2])
L[:i][:j] * v[:j]`}
                    result={`(1, 0)-Tensor:
[4, 5]
    (:contra,)
    (:i,), ()`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# No matching indices — returns the tensor product
v = Tensor([1, 2])
w = Tensor([3, 4])
v[:i] * w[:j]`}
                    result={`(2, 0)-Tensor:
[3 4; 6 8]
    (:contra, :contra)
    (:i, :j), ()`}
                />
            </FunctionDocs>

            <PageNav prev="Tensor Operations" next="Symmetry & Duality" />
        </>
    );
}