"""
Computes the element-wise partial derivative of a tensor A with respect to the coordinates of ∂.

Given an (m, n) tensor A, returns an (m, n+1) tensor. If indices are repeated, contract over them.

# Examples
```
julia> @variables u v
julia> A = Tensor([[u, 2v]', [3u, v^2]'])
julia> ∂ = PartialDerivative((u, v))
julia> ∂[:k] * A[:i][:j]
IndexedTensor{Num, 3, 1, 2}(Tensor{Num, 3}(Num[1 0; 3 0;;; 0 2; 0 2v], (:contra, :co, :co)), (:i,), (:j, :k))
julia> ∂[:k] * A[:k][:j]
IndexedTensor{Num, 1, 0, 1}(Tensor{Num, 1}(Num[1, 2v], (:co,)), (), (:j,))
```
"""
function Base.:*(∂::IndexedPartialDerivative, A::IndexedTensor)
    Bs = []
    for coordinate in ∂.partial.coordinates
        push!(Bs, map(a -> expand_derivatives(Differential(coordinate)(a)), A.tensor.data))
    end
    B = stack(Bs)
    C = IndexedTensor(Tensor(B, (A.tensor.variance..., :co)), A.contravariant, (A.covariant..., ∂.index))
    duplicates = union(intersect(A.contravariant, [∂.index]), intersect(A.covariant, [∂.index]))
    if isempty(duplicates)
        return C
    end
    return self_contract(C, duplicates)
end

"""
Computes the covariant derivative of a tensor A with respect to the coordinates of ∇.

Given an (m, n) tensor A, returns an (m, n+1) tensor. If indices are repeated, contract over them.
Accounts for the change in the basis vectors from the connection coefficients.

# Examples
```
julia> @variables u v
julia> basis = (Tensor([u, 0]), Tensor([0, v]))
julia> ∂ = PartialDerivative((u, v))
julia> Γ = christoffel((u, v), basis)
julia> x = Tensor([2u + v^2, 1v])
julia> ∇ = CovariantDerivative(Γ, ∂)
julia> ∇[:k] * x[:i]
IndexedTensor{Num, 2, 1, 1}(Tensor{Num, 2}(Num[2 + (2u + v^2) / u 2v; 0.0 2.0], (:contra, :co)), (:i,), (:k,))
```
"""
function Base.:*(∇::IndexedCovariantDerivative, A::IndexedTensor)
    Γ = ∇.covariant.connection
    ∂ = ∇.covariant.partial
    B = ∂[∇.index] * A
    for index in A.contravariant
        dummy_index = Symbol("dummy_$index")
        C_contravariant = collect(A.contravariant)
        contra_index = findfirst(x -> x == index, A.contravariant)
        C_contravariant[contra_index] = dummy_index
        ΓIndexed = Γ[index][dummy_index, ∇.index]
        C = IndexedTensor(A.tensor, Tuple(C_contravariant), A.covariant)
        B += ΓIndexed * C
    end
    for index in A.covariant
        dummy_index = Symbol("dummy_$index")
        C_covariant = collect(A.covariant)
        co_index = findfirst(x -> x == index, A.covariant)
        C_covariant[co_index] = dummy_index
        ΓIndexed = Γ[dummy_index][index, ∇.index]
        C = IndexedTensor(A.tensor, A.contravariant, Tuple(C_covariant))
        B -= ΓIndexed * C
    end
    return B
end

"""
Computes the exterior derivative of a tensor A with respect to the coordinates of d.

Given a (0, p) tensor A, returns an (0, p+1) tensor.

# Examples
```
julia> @variables x y z
julia> ∂ = PartialDerivative((x, y, z))
julia> d = ExteriorDerivative(∂)
julia> α = Tensor([x^2, y*z, x]')
julia> d[:k] * α[:i]
(0, 2)-Tensor:
Num[0.0 0.0 -1.0; 0.0 0.0 y; 1.0 -y 0.0]
  (:co, :co)
```
"""
function Base.:*(d::IndexedExteriorDerivative, A::IndexedTensor)
    if !(all(x -> x == :co, A.tensor.variance))
        error("A must be a differential form")
    end
    ∂ = d.exterior.partial
    B = ∂[d.index] * A
    indices = [Symbol("dummy_$i") for i in eachindex(B.tensor.variance)]
    p = length(A.tensor.variance)
    C = factorial(p + 1) * antisymmetrize(B.tensor[indices...], indices...)[indices...]
    return C.tensor
end

"""
Computes hodge star of a tensor A.

Given a (0, p) tensor A in dimension n, returns a (0, n - p) tensor.

# Examples
```
julia> basis = (Tensor([1, 0]), Tensor([0, 1]))
julia> α = Tensor([1, 2]')
julia> g = metric(basis)
julia> ⋆ = HodgeStar(g)
julia> ⋆(α)
(0, 1)-Tensor:
Num[-2.0, 1.0]
  (:co,)
```
"""
function (hodge::HodgeStar)(A::Tensor)
    if !(all(x -> x == :co, A.variance))
        error("A must be a differential form")
    end
    g = hodge.metric
    G = inv(g)
    det_g = det(g.data)
    p = length(A.variance)
    n = size(A.data, 1)
    ε = LeviCivita()
    lower_indices = [Symbol("dummy_i$i") for i in 1:p]
    upper_indices = [Symbol("dummy_j$i") for i in 1:n]
    # Raise all p indices of A using the inverse metric, converting the p-form to a contravariant density
    B = A[lower_indices...]
    for i in eachindex(lower_indices)
        B = B * G[lower_indices[i], upper_indices[i]]
    end
    # Contract with the Levi-Civita symbol to produce the (n-p)-form
    C = B * ε[upper_indices...]
    # If n == p, A is a top-form and the result is a scalar
    if n == p
        return √(abs(det_g)) * C / factorial(p)
    end
    return (√(abs(det_g)) * C / factorial(p)).tensor
end