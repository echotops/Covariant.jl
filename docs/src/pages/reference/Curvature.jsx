import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function Curvature() {
    return (
        <>
            <p className="learn-title">Curvature</p>
            <p className="learn-body">
                The curvature functions form a hierarchy — each builds on the previous.
                The Riemann tensor encodes the full curvature of a space; contracting one
                of its indices yields the Ricci tensor; tracing the Ricci tensor with the
                inverse metric yields the Ricci scalar; and combining all three yields the
                Einstein tensor. All four functions accept the same <code>coordinates</code> and{' '}
                <code>basis</code> arguments, and all support <code>simple=true</code> to
                simplify symbolic results.
            </p>

            <FunctionDocs
                id="riemann"
                name="riemann"
                code={`riemann(coordinates, basis; simple=false)`}
                description={<>Computes the Riemann curvature tensor <Math>{'R^l{}_{jki}'}</Math>, a <Math>{'(1, 3)'}</Math>-tensor encoding how parallel transport around an infinitesimal loop fails to return a vector to its original orientation. Computed from the Christoffel symbols via <Math>{'R^l{}_{jki} = \\partial_i \\Gamma^l_{jk} - \\partial_j \\Gamma^l_{ik} + \\Gamma^l_{im} \\Gamma^m_{jk} - \\Gamma^l_{jm} \\Gamma^m_{ik}'}</Math>. A space is flat if and only if the Riemann tensor vanishes everywhere.</>}
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
                    code={`# Riemann tensor on the 2-sphere
@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
riemann((θ, φ), e, simple=true)`}
                    result={`(1, 3)-Tensor:
Num[0.0 0.0; 0.0 -1.0;;; 0.0 sin(θ)^2; 0 0;;;; 0.0 0; 1.0 0;;; -(sin(θ)^2) 0; 0 0]
    (:contra, :co, :co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Flat space — the Riemann tensor vanishes
e_flat = Basis([Tensor([1, 0]), Tensor([0, 1])])
@variables x y
riemann((x, y), e_flat, simple=true)`}
                    result={`(1, 3)-Tensor:
Num[0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0;;;; 0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0]
    (:contra, :co, :co, :co)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="ricci"
                name="ricci"
                code={`ricci(coordinates, basis; simple=false)`}
                description={<>Computes the Ricci curvature tensor <Math>{'R_{jk}'}</Math>, a symmetric <Math>{'(0, 2)'}</Math>-tensor obtained by contracting the first and last indices of the Riemann tensor, <Math>{'R_{jk} = R^i{}_{jki}'}</Math>. Measures the degree to which the geometry of a space differs from flat space in each direction — in particular, whether nearby geodesics converge or diverge.</>}
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
ricci((θ, φ), e, simple=true)`}
                    result={`(0, 2)-Tensor:
Num[1.0 0.0; 0.0 sin(θ)^2]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# On the 2-sphere the Ricci tensor is proportional to the metric,
# R_ij = K * g_ij, where K is the Gaussian curvature (here K = 1)
metric(e)`}
                    result={`(0, 2)-Tensor:
Real[1 0; 0 sin(θ)^2]
    (:co, :co)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="ricci-scalar"
                name="ricci_scalar"
                code={`ricci_scalar(coordinates, basis, inner_product=⋅; simple=false)`}
                description={<>Computes the Ricci scalar <Math>{'R'}</Math>, a single number obtained by tracing the Ricci tensor with the inverse metric, <Math>{'R = g^{ij} R_{ij}'}</Math>. Provides a single coordinate-independent measure of the curvature of a space at each point. On the 2-sphere of unit radius the Ricci scalar is identically <Math>{'2'}</Math>, reflecting constant positive curvature.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>A tuple of symbolic variables defined with <code>@variables</code>, one per dimension.</>],
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis whose elements are expressions in <code>coordinates</code>.</>],
                    ['inner_product', 'Function', <>The inner product used to construct the metric. Defaults to the Euclidean dot product <code>⋅</code>.</>],
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
ricci_scalar((θ, φ), e, simple=true)`}
                    result={`2`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Flat space has zero Ricci scalar
@variables x y
e_flat = Basis([Tensor([1, 0]), Tensor([0, 1])])
ricci_scalar((x, y), e_flat, simple=true)`}
                    result={`0`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="einstein"
                name="einstein"
                code={`einstein(coordinates, basis, inner_product=⋅; simple=false)`}
                description={<>Computes the Einstein tensor <Math>{'G_{ij} = R_{ij} - \\frac{1}{2} R g_{ij}'}</Math>, a <Math>{'(0, 2)'}</Math>-tensor combining the Ricci tensor, Ricci scalar, and metric. The Einstein tensor appears on the left-hand side of Einstein's field equations and has the fundamental property that its covariant divergence vanishes identically, <Math>{'\\nabla^i G_{ij} = 0'}</Math>, which encodes the local conservation of energy and momentum.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>A tuple of symbolic variables defined with <code>@variables</code>, one per dimension.</>],
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis whose elements are expressions in <code>coordinates</code>.</>],
                    ['inner_product', 'Function', <>The inner product used to construct the metric. Defaults to the Euclidean dot product <code>⋅</code>.</>],
                ]}
                kwargs={[
                    ['simple', 'Bool', 'false', <>When <code>true</code>, applies <code>simplify</code> to the result.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# The Einstein tensor vanishes identically in any 2D space,
# regardless of curvature — a low-dimensional degeneracy of
# general relativity, not a special property of the sphere
@variables θ φ
e = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
einstein((θ, φ), e, simple=true)`}
                    result={`(0, 2)-Tensor:
Num[0.0 0.0; 0.0 0]
    (:co, :co)`}
                />
            </FunctionDocs>

            <PageNav prev="Metric & Connections" next="Simplify & Evaluate" />
        </>
    );
}
