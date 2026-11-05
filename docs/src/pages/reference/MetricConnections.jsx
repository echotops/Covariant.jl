import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function MetricConnections() {
    return (
        <>
            <p className="learn-title">Metric & Connections</p>

            <FunctionDocs
                id="manifold"
                name="Manifold"
                code={`Manifold(coordinates, embedding; inner_product=⋅, ranges=nothing, simple=false)
Manifold(coordinates, basis; inner_product=⋅, ranges=nothing, embedding=nothing, simple=false)
Manifold(coordinates, g; ranges=nothing, embedding=nothing, basis=nothing, simple=false)
Manifold(coordinates; ranges=nothing, embedding=nothing)`}
                description={<>A manifold in a coordinate chart, defined by its coordinates and metric. The metric is either found from an embedding in <Math>{'\\mathbb{R}^3'}</Math>, given directly as a <Math>{'(0, 2)'}</Math>-tensor, taken from a vector basis, or, with none of these, flat. With an embedding function, it is called with the symbolic coordinates, so it must use functions Symbolics.jl can trace, like <code>cos</code> and <code>sin</code>. Its Jacobian gives the tangent basis vectors, and the metric is their inner product. The optional <code>ranges</code> and <code>embedding</code> are used for plotting. With an embedding a 2-dimensional manifold is a surface in <Math>{'\\mathbb{R}^3'}</Math> drawn in an <code>Axis3</code>, and without one it is a flat chart drawn in an <code>Axis</code>.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>The symbolic coordinate variables.</>],
                    ['embedding', 'Function', <>A function <code>(u, v) -&gt; [x, y, z]</code> returning an array, which the metric and basis are found from. Pass <code>basis</code> or <code>g</code> instead to give the geometry another way.</>],
                    ['basis', 'Basis', <>A vector basis that the metric is taken from. Pass <code>g</code>, a <Math>{'(0, 2)'}</Math>-tensor, instead to give the metric directly.</>],
                ]}
                kwargs={[
                    ['ranges', 'Tuple', 'nothing', <>The range of values to plot each coordinate over.</>],
                    ['embedding', 'Function', 'nothing', <>A function <code>(u, v) -&gt; [x, y, z]</code> mapping coordinate values to a point in <Math>{'\\mathbb{R}^3'}</Math>.</>],
                    ['basis', 'Basis', 'nothing', <>The vector basis in <Math>{'\\mathbb{R}^3'}</Math> that plotted vector components are given in. When there is an embedding but no basis, components are taken in the coordinate basis of the embedding, found with <Ref to={refLinks.embedding_basis}>embedding_basis</Ref>.</>],
                    ['inner_product', 'Function', '⋅', <>The inner product used to take the metric from a basis.</>],
                    ['simple', 'Bool', 'false', <>Whether curvature results are simplified symbolically.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# The unit sphere from its embedding in 3D. The metric
# and the tangent basis are found from the embedding
@variables θ φ
embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
M = Manifold((θ, φ), embedding;
    ranges=(range(0, π, 50), range(0, 2π, 50)), simple=true)
ricci_scalar(M)`}
                    result={`2`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Or from a basis, which also gives the metric
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
M = Manifold((θ, φ), e)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A flat chart, plotted in the plane
@variables u v
F = Manifold((u, v); ranges=(range(-2, 2, 30), range(-2, 2, 30)))`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="metric"
                name="metric"
                code={`metric(e::Basis, inner_product=⋅; simple=false)`}
                description={<>Constructs the metric tensor from a vector basis by computing the inner product of every pair of basis elements, producing a symmetric <Math>{'(0, 2)'}</Math>-tensor with components <Math display>{'g_{ij} = \\langle e_i, e_j \\rangle'}</Math> The basis must be a vector <Math>{'(:contra,)'}</Math> basis. By default uses the Euclidean inner product <Math>{'\\cdot'}</Math>, but any function of the same signature can be passed — most notably <Ref to={refLinks.minkowski}>minkowski</Ref> for special-relativistic geometry.</>}
                args={[
                    ['e', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis whose elements define the geometry of the space.</>],
                    ['inner_product', 'Function', <>A function <code>(A::Tensor, B::Tensor) -&gt; Number</code> defining the inner product. Defaults to the Euclidean dot product <code>⋅</code>.</>],
                ]}
                kwargs={[
                    ['simple', 'Bool', 'false', <>When <code>true</code>, applies <code>simplify</code> to the result. Useful when the basis elements are symbolic expressions.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Euclidean metric from the standard Cartesian basis
e = Basis([Tensor([1, 0]), Tensor([0, 1])])
metric(e)`}
                    result={`(0, 2)-Tensor
[1 0; 0 1]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Non-trivial metric from an oblique basis
e = Basis([Tensor([1, 2]), Tensor([3, -1])])
metric(e)`}
                    result={`(0, 2)-Tensor
[5 1; 1 10]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Minkowski metric for special relativity
η = metric(
    Basis([
        Tensor([1, 0, 0, 0]),
        Tensor([0, 1, 0, 0]),
        Tensor([0, 0, 1, 0]),
        Tensor([0, 0, 0, 1])
    ]),
    minkowski
)`}
                    result={`(0, 2)-Tensor
[-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="inv"
                name="LinearAlgebra.inv"
                code={`LinearAlgebra.inv(A::Tensor)`}
                description={<>Computes the inverse of a rank-2 tensor, flipping its variance. A <Math>{'(0, 2)'}</Math>-tensor (metric) returns a <Math>{'(2, 0)'}</Math>-tensor (inverse metric), and vice versa. Both indices must share the same variance — mixed-variance rank-2 tensors are not supported. The inverse metric <Math>{'g^{ij}'}</Math> is primarily used for raising indices and for computing Christoffel symbols.</>}
                args={[
                    ['A', 'Tensor', <>A rank-2 tensor with both indices sharing the same variance — either a <Math>{'(0, 2)'}</Math> or <Math>{'(2, 0)'}</Math>-tensor.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`e = Basis([Tensor([1, 0]), Tensor([0, 1])])
g = metric(e)
𝔤 = inv(g)   # (0, 2) → (2, 0)`}
                    result={`(2, 0)-Tensor
[1 0; 0 1]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Using the inverse metric to raise an index
ω = Tensor([1, -2]') ⊗ Tensor([-3, 2]')   # A (0, 2)-tensor
𝔤[:i, :j] * ω[:i, :k]`}
                    result={`(1, 1)-Tensor T^j_k
[-3 2; 6 -4]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="minkowski"
                name="minkowski"
                code={`minkowski(A::Tensor, B::Tensor, timelike_positive=false)`}
                description={<>The Minkowski inner product on two <Math>{'(1, 0)'}</Math>-tensors, for use as the <code>inner_product</code> argument of <Ref to={refLinks.metric}>metric</Ref>. The default sign convention is <Math>{'(-, +, +, +)'}</Math> — the timelike component is negative. Passing <code>timelike_positive=true</code> switches to <Math>{'(+, -, -, -)'}</Math>. Both operands must be <Math>{'(1, 0)'}</Math>-tensors.</>}
                args={[
                    ['A', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor.</>],
                    ['B', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor of the same dimension as <code>A</code>.</>],
                    ['timelike_positive', 'Bool', <>Sign convention. <code>false</code> (default) uses <Math>{'(-, +, +, +)'}</Math>; <code>true</code> uses <Math>{'(+, -, -, -)'}</Math>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Constructing the Minkowski metric with (-, +, +, +) convention
η = metric(
    Basis([
        Tensor([1, 0, 0, 0]),
        Tensor([0, 1, 0, 0]),
        Tensor([0, 0, 1, 0]),
        Tensor([0, 0, 0, 1])
    ]),
    minkowski
)`}
                    result={`(0, 2)-Tensor
[-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Switching to (+ , -, -, -) convention
η = metric(
    Basis([
        Tensor([1, 0, 0, 0]),
        Tensor([0, 1, 0, 0]),
        Tensor([0, 0, 1, 0]),
        Tensor([0, 0, 0, 1])
    ]),
    (A, B) -> minkowski(A, B, true)
)`}
                    result={`(0, 2)-Tensor
[1 0 0 0; 0 -1 0 0; 0 0 -1 0; 0 0 0 -1]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="christoffel"
                name="christoffel"
                code={`christoffel(M)`}
                description={<>Computes the Christoffel symbols <Math>{'\\Gamma^l_{jk}'}</Math> of the Levi-Civita connection of a manifold, returning a <Math>{'(1, 2)'}</Math>-tensor via <Math display>{'\\Gamma^l_{jk} = \\frac{1}{2} g^{lr} (\\partial_k g_{rj} + \\partial_j g_{rk} - \\partial_r g_{jk})'}</Math> where <Math>{'g'}</Math> is the metric of the manifold. The result is cached on the manifold. The result is passed to <Ref to={refLinks.CovariantDerivative}>CovariantDerivative</Ref> to construct a covariant derivative operator — or use <Ref to={refLinks.levicivita}>levicivita</Ref> to do both in one step.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to compute on, with symbolic coordinates and a metric. Construct it with <code>simple=true</code> to simplify the result.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
M = Manifold((θ, φ), e, simple=true)
Γ = christoffel(M)`}
                    result={`(1, 2)-Tensor
Num[0 0; 0 cos(θ) / sin(θ);;; 0 (-1//2)*sin(2θ); cos(θ) / sin(θ) 0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Passing to CovariantDerivative to build the connection
∂ = PartialDerivative((θ, φ))
∇ = CovariantDerivative(Γ, ∂)
X = Tensor([sin(θ), 0])
∇[:i] * X[:j]`}
                    result={`(1, 1)-Tensor T^j_i
Num[cos(θ) 0; 0 cos(θ)]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="levi-civita"
                name="levicivita"
                code={`levicivita(M)`}
                description={<>Constructs the Levi-Civita connection as a <Ref to={refLinks.CovariantDerivative}>CovariantDerivative</Ref> in one step, combining <Ref to={refLinks.christoffel}>christoffel</Ref> and <Ref to={refLinks.CovariantDerivative}>CovariantDerivative</Ref>. Equivalent to <code>CovariantDerivative(christoffel(M), PartialDerivative(M))</code>. The preferred way to build a covariant derivative when no custom connection is needed.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to build the connection on.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
M = Manifold((θ, φ), e)
∇ = levicivita(M)

X = Tensor([sin(θ), 0])
∇[:i] * X[:j]`}
                    result={`(1, 1)-Tensor T^j_i
Num[cos(θ) 0; 0 cos(θ)]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Covariant divergence of a vector field
∇[:i] * X[:i]`}
                    result={`2cos(θ)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="lie"
                name="lie"
                code={`lie(X::Tensor, A::Tensor, ∂::PartialDerivative; simple=false)`}
                description={<>Computes the Lie derivative <Math>{'\\mathcal{L}_X A'}</Math> of a tensor <Math>{'A'}</Math> along a vector field <Math>{'X'}</Math>, which measures how <Math>{'A'}</Math> changes as it is carried along the flow of <Math>{'X'}</Math>. It adds the derivative of <Math>{'A'}</Math> along <Math>{'X'}</Math>, then a term for each index: each contravariant index subtracts <Math>{'\\partial_k X^i A^{...k...}'}</Math> and each covariant index adds <Math>{'\\partial_j X^k A_{...k...}'}</Math>. The result is a tensor of the same type as <Math>{'A'}</Math>. For a vector <Math>{'A = Y'}</Math> it is the Lie bracket <Math display>{'[X, Y]^k = X^i \\partial_i Y^k - Y^i \\partial_i X^k'}</Math> which measures the failure of the flows of <Math>{'X'}</Math> and <Math>{'Y'}</Math> to commute. <code>X</code> must be a <Math>{'(1, 0)'}</Math>-tensor and the components of both must be symbolic expressions in the coordinates of <code>∂</code>.</>}
                args={[
                    ['X', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the coordinates of <code>∂</code>.</>],
                    ['A', 'Tensor', <>A tensor of any type to differentiate along <code>X</code>. A <Math>{'(1, 0)'}</Math>-tensor gives the Lie bracket.</>],
                    ['∂', 'PartialDerivative', <>The partial derivative operator defining the coordinate system.</>],
                ]}
                kwargs={[
                    ['simple', 'Bool', 'false', <>When <code>true</code>, applies <code>simplify</code> to the result.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables u v
∂ = PartialDerivative((u, v))
X = Tensor([u, v])
Y = Tensor([u^2, -v + 2])
lie(X, Y, ∂)`}
                    result={`(1, 0)-Tensor
Num[u^2, -2]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The Lie bracket is antisymmetric: [X, Y] = -[Y, X]
lie(Y, X, ∂)`}
                    result={`(1, 0)-Tensor
Num[-(u^2), 2]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A vector field commutes with itself
lie(X, X, ∂, simple=true)`}
                    result={`(1, 0)-Tensor
Num[0, 0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The Lie derivative of a covector
ω = Tensor([v, u]')
lie(X, ω, ∂, simple=true)`}
                    result={`(0, 1)-Tensor
Num[2v, 2u]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Cartan's formula, the Lie derivative of a form: L_X ω = ι_X dω + d(ι_X ω)
d = ExteriorDerivative(∂)
dω = d[:i] * ω[:j]
simplify(interior(X, dω)[:i] + (d[:i] * interior(X, ω))[:i])`}
                    result={`(0, 1)-Tensor T_i
Num[2v, 2u]`}
                />
            </FunctionDocs>

            <PageNav prev="Hodge Star" next="Curvature" />
        </>
    );
}
