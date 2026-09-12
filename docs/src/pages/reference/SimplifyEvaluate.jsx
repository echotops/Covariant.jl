import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function SimplifyEvaluate() {
    return (
        <>
            <p className="learn-title">Simplify & Evaluate</p>

            <FunctionDocs
                id="simplify"
                name="simplify"
                code={`Symbolics.simplify(A::Tensor)
Symbolics.simplify(A::IndexedTensor)`}
                description={<>Applies <code>Symbolics.simplify</code> component-wise to a <code>Tensor</code> or <code>IndexedTensor</code>, simplifying symbolic expressions in each component independently. Returns the same type as the input, with variance and index labels preserved. Most geometry functions accept a <code>simple=true</code> keyword argument as a convenient shorthand for calling <code>simplify</code> on their result.</>}
                args={[
                    ['A', 'Tensor | IndexedTensor', <>The tensor whose symbolic components are to be simplified.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
R = ricci((θ, φ), e)
simplify(R)`}
                    result={`(0, 2)-Tensor:
Num[1.0 0.0; 0.0 sin(θ)^2]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Also works on IndexedTensors
@variables u v
∂ = PartialDerivative((u, v))
X = Tensor([sin(u)^2 + cos(u)^2, v])
simplify(∂[:i] * X[:j])`}
                    result={`(1, 1)-Tensor:
Num[1 0; 0 1]
    (:contra, :co)
    (:j,), (:i,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Equivalent to passing simple=true to geometry functions
ricci_scalar((θ, φ), e, simple=true)`}
                    result={`2`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="substitute"
                name="substitute"
                code={`Symbolics.substitute(A::Tensor, dict)`}
                description={<>Substitutes symbolic variables in a <code>Tensor</code> component-wise using a dictionary, applying <code>Symbolics.substitute</code> to each component. Returns a <code>Tensor</code> of the same variance, with the substituted expressions in place of the original symbolic components. Unlike <code>evaluate</code>, substitution does not force numerical evaluation — the result may still contain symbolic expressions if the substitution is partial, or if the replacement values are themselves symbolic.</>}
                args={[
                    ['A', 'Tensor', <>The tensor whose symbolic components are to be substituted.</>],
                    ['dict', 'Dict', <>A dictionary mapping symbolic variables to replacement values or expressions.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
R = ricci((θ, φ), e, simple=true)

# Evaluate at the equator θ = π/2
substitute(R, Dict(θ => π/2))`}
                    result={`(0, 2)-Tensor:
Num[1.0 0.0; 0.0 1.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Partial substitution — result is still symbolic
@variables u v
X = Tensor([u^2 * v, sin(u) + v])
substitute(X, Dict(u => 2))`}
                    result={`(1, 0)-Tensor:
Num[4v, sin(2) + v]
    (:contra,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Replacing a variable with an expression
substitute(X, Dict(u => v^2))`}
                    result={`(1, 0)-Tensor:
Num[v^6, sin(v^2) + v]
    (:contra,)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="evaluate"
                name="evaluate"
                code={`evaluate(A::Tensor, dict)
evaluate(x::Num, dict)`}
                description={<>Fully evaluates a symbolic <code>Tensor</code> or scalar <code>Num</code> to floating-point numbers by substituting all symbolic variables from the dictionary and converting the result to <code>Float64</code>. Unlike <code>substitute</code>, all symbolic variables must be accounted for — any remaining free symbols after substitution will cause an error. Useful for computing numerical values of symbolic tensors at a specific point in the coordinate space.</>}
                args={[
                    ['A', 'Tensor | Num', <>The symbolic tensor or scalar to evaluate numerically.</>],
                    ['dict', 'Dict', <>A dictionary mapping every symbolic variable to a numeric value. All free symbols in <code>A</code> must be present.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
R = ricci((θ, φ), e, simple=true)

# Numerically evaluate the Ricci tensor at θ = π/4
evaluate(R, Dict(θ => π/4, φ => 0.0))`}
                    result={`(0, 2)-Tensor:
[1.0 0.0; 0.0 0.5]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Also works on scalars
@variables u v
f = u^2 * sin(v)
evaluate(f, Dict(u => 3.0, v => π/6))`}
                    result={`4.5`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Useful for sampling a symbolic vector field at a point
X = Tensor([sin(θ) * cos(φ), cos(θ)])
evaluate(X, Dict(θ => π/3, φ => π/4))`}
                    result={`(1, 0)-Tensor:
[0.6124, 0.5]
    (:contra,)`}
                />
            </FunctionDocs>

            <PageNav prev="Curvature" next="Surfaces & Paths" />
        </>
    );
}
