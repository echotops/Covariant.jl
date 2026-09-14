import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function Indexing() {
    return (
        <>
            <p className="learn-title">Indexing</p>
            <p className="learn-body">
                All indexing in Covariant is performed through Julia's <code>Base.getindex</code>,
                called via the standard bracket syntax <code>A[...]</code>. Integer indices evaluate
                immediately and return a scalar, while symbolic indices label the index for use in
                Einstein summation and return an indexed variant of the object. Most types follow
                this same convention.
            </p>

            <FunctionDocs
                id="tensor-getindex"
                name="getindex(A, indices...)"
                code={`Base.getindex(A::Tensor, indices...)`}
                description={<>Indexes a <Ref to={refLinks.Tensor}>Tensor</Ref> along its contravariant indices, or along all indices for a purely covariant tensor. Integer indices slice the component array immediately. Symbolic indices label the index for Einstein summation and return either an <code>IndexedTensor</code> or a <code>PartialIndexedTensor</code>, depending on whether the tensor has remaining covariant indices to be labeled in a second bracket.</>}
                args={[
                    ['A', 'Tensor', <>The tensor to index.</>],
                    ['indices...', 'Int | Symbol', <>One index per contravariant index of <code>A</code>, or one per covariant index for a purely covariant tensor. Mixing integers and symbols is allowed.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`v = Tensor([1, 2])
v[1]       # Integer index — returns a scalar
v[:i]      # Symbolic index — returns an IndexedTensor`}
                    result={`1
(1, 0)-Tensor:
[1, 2]
    (:contra,)
    (:i,), ()`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Mixed-variance tensors use two brackets
L = Tensor([[4, -2]', [1, 1]'])
L[1][:j]   # Slice first contravariant index, label covariant
L[:i][:j]  # Label both — returns an IndexedTensor`}
                    result={`(0, 1)-Tensor:
[4, -2]
    (:co,)
    (), (:j,)
(1, 1)-Tensor:
[4 -2; 1 1]
    (:contra, :co)
    (:i,), (:j,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Repeating the same symbol in both brackets triggers a self-contraction
A = Tensor([[3, 1]', [-2, 4]'])
A[:i][:i]   # trace`}
                    result={`7`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="partial-indexed-tensor-getindex"
                name="getindex(A, indices...)"
                code={`Base.getindex(A::PartialIndexedTensor, indices...)`}
                description={<>Completes the covariant half of two-bracket indexing on a mixed-variance tensor, returning a fully labeled <code>IndexedTensor</code>. If any symbol appears in both the contravariant and covariant index sets, a self-contraction is performed over that index before returning.</>}
                args={[
                    ['A', 'PartialIndexedTensor', <>The partially indexed tensor, produced by the first bracket on a mixed-variance <code>Tensor</code>.</>],
                    ['indices...', 'Int | Symbol', <>One index per covariant index of the underlying tensor. Mixing integers and symbols is allowed.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`L = Tensor([[4, -2]', [1, 1]'])
L[:i][:j]   # Second bracket labels the covariant index`}
                    result={`(1, 1)-Tensor:
[4 -2; 1 1]
    (:contra, :co)
    (:i,), (:j,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Matching symbols across brackets trigger an implicit self-contraction
L[:i][:i]   # trace`}
                    result={`5`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Integer in the second bracket slices the covariant index
L[:i][1]`}
                    result={`(1, 0)-Tensor:
[4, 1]
    (:contra,)
    (:i,), ()`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="kronecker-delta-getindex"
                name="getindex(δ, indices...)"
                code={`Base.getindex(δ::KroneckerDelta, indices...)`}
                description={<>Indexes a <Ref to={refLinks.KroneckerDelta}>KroneckerDelta</Ref> with two indices. Integer indices evaluate immediately, returning <Math>{'1'}</Math> if the indices are equal and <Math>{'0'}</Math> otherwise. Symbolic indices return an <code>IndexedKroneckerDelta</code> for use in Einstein summation.</>}
                args={[
                    ['δ', 'KroneckerDelta', <>The Kronecker delta to index.</>],
                    ['indices...', 'Int | Symbol', <>Exactly two indices.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`δ = KroneckerDelta()
δ[1, 1]    # Equal integer indices → 1
δ[1, 2]    # Unequal integer indices → 0`}
                    result={`1
0`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Symbolic indexing returns an IndexedKroneckerDelta
L = Tensor([[4, -2]', [1, 1]'])
L[:i][:j] * δ[:i, :k]   # Relabels contravariant index i → k`}
                    result={`(1, 1)-Tensor:
[4 -2; 1 1]
    (:contra, :co)
    (:k,), (:j,)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="levi-civita-getindex"
                name="getindex(ε, indices...)"
                code={`Base.getindex(ε::LeviCivita, indices...)`}
                description={<>Indexes a <Ref to={refLinks.LeviCivita}>LeviCivita</Ref> with any number of indices. Integer indices evaluate immediately, returning <Math>{'1'}</Math> for an even permutation, <Math>{'-1'}</Math> for an odd permutation, and <Math>{'0'}</Math> if any two indices are equal. Symbolic indices return an <code>IndexedLeviCivita</code> for use in Einstein summation.</>}
                args={[
                    ['ε', 'LeviCivita', <>The Levi-Civita symbol to index.</>],
                    ['indices...', 'Int | Symbol', <>Any number of indices, matching the dimension of the space.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`ε = LeviCivita()
ε[1, 2]    # Even permutation → 1
ε[2, 1]    # Odd permutation → -1
ε[1, 1]    # Repeated index → 0`}
                    result={`1
-1
0`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Symbolic indexing for use in summation
v = Tensor([2, 1])
u = Tensor([-3, 2])
v[:i] * u[:j] * ε[:i, :j]   # Signed area`}
                    result={`7`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="partial-derivative-getindex"
                name="getindex(∂, indices...)"
                code={`Base.getindex(∂::PartialDerivative, indices...)`}
                description={<>Indexes a <Ref to={refLinks.PartialDerivative}>PartialDerivative</Ref> with a single symbolic index, returning an <code>IndexedPartialDerivative</code> for use in Einstein summation. Only symbolic indices are accepted — integer indexing returns <code>nothing</code>.</>}
                args={[
                    ['∂', 'PartialDerivative', <>The partial derivative operator to index.</>],
                    ['indices...', 'Symbol', <>A single symbolic index.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables u v
∂ = PartialDerivative((u, v))
X = Tensor([u * v, v^2 - 1])
∂[:i] * X[:j]   # Jacobian of X`}
                    result={`(1, 1)-Tensor:
Num[v u; 0 2v]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Contracting with a matching index gives the divergence
∂[:i] * X[:i]`}
                    result={`3v`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="covariant-derivative-getindex"
                name="getindex(∇, indices...)"
                code={`Base.getindex(∇::CovariantDerivative, indices...)`}
                description={<>Indexes a <Ref to={refLinks.CovariantDerivative}>CovariantDerivative</Ref> with a single symbolic index, returning an <code>IndexedCovariantDerivative</code> for use in Einstein summation. Only symbolic indices are accepted — integer indexing returns <code>nothing</code>.</>}
                args={[
                    ['∇', 'CovariantDerivative', <>The covariant derivative operator to index.</>],
                    ['indices...', 'Symbol', <>A single symbolic index.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
∇ = levicivita((θ, φ), e)
X = Tensor([sin(θ), 0])
∇[:i] * X[:j]   # Covariant Jacobian of X`}
                    result={`(1, 1)-Tensor:
Num[cos(θ) 0; 0 cos(θ)]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Contracting with a matching index gives the covariant divergence
∇[:i] * X[:i]`}
                    result={`2cos(θ)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="exterior-derivative-getindex"
                name="getindex(d, indices...)"
                code={`Base.getindex(d::ExteriorDerivative, indices...)`}
                description={<>Indexes an <Ref to={refLinks.ExteriorDerivative}>ExteriorDerivative</Ref> with a single symbolic index, returning an <code>IndexedExteriorDerivative</code> for use in Einstein summation. Only symbolic indices are accepted — integer indexing returns <code>nothing</code>.</>}
                args={[
                    ['d', 'ExteriorDerivative', <>The exterior derivative operator to index.</>],
                    ['indices...', 'Symbol', <>A single symbolic index.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables u v
∂ = PartialDerivative((u, v))
d = ExteriorDerivative(∂)
α = Tensor([u^2 * v, v + 2]')
d[:i] * α[:j]   # Exterior derivative of a 1-form`}
                    result={`(0, 2)-Tensor:
Num[0.0 u^2; -(u^2) 0.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Nilpotency: d² = 0 — β's indices must be freshly labeled,
# distinct from d's next index, since β carries no memory of :i, :j
β = d[:i] * α[:j]
d[:m] * β[:k, :l]`}
                    result={`(0, 3)-Tensor:
Num[0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0]
    (:co, :co, :co)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="basis-getindex"
                name="getindex(e, indices...)"
                code={`Base.getindex(e::Basis, indices...)`}
                description={<>Indexes a <Ref to={refLinks.Basis}>Basis</Ref> with either integer or symbolic indices. Integer indices return the corresponding basis element directly. Symbolic indices return an <code>IndexedBasis</code> for use in Einstein summation, enabling contraction with an <code>IndexedTensor</code> to form linear combinations of basis elements.</>}
                args={[
                    ['e', 'Basis', <>The basis to index.</>],
                    ['indices...', 'Int | Symbol', <>One or more integer or symbolic indices.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`e = Basis([Tensor([1, 0]), Tensor([0, 1])])
e[2]    # Integer index — returns the second basis element`}
                    result={`(1, 0)-Tensor:
[0, 1]
    (:contra,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Symbolic indexing and contraction yields a linear combination
v = Tensor([3, -2])
v[:i] * e[:i]`}
                    result={`(1, 0)-Tensor:
[3, -2]
    (:contra,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Works with non-orthogonal bases too
e = Basis([Tensor([1, 1]), Tensor([0, 1])])
v = Tensor([2, -1])
v[:i] * e[:i]`}
                    result={`(1, 0)-Tensor:
[2, 1]
    (:contra,)`}
                />
            </FunctionDocs>

            <PageNav prev="Constructors" next="Tensor Operations" />
        </>
    );
}