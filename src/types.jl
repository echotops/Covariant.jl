"""
An arbitrary rank R (m, n)-tensor of a type T, where R = m + n

# Fields
data::Array{T, R}
    - The data in the tensor

variance::NTuple{R, Symbol}
    - A tuple of :contra and :co denoting the transformation rules for each index.
"""
struct Tensor{T, R}
    data::Array{T, R}
    variance::NTuple{R, Symbol}
end

"""
An indexed rank R (M, N)-tensor for type T.

Returned by getindex(A::Tensor, indices...) and getindex(A::PartialIndexedTensor, indices...)

# Fields
tensor::Tensor{T, R}
    - The tensor that has been indexed

contravariant::NTuple{M, Symbol}
    - The collection of symbols representing the contravariant indices

covariant::NTuple{N, Symbol}
    - The collection of symbols representing the covariant indices

# Examples
An indexed (1, 2) tensor
```
julia> M = Tensor([[[1, 2]', [3, 4]'], [[5, 6]', [7, 8]']]')
Tensor{Int64, 3}([1 3; 5 7;;; 2 4; 6 8], (:co, :contra, :co))
julia> M[:i][:j,:k]
IndexedTensor{Int64, 3, 1, 2}(Tensor{Int64, 3}..., (:i,), (:j, :k))
```
"""
struct IndexedTensor{T, R, M, N}
    tensor::Tensor{T, R}
    contravariant::NTuple{M, Symbol}
    covariant::NTuple{N, Symbol}
end

"""
Internal. Intermediate between Tensor{T, R} and IndexedTensor{T, R, M, N}, without specified
covariant indices.

Returned by getindex(A::Tensor, indices...).

# Fields
tensor::Tensor{T, R}
    - The tensor that has been indexed

contravariant::NTuple{M, Symbol}
    - The collection of symbols representing the contravariant indices
"""
struct PartialIndexedTensor{T, R, M}
    tensor::Tensor{T, R}
    contravariant::NTuple{M, Symbol}
end

"""
The Kronecker Delta δ

Contracts with tensors as δ[:i, :j], returning 1 if i = j and 0 otherwise.

# Examples
```
julia> L = Tensor([[1, 2]', [3, 4]'])
julia> δ = KroneckerDelta()
julia> L[:i][:j] * δ[:i, :k]
IndexedTensor{Int64, 2, 1, 1}(Tensor{Int64, 2}([1 3; 2 4], (:co, :contra)), (:k,), (:j,))
```
"""
struct KroneckerDelta
end

"""
Indexed Kronecker Delta

Returned by getindex(δ::KroneckerDelta, indices...)

# Fields
indices::NTuple{2, Symbol}
    - The collection of symbols representing the indices

# Examples
```
julia> δ = KroneckerDelta()
julia> δ[:i, :j]
IndexedKroneckerDelta((:i, :j))
```
"""
struct IndexedKroneckerDelta
    indices::NTuple{2, Symbol}
end

"""
The Levi-Civita Symbol ε

Contracts with tensors as ε[:i, :j, :k, ...], returning 0 if any indices are repeated, 1 if
(i, j, k...) is an even permutation, and -1 if it is an odd permutation.

# Examples
```
julia> v = Tensor([2, 1]); u = Tensor([-3, 2])
julia> ε = LeviCivita()
julia> v[:i] * u[:j] * ε[:i, :j]
7
```
"""
struct LeviCivita
end

"""
Indexed Levi-Civita Symbol

Returned by getindex(ε::LeviCivita, indices...)

# Fields
indices::NTuple{N, Symbol}
    - The collection of symbols representing the indices

# Examples
```
julia> ε = LeviCivita()
julia> ε[:i, :j, :k]
IndexedLeviCivita{3}((:i, :j, :k))
```
"""
struct IndexedLeviCivita{N}
    indices::NTuple{N, Symbol}
end

