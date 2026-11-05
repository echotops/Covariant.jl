import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function Curvature() {
    return (
        <>
            <p className="learn-title">Curvature</p>
            <p className="learn-body">
                All four functions below take a <code>Manifold</code>. Each quantity is computed once and
                cached on the manifold, so asking for the Ricci tensor after the Riemann tensor reuses it.
                Pass <code>simple=true</code> when constructing the manifold to simplify symbolic results.
            </p>

            <FunctionDocs
                id="riemann"
                name="riemann"
                code={`riemann(M)`}
                description={<>Computes the Riemann curvature tensor <Math>{'R^l{}_{jki}'}</Math>, a <Math>{'(1, 3)'}</Math>-tensor encoding how parallel transport around an infinitesimal loop fails to return a vector to its original orientation. Computed from the Christoffel symbols via <Math display>{'R^l{}_{jki} = \\partial_i \\Gamma^l_{jk} - \\partial_j \\Gamma^l_{ik} + \\Gamma^l_{im} \\Gamma^m_{jk} - \\Gamma^l_{jm} \\Gamma^m_{ik}'}</Math> A space is flat if and only if the Riemann tensor vanishes everywhere.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to compute on, with symbolic coordinates and a metric.</>],
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
M = Manifold((θ, φ), e, simple=true)
riemann(M)`}
                    result={`(1, 3)-Tensor
Num[0 0; 0 -1;;; 0 sin(θ)^2; 0 0;;;; 0 0; 1 0;;; -(sin(θ)^2) 0; 0 0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Flat space — the Riemann tensor vanishes
e_flat = Basis([Tensor([1, 0]), Tensor([0, 1])])
@variables x y
F = Manifold((x, y), e_flat, simple=true)
riemann(F)`}
                    result={`(1, 3)-Tensor
Num[0 0; 0 0;;; 0 0; 0 0;;;; 0 0; 0 0;;; 0 0; 0 0]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="ricci"
                name="ricci"
                code={`ricci(M)`}
                description={<>Computes the Ricci curvature tensor <Math>{'R_{jk}'}</Math>, a symmetric <Math>{'(0, 2)'}</Math>-tensor obtained by contracting the first and last indices of the Riemann tensor: <Math display>{'R_{jk} = R^i{}_{jki}'}</Math> Measures the degree to which the geometry of a space differs from flat space in each direction — in particular, whether nearby geodesics converge or diverge.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to compute on, with symbolic coordinates and a metric.</>],
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
ricci(M)`}
                    result={`(0, 2)-Tensor
Num[1 0; 0 sin(θ)^2]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# On the 2-sphere the Ricci tensor is proportional to the metric,
# R_ij = K * g_ij, where K is the Gaussian curvature (here K = 1)
metric(M)`}
                    result={`(0, 2)-Tensor
Real[1 0; 0 sin(θ)^2]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="ricci-scalar"
                name="ricci_scalar"
                code={`ricci_scalar(M)`}
                description={<>Computes the Ricci scalar <Math>{'R'}</Math>, a single number obtained by tracing the Ricci tensor with the inverse metric: <Math display>{'R = g^{ij} R_{ij}'}</Math> Provides a single coordinate-independent measure of the curvature of a space at each point. On the 2-sphere of unit radius the Ricci scalar is identically <Math>{'2'}</Math>, reflecting constant positive curvature.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to compute on, with symbolic coordinates and a metric.</>],
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
ricci_scalar(M)`}
                    result={`2`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Flat space has zero Ricci scalar
@variables x y
e_flat = Basis([Tensor([1, 0]), Tensor([0, 1])])
F = Manifold((x, y), e_flat, simple=true)
ricci_scalar(F)`}
                    result={`0`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="einstein"
                name="einstein"
                code={`einstein(M)`}
                description={<>Computes the Einstein tensor, a <Math>{'(0, 2)'}</Math>-tensor combining the Ricci tensor, Ricci scalar, and metric: <Math display>{'G_{ij} = R_{ij} - \\frac{1}{2} R g_{ij}'}</Math> It appears on the left-hand side of Einstein's field equations and has the fundamental property that its covariant divergence vanishes identically, <Math>{'\\nabla^i G_{ij} = 0'}</Math>, which encodes the local conservation of energy and momentum.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to compute on, with symbolic coordinates and a metric.</>],
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
M = Manifold((θ, φ), e, simple=true)
einstein(M)`}
                    result={`(0, 2)-Tensor
Num[0 0; 0 0]`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="gaussian-curvature"
                name="gaussian_curvature"
                code={`gaussian_curvature(M)`}
                description={<>Computes the Gaussian curvature <Math>{'K'}</Math> of a surface, a 2-dimensional manifold. It is half of the Ricci scalar, <Math display>{'K = \\frac{R}{2}'}</Math> and is positive on a sphere, zero on a plane, and negative on a saddle. Only 2-dimensional manifolds have a single curvature at each point, so higher dimensions raise an error, and <Math>{'\\text{sectional\\_curvature}'}</Math> gives the curvature of a chosen plane there.</>}
                args={[
                    ['M', 'Manifold', <>A 2-dimensional manifold.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
M = Manifold((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]), simple=true)
gaussian_curvature(M)`}
                    result={`1`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The hyperbolic half-plane has constant negative curvature
@variables x y
H = Manifold((x, y), Tensor([1/y^2 0; 0 1/y^2], :co, :co), simple=true)
gaussian_curvature(H)`}
                    result={`-1`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="sectional-curvature"
                name="sectional_curvature"
                code={`sectional_curvature(M, X, Y)`}
                description={<>Computes the sectional curvature of a manifold of any dimension on the plane spanned by two vectors, <Math display>{'K(X, Y) = \\frac{R(X, Y, X, Y)}{g(X, X) g(Y, Y) - g(X, Y)^2}'}</Math> the Gaussian curvature of the surface that the plane sweeps out. On a surface it is the Gaussian curvature for any two independent vectors. The vectors may have symbolic components.</>}
                args={[
                    ['M', 'Manifold', <>The manifold to compute on.</>],
                    ['X', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor.</>],
                    ['Y', 'Tensor', <>A <Math>{'(1, 0)'}</Math>-tensor, independent of <code>X</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
M = Manifold((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]), simple=true)
sectional_curvature(M, Tensor([1, 2]), Tensor([-1, 3]))`}
                    result={`1`}
                />
            </FunctionDocs>

            <PageNav prev="Metric & Connections" next="Coordinate Changes" />
        </>
    );
}
