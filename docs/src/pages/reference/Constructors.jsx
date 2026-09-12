import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';

export default function Constructors() {
    return (
        <>
            <p className="learn-title">Constructors</p>

            <FunctionDocs
                id="tensor"
                name="Tensor"
                code={`Tensor(data)`}
                description={<>Constructs a <code>Tensor</code> from nested Julia vectors and adjoints, inferring the variance of each index from the nesting structure. A plain vector <code>[]</code> introduces a contravariant index and an adjoint <code>[]'</code> introduces a covariant index, with the outermost nesting corresponding to the first index.</>}
                args={[
                    ['data', 'Array', <>Nested Julia vectors and adjoints encoding both the component data and the variance of each index.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`Tensor([1, 3])         # (1, 0)-tensor — vector
Tensor([2, -5]')       # (0, 1)-tensor — covector`}
                    result={`(1, 0)-Tensor:
[1, 3]
    (:contra,)
(0, 1)-Tensor:
[2, -5]
    (:co,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`Tensor([[0, -1]', [1, 0]'])    # (1, 1)-tensor — the 90° rotation map
Tensor([[1, 0]', [0, 1]']')   # (0, 2)-tensor — the identity metric`}
                    result={`(1, 1)-Tensor:
[0 -1; 1 0]
    (:contra, :co)
(0, 2)-Tensor:
[1 0; 0 1]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The pattern extends to arbitrary rank
Tensor([[[1, 0]', [0, 1]'], [[-1, 2]', [3, 0]']])`}
                    result={`(2, 1)-Tensor:
[1 0; 0 1;;; -1 2; 3 0]
    (:contra, :contra, :co)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="basis"
                name="Basis"
                code={`Basis(elements)`}
                description={<>Constructs a <code>Basis</code> from an array of <code>Tensor</code>s. All elements must share the same variance — the constructor reads the variance of the first element and raises an error if any subsequent element differs.</>}
                args={[
                    ['elements', 'Array{Tensor}', <>An ordered array of <code>Tensor</code>s, all sharing the same variance, that form the basis.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Standard Cartesian basis
e = Basis([
    Tensor([1, 0]),
    Tensor([0, 1])
])`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Basis for a 2-sphere in spherical coordinates
@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Mismatched variance raises an error
Basis([Tensor([1, 0]), Tensor([0, 1]')])`}
                    result={`ERROR: Basis elements must have the same variance`}
                />
            </FunctionDocs>

            <PageNav prev="Differential Operators" next="Indexing" />
        </>
    );
}