import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function MetricConnections() {
    return (
        <>
            <p className="learn-title">Metric & Connections</p>

            <FunctionDocs
                id="metric"
                name="metric"
                code={`metric(e::Basis, inner_product=⋅; simple=false)`}
                description={<>Constructs the metric tensor from a vector basis by computing the inner product of every pair of basis elements. The result is a symmetric <Math>{'(0, 2)'}</Math>-tensor whose components are <Math>{'g_{ij} = \\langle e_i, e_j \\rangle'}</Math>. The basis must be a vector <Math>{'(:contra,)'}</Math> basis. By default uses the Euclidean inner product <Math>{'\\cdot'}</Math>, but any function of the same signature can be passed — most notably <code>minkowski</code> for special-relativistic geometry.</>}
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
                    result={`(0, 2)-Tensor:
[1 0; 0 1]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Non-trivial metric from an oblique basis
e = Basis([Tensor([1, 2]), Tensor([3, -1])])
metric(e)`}
                    result={`(0, 2)-Tensor:
[5 1; 1 10]
    (:co, :co)`}
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
                    result={`(0, 2)-Tensor:
[-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]
    (:co, :co)`}
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
                    result={`(2, 0)-Tensor:
[1 0; 0 1]
    (:contra, :contra)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Using the inverse metric to raise an index
ω = Tensor([1, -2]') ⊗ Tensor([-3, 2]')   # A (0, 2)-tensor
𝔤[:i, :j] * ω[:i, :k]`}
                    result={`(1, 1)-Tensor:
[1 -2; -3 2]
    (:contra, :co)
    (:j,), (:k,)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="minkowski"
                name="minkowski"
                code={`minkowski(A::Tensor, B::Tensor, timelike_positive=false)`}
                description={<>The Minkowski inner product on two <Math>{'(1, 0)'}</Math>-tensors, for use as the <code>inner_product</code> argument of <code>metric</code>. The default sign convention is <Math>{'(-, +, +, +)'}</Math> — the timelike component is negative. Passing <code>timelike_positive=true</code> switches to <Math>{'(+, -, -, -)'}</Math>. Both operands must be <Math>{'(1, 0)'}</Math>-tensors.</>}
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
                    result={`(0, 2)-Tensor:
[-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]
    (:co, :co)`}
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
                    result={`(0, 2)-Tensor:
[1 0 0 0; 0 -1 0 0; 0 0 -1 0; 0 0 0 -1]
    (:co, :co)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="christoffel"
                name="christoffel"
                code={`christoffel(coordinates, basis; simple=false)`}
                description={<>Computes the Christoffel symbols <Math>{'\\Gamma^l_{jk}'}</Math> of the Levi-Civita connection from a set of symbolic coordinates and a vector basis. Returns a <Math>{'(1, 2)'}</Math>-tensor. Computed via the standard formula <Math>{'\\Gamma^l_{jk} = \\frac{1}{2} g^{lr} (\\partial_k g_{rj} + \\partial_j g_{rk} - \\partial_r g_{jk})'}</Math>, where <Math>{'g'}</Math> is the metric derived from the basis. The result is passed to <code>CovariantDerivative</code> to construct a covariant derivative operator — or use <code>levicivita</code> to do both in one step.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>A tuple of symbolic variables defined with <code>@variables</code>, one per dimension.</>],
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis whose elements are expressions in <code>coordinates</code>.</>],
                ]}
                kwargs={[
                    ['simple', 'Bool', 'false', <>When <code>true</code>, applies <code>simplify</code> to the result.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
Γ = christoffel((θ, φ), e, simple=true)`}
                    result={`(1, 2)-Tensor:
Num[0.0 0.0; 0.0 -sin(θ)*cos(θ);;; 0.0 cos(θ)/sin(θ); cos(θ)/sin(θ) 0.0]
    (:contra, :co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Passing to CovariantDerivative to build the connection
∂ = PartialDerivative((θ, φ))
∇ = CovariantDerivative(Γ, ∂)
X = Tensor([sin(θ), 0])
∇[:i] * X[:j]`}
                    result={`(1, 1)-Tensor:
Num[cos(θ) 0; 0 cos(θ)]
    (:contra, :co)
    (:j,), (:i,)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="levi-civita"
                name="levicivita"
                code={`levicivita(coordinates, basis)`}
                description={<>Constructs the Levi-Civita connection as a <code>CovariantDerivative</code> in one step, combining <code>christoffel</code> and <code>CovariantDerivative</code>. Equivalent to <code>CovariantDerivative(christoffel(coordinates, basis), PartialDerivative(coordinates))</code>. The preferred way to build a covariant derivative when no custom connection is needed.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>A tuple of symbolic variables defined with <code>@variables</code>, one per dimension.</>],
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis whose elements are expressions in <code>coordinates</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
∇ = levicivita((θ, φ), e)

X = Tensor([sin(θ), 0])
∇[:i] * X[:j]`}
                    result={`(1, 1)-Tensor:
Num[cos(θ) 0; 0 cos(θ)]
    (:contra, :co)
    (:j,), (:i,)`}
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
                code={`lie(X::Tensor, Y::Tensor, ∂::PartialDerivative; simple=false)`}
                description={<>Computes the Lie bracket <Math>{'[X, Y]'}</Math> of two vector fields, defined as <Math>{'[X, Y]^k = X^i \\partial_i Y^k - Y^i \\partial_i X^k'}</Math>. The result is a <Math>{'(1, 0)'}</Math>-tensor measuring the failure of the flows of <Math>{'X'}</Math> and <Math>{'Y'}</Math> to commute. Both inputs must be <Math>{'(1, 0)'}</Math>-tensors and their components must be symbolic expressions in the coordinates of <code>∂</code>.</>}
                args={[
                    ['X', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the coordinates of <code>∂</code>.</>],
                    ['Y', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor whose components are symbolic expressions in the coordinates of <code>∂</code>.</>],
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
                    result={`(1, 0)-Tensor:
Num[u^2, -2]
    (:contra,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The Lie bracket is antisymmetric: [X, Y] = -[Y, X]
lie(Y, X, ∂)`}
                    result={`(1, 0)-Tensor:
Num[-(u^2), 2]
    (:contra,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A vector field commutes with itself
lie(X, X, ∂, simple=true)`}
                    result={`(1, 0)-Tensor:
Num[0, 0]
    (:contra,)`}
                />
            </FunctionDocs>

            <PageNav prev="Hodge Star" next="Curvature" />
        </>
    );
}
