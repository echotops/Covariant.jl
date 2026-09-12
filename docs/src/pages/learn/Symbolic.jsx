import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';

export default function Symbolic() {
    return (
        <>
            <p className="learn-title">Symbolic</p>
            <p className="learn-body">
                Once coordinates are declared with <code>@variables</code>, most geometry and calculus
                functions return components as <code>Num</code>, the symbolic expression type from
                <code>Symbolics.jl</code>, rather than plain floats. That keeps derivatives and curvature
                exact instead of approximated, but it also means the expressions need a bit of shaping
                before they're readable or usable elsewhere. <code>simplify</code>, <code>substitute</code>,
                and <code>evaluate</code> cover that shaping, from cleaning up an expression to pinning
                it down to a single number.
            </p>
            <p className="learn-heading" id="simplify">Simplify</p>
            <p className="learn-body">
                Symbolic results are rarely in their simplest form, since each step of a calculation
                accumulates whatever terms fall out of it. <code>simplify</code> applies
                <code>Symbolics.simplify</code> to every component of a <code>Tensor</code>
                or <code>IndexedTensor</code>, independently, and returns the same type with the same
                variance and index labels
            </p>
            <CodeBlock lang="julia"
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
            <p className="learn-body">
                This is common enough after a geometry calculation that most of those functions accept
                a <code>simple=true</code> keyword as a shorthand for calling <code>simplify</code> on
                the result, as seen throughout the previous two pages
            </p>
            <CodeBlock lang="julia"
code={`# Equivalent to simplify(ricci_scalar((θ, φ), e))
ricci_scalar((θ, φ), e, simple=true)`}
result={`2`}
            />
            <p className="learn-heading" id="substitute">Substitute</p>
            <p className="learn-body">
                <code>substitute</code> replaces symbolic variables in a <code>Tensor</code> with
                concrete values or other expressions, component-wise, using a dictionary. Unlike
                <code>evaluate</code>, it doesn't force a numerical result, so it's useful for
                pinning down some coordinates while leaving others symbolic
            </p>
            <CodeBlock lang="julia"
code={`R = ricci((θ, φ), e, simple=true)

# Evaluate at the equator θ = π/2
substitute(R, Dict(θ => π/2))`}
result={`(0, 2)-Tensor:
Num[1.0 0.0; 0.0 1.0]
    (:co, :co)`}
            />
            <p className="learn-body">
                Substitution doesn't need to be complete, and the replacement itself can be symbolic
            </p>
            <CodeBlock lang="julia"
code={`@variables u v
X = Tensor([u^2 * v, sin(u) + v])
substitute(X, Dict(u => v^2)) # Partial, and replacing with an expression`}
result={`(1, 0)-Tensor:
Num[v^6, sin(v^2) + v]
    (:contra,)`}
            />
            <p className="learn-heading" id="evaluate">Evaluate</p>
            <p className="learn-body">
                <code>evaluate</code> is a stricter version of <code>substitute</code> that fully
                resolves a symbolic <code>Tensor</code>, or a scalar <code>Num</code>, down to
                <code>Float64</code>. Every free variable has to be given a value, or it raises an
                error, which makes it the natural last step before handing a result to code that
                expects plain numbers, like the visualization and solver functions on the following
                pages
            </p>
            <CodeBlock lang="julia"
code={`# Numerically evaluate the Ricci tensor at θ = π/4
evaluate(R, Dict(θ => π/4, φ => 0.0))`}
result={`(0, 2)-Tensor:
[1.0 0.0; 0.0 0.5]
    (:co, :co)`}
            />
            <p className="learn-body">
                It works the same way on the raw symbolic scalars that come out of contracting an
                <code>IndexedTensor</code> down to a number
            </p>
            <CodeBlock lang="julia"
code={`f = u^2 * sin(v)
evaluate(f, Dict(u => 3.0, v => π/6))`}
result={`4.5`}
            />
            <PageNav prev="Differential Forms" next="Visualization" />
        </>
    );
}
