import TypeDocs from '../../components/Docs/TypeDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';

export default function SpecialObjects() {
    return (
        <>
            <p className="learn-title">Special Objects</p>

            <TypeDocs
                id="kronecker-delta"
                name="KroneckerDelta"
                code={`struct KroneckerDelta`}
                description={<>The Kronecker delta <Math>{'\\delta^i_j'}</Math>, which returns <Math>{'1'}</Math> when its two indices are equal and <Math>{'0'}</Math> otherwise. Constructed with no arguments and contracted against tensors via symbolic indexing, it acts as the identity on index relabeling and is useful for verifying duality conditions between bases.</>}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`δ = KroneckerDelta()
L = Tensor([[1, 2]', [3, 4]'])
L[:i][:j] * δ[:i, :k]   # Relabels the contravariant index i → k`}
                    result={`(1, 1)-Tensor:
[1 3; 2 4]
    (:contra, :co)
    (:k,), (:j,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Verifying that a dual basis satisfies the duality condition
e = Basis([Tensor([2, 0]), Tensor([0, 3])])
ϵ = dual_basis(e)
for i in 1:2, j in 1:2
    println(ϵ[i][:k] * e[j][:k] == δ[i, j])
end`}
                    result={`true
true
true
true`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The identity tensor is δ made concrete in a fixed dimension —
# contracting it with itself recovers that dimension
Id = Tensor([[1, 0]', [0, 1]'])
Id[:i][:i]`}
                    result={`2`}
                />
            </TypeDocs>

            <TypeDocs
                id="levi-civita-symbol"
                name="LeviCivita"
                code={`struct LeviCivita`}
                description={<>The Levi-Civita symbol <Math>{'\\varepsilon_{i_1 i_2 \\cdots i_n}'}</Math>, a completely antisymmetric object that returns <Math>{'1'}</Math> for even permutations of its indices, <Math>{'-1'}</Math> for odd permutations, and <Math>{'0'}</Math> whenever any two indices are equal. Constructed with no arguments and contracted against tensors via symbolic indexing with any number of indices. It is the natural tool for computing cross products, determinants, and antisymmetrization.</>}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`ε = LeviCivita()

# 2D: computes the signed area of the parallelogram spanned by v and u
v = Tensor([2, 1])
u = Tensor([-3, 2])
v[:i] * u[:j] * ε[:i, :j]`}
                    result={`7`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# 3D: computes the cross product of two vectors
a = Tensor([1, 0, 0])
b = Tensor([0, 1, 0])
a[:i] * b[:j] * ε[:i, :j, :k]`}
                    result={`(0, 1)-Tensor:
[0, 0, 1]
    (:co,)
    (), (:k,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Antisymmetry means repeated indices always cancel to 0,
# so crossing a vector with itself vanishes
v[:i] * v[:j] * ε[:i, :j]`}
                    result={`0`}
                />
            </TypeDocs>

            <TypeDocs
                id="hodge-star"
                name="HodgeStar"
                code={`struct HodgeStar`}
                description={<>The Hodge star operator <Math>{'\\star'}</Math>, an isomorphism that maps a differential <Math>{'p'}</Math>-form to an <Math>{'(n-p)'}</Math>-form, where <Math>{'n'}</Math> is the dimension of the underlying space. Requires a metric tensor, which it uses to raise all covariant indices of the input form and scale by <Math>{'\\sqrt{|\\det g|}'}</Math> before contracting with the Levi-Civita symbol. The input must be a purely covariant <Math>{'(0, p)'}</Math>-tensor. Applied by calling the instance directly on a <code>Tensor</code>.</>}
                fields={[
                    ['metric', 'Tensor', <>The <Math>{'(0, 2)'}</Math>-metric tensor used to raise indices and compute the volume factor <Math>{'\\sqrt{|\\det g|}'}</Math>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`e = Basis([Tensor([1, 0]), Tensor([0, 1])])
g = metric(e)
⋆ = HodgeStar(g)

α = Tensor([3, -1]')   # A 1-form in 2D → maps to a 1-form
⋆(α)`}
                    result={`(0, 1)-Tensor:
Num[1, 3.0]
    (:co,)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# In 3D, a 1-form maps to a 2-form
e3 = Basis([Tensor([1,0,0]), Tensor([0,1,0]), Tensor([0,0,1])])
⋆₃ = HodgeStar(metric(e3))
β = Tensor([1, 0, 0]')
⋆₃(β)`}
                    result={`(0, 2)-Tensor:
Num[0.0 0.0 0.0; 0.0 0.0 1; 0.0 -1.0 0.0]
    (:co, :co)`}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# A top-form (n-form) maps to a scalar
ω = Tensor([[0, 1]', [-1, 0]']')   # A 2-form in 2D
⋆(ω)`}
                    result={`1`}
                />
            </TypeDocs>

            <PageNav prev="Geometric Objects" next="Differential Operators" />
        </>
    );
}