"""
The Partial Derivative Operator ∂

Contracts with tensors as ∂[:i], generating the partial derivative across the coordinates indexed by i

# Fields
coordinates::NTuple{N, Num}
    - The coordinates to differentiate with respect to

# Examples
```
julia> @variables u v
julia> x = Tensor([u^2, v])
julia> ∂ = PartialDerivative((u, v))
julia> ∂[:k] * x[:k]
1 + 2u
```
"""
struct PartialDerivative{N}
    coordinates::NTuple{N, Num}
end

"""
The Indexed Partial Derivative Operator

Returned by getindex(∂::PartialDerivative, indices...)

# Fields
partial::PartialDerivative
    - The underlying partial derivative
index::Symbol
    - The index of the coordinate

# Examples
```
julia> @variables u v
julia> ∂ = PartialDerivative((u, v))
julia> ∂[:i]
IndexedPartialDerivative(PartialDerivative{2}((u, v)), :i)
```
"""
struct IndexedPartialDerivative
    partial::PartialDerivative
    index::Symbol
end

"""
The Covariant Derivative Operator ∇

Contracts with tensors as ∇[:i], generating the covariant derivative across the coordinates indexed by i

# Fields
connection::Tensor
    - A (1, 2) tensor containing the connection coefficients
partial::PartialDerivative
    - The partial differentiation operator

# Examples
```
julia> @variables u v
julia> basis = (Tensor([1, 0]), Tensor([0, 1]))
julia> x = Tensor([u^2, v])
julia> Γ = christoffel((u, v), basis)
julia> ∂ = PartialDerivative((u, v))
julia> ∇ = CovariantDerivative(Γ, ∂)
julia> ∇[:k] * x[:k]
1 + 2u
```
"""
struct CovariantDerivative
    connection::Tensor
    partial::PartialDerivative
end

"""
The Indexed Covariant Derivative Operator

Returned by getindex(∇::CovariantDerivative, indices...)

# Fields
covariant::CovariantDerivative
    - The underlying covariant derivative
index::Symbol
    - The index of the coordinate

# Examples
```
julia> @variables u v
julia> basis = (Tensor([1, 0]), Tensor([0, 1]))
julia> Γ = christoffel((u, v), basis)
julia> ∂ = PartialDerivative((u, v))
julia> ∇ = CovariantDerivative(Γ, ∂)
julia> ∇[:k]
IndexedCovariantDerivative(CovariantDerivative(Tensor{Num, 3}..., PartialDerivative{2}...), :k)
```
"""
struct IndexedCovariantDerivative
    covariant::CovariantDerivative
    index::Symbol
end

"""
The Exterior Derivative Operator d

Contracts with tensors as d[:i], generating the exterior derivative across the coordinates indexed by i

# Fields
partial::PartialDerivative
    - The partial differentiation operator

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
struct ExteriorDerivative
    partial::PartialDerivative
end

"""
The Indexed Exterior Derivative Operator

Returned by getindex(d::ExteriorDerivative, indices...)

# Fields
exterior::ExteriorDerivative
    - The underlying exterior derivative
index::Symbol
    - The index of the coordinate

# Examples
```
julia> @variables x y z
julia> ∂ = PartialDerivative((x, y, z))
julia> d = ExteriorDerivative(∂)
julia> d[:k]
IndexedExteriorDerivative(ExteriorDerivative(PartialDerivative{3}((x, y, z))), :k)
```
"""
struct IndexedExteriorDerivative
    exterior::ExteriorDerivative
    index::Symbol
end

"""
The Hodge Star Operator

# Fields
metric::Tensor
    - The metric tensor

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
struct HodgeStar
    metric::Tensor
end

"""
A Tensor Basis


# Fields
elements::Array
    - The basis tensors
variance::Tuple
    - The variance of the tensors

# Examples
```
julia> e = Basis([Tensor([1, 0]), Tensor([0, 1])])
```
"""
struct Basis
    elements::Array
    variance::Tuple
end

"""
An Indexed Tensor Basis

Returned by getindex(e::Basis, indices...)

# Fields
basis::Basis
    - The underlying basis
indices::Tuple
    - The symbolic indices

# Examples
```
julia> e = Basis([Tensor([1, 0]), Tensor([0, 1])])
julia> e[:i]
```
"""
struct IndexedBasis
    basis::Basis
    indices::Tuple
end