import TypeDocs from '../../components/Docs/TypeDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function DifferentialOperators() {
    return (
        <>
            <p className="learn-title">Differential Operators</p>

            <TypeDocs
                id="partial-derivative"
                name="PartialDerivative"
                code={`struct PartialDerivative{N}`}
                description={<>The partial derivative operator <Math>{'\\partial'}</Math> with respect to a set of symbolic coordinates. Constructed from a tuple of <code>Symbolics.jl</code> variables and contracted against an <code>IndexedTensor</code> via symbolic indexing, where the index ranges over each coordinate in turn. Produces the correct derivative only when the basis vectors are constant — for non-constant bases, use <code>CovariantDerivative</code> instead.</>}
                fields={[
                    ['coordinates', 'NTuple{N, Num}', <>The tuple of symbolic coordinates to differentiate with respect to, defined with the <code>@variables</code> macro.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables u v
∂ = PartialDerivative((u, v))

# Differentiating a vector field — yields a (1, 1)-tensor
X = Tensor([u * v, v^2 - 1])
∂[:i] * X[:j]`}
                    result={`(1, 1)-Tensor:
Num[v u; 0 2v]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Differentiating a covector field — yields a (0, 2)-tensor
α = Tensor([u^2 * v, v + 2]')
∂[:i] * α[:j]`}
                    result={`(0, 2)-Tensor:
Num[2u*v u^2; v 1]
    (:co, :co)
    (), (:i, :j)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Contracting with a matching index computes the divergence
∂[:i] * X[:i]`}
                    result={`v + 2v`}
                />
            </TypeDocs>

            <TypeDocs
                id="covariant-derivative"
                name="CovariantDerivative"
                code={`struct CovariantDerivative`}
                description={<>The covariant derivative operator <Math>{'\\nabla'}</Math>, which extends the partial derivative to account for the curvature of the underlying space via connection coefficients. Required when basis vectors are not constant. Constructed from a <Math>{'(1, 2)'}</Math>-tensor of connection coefficients and a <code>PartialDerivative</code>. The connection coefficients can be defined manually or computed from a basis using <code>christoffel</code>, and the Levi-Civita connection can be constructed in one step with <code>levicivita</code>.</>}
                fields={[
                    ['connection', 'Tensor', <>A <Math>{'(1, 2)'}</Math>-tensor holding the connection coefficients <Math>{'\\Gamma^k_{ij}'}</Math>.</>],
                    ['partial', 'PartialDerivative', <>The underlying partial derivative operator, providing differentiation with respect to the coordinates.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
∂ = PartialDerivative((θ, φ))
Γ = christoffel((θ, φ), e)
∇ = CovariantDerivative(Γ, ∂)

X = Tensor([sin(θ), 0])
∇[:i] * X[:j]`}
                    result={`(1, 1)-Tensor:
Num[cos(θ) 0; 0 cos(θ)]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# levicivita constructs the Levi-Civita connection in one step
∇ = levicivita((θ, φ), e)
∇[:i] * X[:j]`}
                    result={`(1, 1)-Tensor:
Num[cos(θ) 0; 0 cos(θ)]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Contracting with a matching index computes the covariant divergence
∇[:i] * X[:i]`}
                    result={`2cos(θ)`}
                />
            </TypeDocs>

            <TypeDocs
                id="exterior-derivative"
                name="ExteriorDerivative"
                code={`struct ExteriorDerivative`}
                description={<>The exterior derivative operator <Math>{'d'}</Math>, which takes a differential <Math>{'k'}</Math>-form to a <Math>{'(k+1)'}</Math>-form by differentiating and antisymmetrizing the components. Constructed from a <code>PartialDerivative</code> and contracted against an <code>IndexedTensor</code> via symbolic indexing. A key property of the exterior derivative is nilpotency — applying it twice always returns the zero form, <Math>{'d^2 = 0'}</Math>.</>}
                fields={[
                    ['partial', 'PartialDerivative', <>The underlying partial derivative operator, providing differentiation with respect to the coordinates.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables u v
∂ = PartialDerivative((u, v))
d = ExteriorDerivative(∂)

# Exterior derivative of a 1-form yields a 2-form
α = Tensor([u^2 * v, v + 2]')
d[:i] * α[:j]`}
                    result={`(0, 2)-Tensor:
Num[0.0 u^2; -(u^2) 0.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Exterior derivative of a 0-form (scalar) yields a 1-form
@variables x y z
∂3 = PartialDerivative((x, y, z))
d3 = ExteriorDerivative(∂3)
f = x^2 * y + z
d3[:i] * Tensor([f]')`}
                    result={`(0, 1)-Tensor:
Num[2x*y, x^2, 1]
    (:co,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Nilpotency: applying d twice returns the zero form
β = d[:i] * α[:j]
d[:k] * β[:k, :l]`}
                    result={`(0, 3)-Tensor:
Num[0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0]
    (:co, :co, :co)`}
                />
            </TypeDocs>

            <PageNav prev="Special Objects" next="Constructors" />
        </>
    );
}