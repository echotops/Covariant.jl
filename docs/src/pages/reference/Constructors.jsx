import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function Constructors() {
    return (
        <>
            <p className="learn-title">Constructors</p>

            <FunctionDocs
                id="tensor"
                name="Tensor"
                code={`Tensor(data)
Tensor(data, variance...)`}
                description={<>Constructs a <Ref to={refLinks.Tensor}>Tensor</Ref> from a Julia array and the variance of each of its indices, given in order as <code>:contra</code> or <code>:co</code>. Three shortcuts leave the variance out: a vector <code>[]</code> is a contravariant (1, 0)-tensor, an adjoint <code>[]'</code> is a covariant (0, 1)-tensor, and a matrix is a (1, 1)-tensor, a linear map. Any other array must state its variance.</>}
                args={[
                    ['data', 'AbstractArray', <>The component data, indexed by the tensor's indices in order.</>],
                    ['variance', 'Symbol...', <>One <code>:contra</code> or <code>:co</code> for each index. May be left out for a vector, an adjoint, or a matrix.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`Tensor([1, 3])         # (1, 0)-tensor — vector
Tensor([2, -5]')       # (0, 1)-tensor — covector`}
                    result={`(1, 0)-Tensor
[1, 3]
(0, 1)-Tensor
[2, -5]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`Tensor([0 -1; 1 0])    # (1, 1)-tensor — the 90° rotation map
Tensor([1 0; 0 1], :co, :co)   # (0, 2)-tensor — the identity metric`}
                    result={`(1, 1)-Tensor
[0 -1; 1 0]
(0, 2)-Tensor
[1 0; 0 1]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The pattern extends to arbitrary rank
Tensor([1 0; -1 3;;; 0 1; 2 0], :contra, :contra, :co)`}
                    result={`(2, 1)-Tensor
[1 0; -1 3;;; 0 1; 2 0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Arrays beyond a matrix state their variance
Tensor(reshape(1:8, 2, 2, 2))`}
                    result={`ERROR: Specify the variance of a rank 3 tensor, for example Tensor(data, :contra, :contra, :contra)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="basis"
                name="Basis"
                code={`Basis(elements)`}
                description={<>Constructs a <Ref to={refLinks.Basis}>Basis</Ref> from an array of <Ref to={refLinks.Tensor}>Tensor</Ref>s. All elements must share the same variance — the constructor reads the variance of the first element and raises an error if any subsequent element differs.</>}
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
                    result={`ERROR: Basis elements must have the same variance, but found [(:contra,), (:co,)]`}
                />
            </FunctionDocs>

            <PageNav prev="Differential Operators" next="Indexing" />
        </>
    );
}