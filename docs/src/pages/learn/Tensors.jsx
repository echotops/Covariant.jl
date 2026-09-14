import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function Tensors() {
    return (
        <>
            <p className="learn-title">Tensors</p>
            <p className="learn-heading" id="initialization">Initialization</p>
            <p className="learn-body">
                To an engineer, a tensor is a multidimensional array of numbers, but to a physicist
                or mathematician, a tensor is a geometric object that transforms in specific ways
                under coordinate changes. A tensor's type, denoted (m, n), describes how its
                components transform with coordinate changes, following m contravariant and n
                covariant transformations.
            </p>
            <p className="learn-body">
                A (0, 0)-tensor, whose coordinates are invariant under all coordinate changes, is
                also known as a scalar. A (1, 0)-tensor follows 1 contravariant transformation, and
                is known as a vector. A (0, 1)-tensor follows 1 covariant transformation, and is known
                as a covector.
            </p>
            <p className="learn-body">
                Covariant uses Julia's vector <code>[]</code> and adjoint <code>[]'</code> types to
                define contravariant and covariant indices. A vector indicates a contravariant index,
                while an adjoint indicates a covariant index. Initialization of a vector and covector
                works as:
            </p>
            <CodeBlock lang="julia"
code={`v = Tensor([1, 2]) # A vector
ω = Tensor([-3, 1]') # A covector`}
            />
            <p className="learn-body">
                Tensors of higher order can be initialized by extending the pattern:
            </p>
            <CodeBlock lang="julia"
code={`L = Tensor([[4, -2]', [1, 1]']) # A linear map
g = Tensor([[2, 1]', [1, 2]']') # A bilinear form`}
            />
            <p className="learn-heading" id="tensor-type">Tensor Type</p>
            <p className="learn-body">
                The <Ref to={refLinks.Tensor}>Tensor</Ref> type contains a data and a variance field.
                <code>Tensor.data</code> is an <code>Array</code> that holds the tensor components,
                while <code>Tensor.variance</code> is an <code>NTuple</code> containing the variance
                of each index as either <code>:contra</code> or <code>:co</code>. Printing a tensor
                displays both of these fields, and the overall variance.
            </p>
            <CodeBlock lang="julia"
code={`L = Tensor([[4, -2]', [1, 1]'])`} 
result={`(1, 1)-Tensor:
[4 -2; 1 1]
    (:contra, :co)`}
            />
            <p className="learn-heading" id="indexing-conventions">Indexing Conventions</p>
            <p className="learn-body">
                For most operations, and to recover the data within a tensor, the tensor needs to
                be indexed. Mathematical convention is that contravariant indices are written as
                superscripts, and covariant indices as subscripts, so that a vector is indexed
                as <Math>{`v^i`}</Math>, a covector as <Math>{`\\omega_i`}</Math>, and a general
                tensor as <Math>{`T^{ijk...}_{xyz...}`}</Math>
            </p>
            <p className="learn-body">
                Indexing a <Ref to={refLinks.Tensor}>Tensor</Ref> uses <code>Base.getindex()</code>, where
                contravariant indices are written first and covariant indices are second. If
                the tensor contains only contravariant or covariant indices, then only those
                indices are included, so any (k, 0)- or (0, k)-tensor is indexed as <code>T[i1, i2...ik]</code>,
                while a general (k, l)-tensor is indexed as <code>T[i1, i2...ik][j1, j2...jl]</code>
            </p>
            <p className="learn-body">
                Indexing entirely with integers will return a scalar
            </p>
            <CodeBlock lang="julia"
code={`v = Tensor([1, 2])
v[1]`} 
result={`1`}
            />
            <CodeBlock lang="julia"
code={`L = Tensor([[4, -2]', [1, 1]'])
L[1][2]`} 
result={`-2`}
            />
            <p className="learn-body">
                Indexing either entirely with symbols or with a mix of integers and symbols will
                return an <code>IndexedTensor</code>, a thin wrapper pairing a <Ref to={refLinks.Tensor}>Tensor</Ref>
                with the symbols labeling its indices. Those labels are what let operations line
                indices up against each other, contracting the ones that repeat, which is covered
                on the next page. Operating on an <code>IndexedTensor</code> returns another
                <code>IndexedTensor</code> if any labeled indices remain, or a plain number if
                every index contracts away
            </p>
            <CodeBlock lang="julia"
code={`v[:i]`} 
result={`(1, 0)-Tensor:
[1, 2]
    (:contra,)
    (:i,), ()`}
            />
            <CodeBlock lang="julia"
code={`L[:i][:j]`} 
result={`(1, 1)-Tensor:
[4 -2; 1 1]
    (:contra, :co)
    (:i,), (:j,)`}
            />
            <p className="learn-body">
                In the mixed case, the data will be sliced along the given indices
            </p>   
            <CodeBlock lang="julia"
code={`L[2][:k]`} 
result={`(0, 1)-Tensor:
[1, 1]
    (:co,)
    (), (:k,)`}
            />
            <p className="learn-body">
                This indexing method is applied mostly unchanged to various other objects, including
                <Ref to={refLinks.KroneckerDelta}>KroneckerDelta</Ref>, <Ref to={refLinks.LeviCivita}>LeviCivita</Ref>, <Ref to={refLinks.PartialDerivative}>PartialDerivative</Ref>,
                <Ref to={refLinks.CovariantDerivative}>CovariantDerivative</Ref>, and <Ref to={refLinks.ExteriorDerivative}>ExteriorDerivative</Ref> types, each returning
                a respective indexed variant.
            </p>   
            <PageNav prev="Getting Started" next="Tensor Algebra" />
        </>
    );
}