import CodeBlock from '../../components/Code/CodeBlock';
import PageNav from '../../components/PageNav/PageNav';

export default function GettingStarted() {
    return (
        <>
            <p className="learn-title">Getting Started</p>
            <p className="learn-heading" id="installation">Installation</p>
            <p className="learn-body">
                 Covariant.jl can be installed by either running
            </p>
            <CodeBlock lang="julia" code={
`julia> using Pkg
julia> Pkg.add("https://github.com/echotops/Covariant.jl")`
            } />
            <p className="learn-body">
                or by pressing <code>]</code> and running
            </p>
            <CodeBlock lang="julia pkg" code={
`pkg> add https://github.com/echotops/Covariant.jl`
            } />
            <p className="learn-heading" id="quick-start">Quick Start</p>
            <p className="learn-body">
                 First, to import Covariant, run
            </p>
            <CodeBlock lang="julia" code={
`using Covariant`
            } />
            <p className="learn-body">
                You can contract two tensors with
            </p>
            <CodeBlock lang="julia"
code={`L = Tensor([[2, 1]', [-1, 3]'])
v = Tensor([1, 2])
L[:i][:j] * v[:j]  # Matrix-vector product`}
result={`(1, 0)-Tensor:
[4, 5]
    (:contra,)
    (:i,), ()`}
            />
            <p className="learn-body">
                And compute the Riemann curvature tensor on a 2-sphere as
            </p>
            <CodeBlock lang="julia"
code={`using Symbolics
@variables u v
basis = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(u)])
])
riemann((u, v), basis, simple=true)`}
result={`(1, 3)-Tensor:
Num[0.0 0.0; 0.0 -1.0;;; 0.0 sin(u)^2; 0 0;;;; 0.0 0; 1.0 0;;; -(sin(u)^2) 0; 0 0]
    (:contra, :co, :co, :co)`}
            />
            <PageNav next="Tensors" />
        </>
    );
}