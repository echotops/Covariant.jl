"""
Computes the inverse of a (2, 0) or (0, 2) tensor (the metric or inverse metric)
"""
function LinearAlgebra.inv(A::Tensor)
    if length(A.variance) != 2
        error("Must be a rank 2 tensor")
    elseif A.variance[1] != A.variance[2]
        error("Must either a (2, 0) or (0, 2) tensor")
    end
    mat = Matrix{Num}(A.data)
    if A.variance[1] == :co
        return Tensor(inv(mat), (:contra, :contra))
    else
        return Tensor(inv(mat), (:co, :co))
    end
end

"""
Define the Minkowski norm on two (1, 0) tensors.

Sign convention is the timelike_positive argument, false by default. (-, +, +, +)
"""
function minkowski(A::Tensor, B::Tensor, timelike_positive=false)
    if A.variance != (:contra,) || B.variance != (:contra,)
        error("A and B must both be (1, 0) tensors")
    end
    k = timelike_positive ? 1 : -1
    return (k * A.data[1] * B.data[1]) + sum([-k * A.data[i] * B.data[i] for i in 2:length(A.data)])
end

"""
Compute the metric tensor g from a vector basis

# Examples
```
julia> basis = (Tensor([1, 2]), Tensor([3, -1]))
julia> g = metric(basis)
Tensor{Int64, 2}([5 1; 1 10], (:co, :co))
```
"""
function metric(e::Basis, inner_product=⋅; simple=false)
    if e.variance != (:contra,)
        error("Must be a vector basis")
    end
    g = [inner_product(e.elements[i], e.elements[j]) for i in eachindex(e.elements), j in eachindex(e.elements)]
    if simple
        return simplify(Tensor(g, (:co, :co,)))
    end
    return Tensor(g, (:co, :co,))
end

"""
Compute the Christoffel Symbols Γ for the Levi-Civita Connection from the coordinates and a basis

Returns a (1, 2)-tensor containing the connection coefficients

# Examples
```
julia> @variables u v
julia> basis = Basis([Tensor([u, 0]), Tensor([0, v])])
julia> christoffel((u, v), basis)
IndexedTensor{Num, 3, 1, 2}(Tensor{Num, 3}..., (:l,), (:j, :k))
```
"""
function christoffel(coordinates, basis; simple=false)
    ∂ = PartialDerivative(coordinates)
    g = metric(basis)
    G = inv(g)
    T1 = ∂[:k] * g[:r, :j]
    T2 = ∂[:j] * g[:r, :k]
    T3 = ∂[:r] * g[:j, :k]
    if simple
        return simplify((0.5 * G[:l, :r] * (T1 + T2 - T3)).tensor)
    end
    return (0.5 * G[:l, :r] * (T1 + T2 - T3)).tensor
end

"""
Return the Levi-Civita Connection given coordinates and a basis

# Examples
```
julia> @variables u v
julia> basis = Basis([Tensor([u, 0]), Tensor([0, v])])
julia> levicivita((u, v), basis)
CovariantDerivative(
(1, 2)-Tensor:
Num[...]
  (:contra, :co, :co), 
  PartialDerivative{2}((u, v))
)
```
"""
function levicivita(coordinates, basis)
    ∂ = PartialDerivative(coordinates)
    Γ = christoffel(coordinates, basis)
    return CovariantDerivative(Γ, ∂)
end

"""
Compute the Lie bracket of two (1, 0)-tensors

Returns a (1, 0)-tensor

# Examples
```
julia> @variables u, v
julia> ∂ = PartialDerivative((u, v))
julia> X = Tensor([u^2 + 1, -2v])
julia> Y = Tensor([v, 3 - v])
julia> lie(X, Y, ∂)
Tensor{Num, 1}(Num[-2v - 2u*v, 2v + 2(3 - v)], (:contra,))
```
"""
function lie(X::Tensor, Y::Tensor, ∂::PartialDerivative; simple=false)
    T1 = X[:i] * (∂[:i] * Y[:k])
    T2 = Y[:i] * (∂[:i] * X[:k])
    if simple
        return simplify((T1 - T2).tensor)
    end
    return (T1 - T2).tensor
end

"""
Compute the Riemann Curvature Tensor R given coordinates and a basis

Returns a (1, 3)-tensor ordered as R^c_abd

# Examples
```
julia> @variables θ φ
julia> basis = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
julia> riemann((θ, φ), basis)
Tensor{Num, 4}(Num[...], (:contra, :co, :co, :co))
```
"""
function riemann(coordinates, basis; simple=false)
    ∂ = PartialDerivative(coordinates)
    Γ = christoffel(coordinates, basis)
    T1 = ∂[:i] * Γ[:l][:j, :k]
    T2 = ∂[:j] * Γ[:l][:i, :k]
    T3 = Γ[:l][:i, :m] * Γ[:m][:j, :k]
    T4 = Γ[:l][:j, :m] * Γ[:m][:i, :k]
    if simple
        return simplify((T1 - T2 + T3 - T4).tensor)
    end
    return (T1 - T2 + T3 - T4).tensor
end

"""
Compute the Ricci Curvature Tensor R given coordinates and a basis

Returns a (0, 2)-tensor R_ab from the Riemann Curvature Tensor R^c_abd

# Examples
```
julia> @variables θ φ
julia> basis = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
julia> ricci((θ, φ), basis)
Tensor{Num, 2}(Num[...], (:co, :co))
```
"""
function ricci(coordinates, basis; simple=false)
    R = riemann(coordinates, basis)
    if simple
        return simplify(R[:i][:j, :k, :i].tensor)
    end
    return R[:i][:j, :k, :i].tensor
end

"""
Compute the Ricci Scalar R given coordinates, a basis, and an inner product

Returns a scalar R from the trace of the Ricci Curvature Tensor

# Examples
```
julia> @variables θ φ
julia> basis = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
julia> simplify(ricci_scalar((θ, φ), basis))
2
```
"""
function ricci_scalar(coordinates, basis, inner_product=⋅; simple=false)
    R = ricci(coordinates, basis)
    g = metric(basis, inner_product)
    G = inv(g)
    if simple
        return simplify(G[:i, :j] * R[:i, :j])
    end
    return G[:i, :j] * R[:i, :j]
end

"""
Compute the Einstein Tensor G given coordinates, a basis, and an inner product

Returns a (0, 2)-tensor G_ab from the Riemann Curvature Tensor R^c_abd

# Examples
```
julia> @variables θ φ
julia> basis = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
julia> einstein((θ, φ), basis)
Tensor{Num, 2}(Num[...], (:co, :co))
```
"""
function einstein(coordinates, basis, inner_product=⋅; simple=false)
    R = ricci(coordinates, basis)
    R_scalar = ricci_scalar(coordinates, basis, inner_product)
    g = metric(basis, inner_product)
    G = (R[:i, :j] - (0.5 * R_scalar * g[:i, :j])).tensor
    if simple
        return simplify(G)
    end
    return G
end