import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import Ref from '../../components/Ref/Ref';
import { refLinks } from '../../data/nav';

export default function CoordinateChanges() {
    return (
        <>
            <p className="learn-title">Coordinate Changes</p>
            <p className="learn-body">
                A tensor is the same geometric object in every chart, and only its components change.
                A coordinate change is given by the new coordinates as functions of the old ones,
                <Math>{'u^i(x^1, ..., x^n)'}</Math>. Contravariant indices transform with the
                Jacobian <Math>{'\\partial u^i / \\partial x^j'}</Math>, covariant indices with its
                inverse, and basis vectors transform the opposite way to components.
            </p>

            <FunctionDocs
                id="transform"
                name="transform"
                code={`transform(A::Tensor, old, new; to=nothing, inverse=nothing, simple=false)`}
                description={<>Transforms the components of a tensor to a new coordinate chart. <code>old</code> are the old coordinate symbols and <code>new</code> are the new coordinates as expressions in them. Each contravariant index of <code>A</code> is multiplied by the Jacobian <Math>{'\\partial u^i / \\partial x^j'}</Math>, and each covariant index by the inverse Jacobian, so a <Math>{'(1, 1)'}</Math>-tensor keeps its trace and determinant. The components are written in terms of the old coordinates, their values at each point. To write them in terms of the new coordinates, give their symbols as <code>to</code> and the old coordinates as expressions in them as <code>inverse</code>. Apply it to the metric to find the metric in a new chart.</>}
                args={[
                    ['A', 'Tensor', <>The tensor to transform, of any type, whose components are in the old coordinates.</>],
                    ['old', 'Tuple{Num}', <>The old coordinate symbols.</>],
                    ['new', 'Tuple', <>The new coordinates as expressions in the old ones.</>],
                ]}
                kwargs={[
                    ['to', 'Tuple{Num}', 'nothing', <>The new coordinate symbols, to write the result in terms of. Needs <code>inverse</code>.</>],
                    ['inverse', 'Tuple', 'nothing', <>The old coordinates as expressions in the new coordinate symbols <code>to</code>.</>],
                    ['simple', 'Bool', 'false', <>When <code>true</code>, applies <code>simplify</code> to the result.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# A radial vector field is (r, 0) in polar coordinates
@variables x y
polar = (sqrt(x^2 + y^2), atan(y, x))

X = Tensor([x, y])
transform(X, (x, y), polar, simple=true)`}
                    result={`(1, 0)-Tensor
Num[sqrt(x^2 + y^2), 0]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The Euclidean metric in polar coordinates, at each point (x, y)
g = Tensor([1 0; 0 1], :co, :co)
transform(g, (x, y), polar, simple=true)`}
                    result={`(0, 2)-Tensor
Num[1 0; 0 x^2 + y^2]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Written in the new coordinates u = x + y, v = x - y
@variables u v
shear = (x + y, x - y)
back = ((u + v) / 2, (u - v) / 2)

transform(g, (x, y), shear, to=(u, v), inverse=back, simple=true)`}
                    result={`(0, 2)-Tensor
Num[1//2 0; 0 1//2]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Covectors use the inverse Jacobian: dx = (du + dv) / 2
dx = Tensor([1, 0]')
transform(dx, (x, y), shear, to=(u, v), inverse=back, simple=true)`}
                    result={`(0, 1)-Tensor
Num[1//2, 1//2]`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The trace and determinant of a (1, 1)-tensor are the same in every chart
L = Tensor([2 -1; 5 3])
Lp = transform(L, (x, y), shear, simple=true)
tr(Lp), det(Lp)`}
                    result={`(5, 11)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The new coordinates must match the old ones in number
transform(X, (x, y), (x, y, x))`}
                    result={`ERROR: A coordinate change needs as many new coordinates as old ones, but there are 2 old and 3 new`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="transform-basis"
                name="transform"
                code={`transform(e::Basis, old, new; to=nothing, inverse=nothing, simple=false)`}
                description={<>Transforms a vector or covector <Ref to={refLinks.Basis}>Basis</Ref> to a new chart. Basis vectors change the opposite way to components, so the new basis vector is <Math>{'e\'_i = (\\partial x^j / \\partial u^i) e_j'}</Math>, and a covector basis changes with the Jacobian itself. The arguments are the same as for a tensor.</>}
                args={[
                    ['e', 'Basis', <>A vector or covector basis with one element per coordinate.</>],
                    ['old', 'Tuple{Num}', <>The old coordinate symbols.</>],
                    ['new', 'Tuple', <>The new coordinates as expressions in the old ones.</>],
                ]}
                kwargs={[
                    ['to', 'Tuple{Num}', 'nothing', <>The new coordinate symbols, to write the result in terms of. Needs <code>inverse</code>.</>],
                    ['inverse', 'Tuple', 'nothing', <>The old coordinates as expressions in the new coordinate symbols <code>to</code>.</>],
                    ['simple', 'Bool', 'false', <>When <code>true</code>, applies <code>simplify</code> to the result.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# The Cartesian basis in the sheared coordinates
@variables x y
shear = (x + y, x - y)
e = Basis([Tensor([1, 0]), Tensor([0, 1])])
transform(e, (x, y), shear, simple=true)`}
                    result={`(1, 0)-Basis
Num[1//2, 1//2]
Num[1//2, -1//2]`}
                />
            </FunctionDocs>

            <PageNav prev="Curvature" next="Simplify & Evaluate" />
        </>
    );
}
