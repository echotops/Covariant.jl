import TypeDocs from '../../components/Docs/TypeDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function GeometricObjects() {
    return (
        <>
            <p className="learn-title">Geometric Objects</p>

            <TypeDocs
                id="tensor"
                name="Tensor"
                code={`struct Tensor{T, R}`}
                description={<>A geometric object that transforms predictably under coordinate changes. A tensor's type <Math>{'(m, n)'}</Math> describes how its components transform — following <Math>{'m'}</Math> contravariant and <Math>{'n'}</Math> covariant transformations — with rank <Math>{'R = m + n'}</Math> total indices. The <code>Tensor(data)</code> constructor infers variance from nested Julia vectors and adjoints, where a plain vector <code>[]</code> marks a contravariant index and an adjoint <code>[]'</code> marks a covariant index.</>}
                fields={[
                    ['data', 'Array{T, R}', <>The component array of the tensor, with one dimension per index.</>],
                    ['variance', 'NTuple{R, Symbol}', <>A tuple of length <Math>{'R'}</Math> where each entry is either <code>:contra</code> or <code>:co</code>, recording the variance of each index.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`v = Tensor([1, 2])         # (1, 0)-tensor — vector
ω = Tensor([-3, 1]')       # (0, 1)-tensor — covector`}
                    result={`(1, 0)-Tensor:
[1, 2]
    (:contra,)
(0, 1)-Tensor:
[-3, 1]
    (:co,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`L = Tensor([[4, -2]', [1, 1]'])   # (1, 1)-tensor — linear map
g = Tensor([[2, 1]', [1, 2]']')  # (0, 2)-tensor — bilinear form`}
                    result={`(1, 1)-Tensor:
[4 -2; 1 1]
    (:contra, :co)
(0, 2)-Tensor:
[2 1; 1 2]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The pattern extends naturally to higher rank
T = Tensor([[[1, 0]', [0, 1]'], [[-1, 2]', [3, 0]']])`}
                    result={`(2, 1)-Tensor:
[1 0; 0 1;;; -1 2; 3 0]
    (:contra, :contra, :co)`}
                />
            </TypeDocs>

            <TypeDocs
                id="basis"
                name="Basis"
                code={`struct Basis`}
                description={<>An ordered collection of <code>Tensor</code>s sharing the same variance, forming a frame for a vector space. A basis is required for computing the metric tensor and connection coefficients, and can be contracted with an <code>IndexedTensor</code> to express components as a linear combination of basis elements. All elements must share identical variance, which the constructor enforces.</>}
                fields={[
                    ['elements', 'Array', <>The ordered array of basis tensors.</>],
                    ['variance', 'Tuple', <>The shared variance of every element, e.g. <code>(:contra,)</code> for a vector basis or <code>(:co,)</code> for a covector basis.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`e = Basis([
    Tensor([1, 0]),
    Tensor([0, 1])
])
e[2]   # Integer indexing returns the element`}
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
                    code={`# Two bases can be combined with the tensor product
ε = Basis([Tensor([1, 0]'), Tensor([0, 1]')])
e ⊗ ε`}
                    result={`Basis(Tensor{Int64, 2}[...], (:contra, :co))`}
                />
            </TypeDocs>

            <PageNav next="Special Objects" />
        </>
    );
}