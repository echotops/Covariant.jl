"""
Computes the tensor product of two tensors

Given an (m, n) tensor A and a (p, q) tensor B, returns an (m + p, n + q) tensor

# Examples
A vector times a covector, returning a linear map
```
julia> v = Tensor([1, 2]); w = Tensor([3, 5]')
julia> v ⊗ w
Tensor{Int64, 2}([3 5; 6 10], (:contra, :co))
```
A covector and vector times a linear map, returning a (2, 2) tensor
```
julia> L = Tensor([[4, -1]', [2, -3]'])
julia> L ⊗ w ⊗ v
Tensor{Int64, 4}([12 -3; 6 -9;;; 20 -5; 10 -15;;;; 24 -6; 12 -18;;; 40 -10; 20 -30], (:contra, :co, :co, :contra))
```
"""
function ⊗(A::Tensor, B::Tensor)
    a = A.data
    b = B.data
    data = [a[i] * b[j] for j in eachindex(b) for i in eachindex(a)]
    return Tensor(reshape(data, size(a)..., size(b)...), (A.variance..., B.variance...))
end

"""
Computes the wedge product of two differential forms

Given a (0, p) tensor A and a (0, q) tensor B, returns a (0, p + q) tensor

# Examples
Two one-forms combined using the wedge product
```
julia> α = Tensor([1, -3, 2]'); β = Tensor([2, -3, 1]')
julia> α ∧ Β
Tensor{Float64, 3}([0.0 3.0 -3.0; -3.0 0.0 3.0; 3.0 -3.0 0.0], (:co, :co))
```
"""
function ∧(A::Tensor, B::Tensor)
    if !(all(x -> x == :co, A.variance) && all(x -> x == :co, B.variance))
        error("Both A and B must be differential forms")
    end
    if !(length(unique((size(A.data)..., size(B.data)...))) == 1)
        error("A and B must have the same dimension")
    end
    p = length(A.variance)
    q = length(B.variance)
    C = A ⊗ B
    indices = [Symbol("dummy_$i") for i in eachindex(C.variance)]
    scalar = factorial(p + q) / (factorial(p) * factorial(q))
    D = antisymmetrize(C[indices...], indices...)
    return (scalar * D[indices...]).tensor
end

"""
Computes the tensor product of two bases

Given an (m, n) basis e and a (p, q) basis f, returns an (m + p, n + q) basis by taking the tensor
product of every pair of basis tensors

# Examples
```
julia> e = Basis([Tensor([1, 0]), Tensor([0, 1])])
julia> ϵ = Basis([Tensor([1, 0]'), Tensor([0, 1]')])
julia> e ⊗ ϵ
```
"""
function ⊗(e::Basis, f::Basis)
    ei = e.elements
    fi = f.elements
    eij = [ei[i] ⊗ fi[j] for i in eachindex(ei) for j in eachindex(fi)]
    return Basis(eij, (e.variance..., f.variance...))
end

"""
Computes the sum of two tensors

Given an (m, n) tensor A and a (m, n) tensor B with matching indices, returns an (m, n) tensor.

# Examples
```
julia> A = Tensor([[1, 2]', [3, -1]']); B = Tensor([[5, -2]', [1, 1]'])
julia> A[:i][:j] + B[:i][:j]
IndexedTensor{Int64, 2, 1, 1}(Tensor{Int64, 2}([6 0; 4 0], (:contra, :co)), (:i,), (:j,))
```
"""
function Base.:+(A::IndexedTensor, B::IndexedTensor)
    if Set(A.contravariant) != Set(B.contravariant)
        error("Contravariant indices must match")
    elseif Set(A.covariant) != Set(B.covariant)
        error("Covariant indices must match")
    end
    permutation_map = zeros(length(A.contravariant) + length(A.covariant))
    for A_index in eachindex(A.contravariant)
        B_index = findfirst(x -> x == A.contravariant[A_index], B.contravariant)
        A_idx = find_nth(A_index, A.tensor.variance, :contra)
        B_idx = find_nth(B_index, B.tensor.variance, :contra)
        permutation_map[A_idx] = B_idx
    end
    for A_index in eachindex(A.covariant)
        B_index = findfirst(x -> x == A.covariant[A_index], B.covariant)
        A_idx = find_nth(A_index, A.tensor.variance, :co)
        B_idx = find_nth(B_index, B.tensor.variance, :co)
        permutation_map[A_idx] = B_idx
    end
    C = permutedims(B.tensor.data, Tuple(Int.(permutation_map)))
    return IndexedTensor(Tensor(A.tensor.data .+ C, A.tensor.variance), A.contravariant, A.covariant)
end

"""
Computes the difference of two tensors

Given an (m, n) tensor A and a (m, n) tensor B with matching indices, returns an (m, n) tensor

# Examples
```
julia> A = Tensor([[1, 2]', [3, -1]']); B = Tensor([[5, -2]', [1, 1]'])
julia> A[:i][:j] - B[:i][:j]
IndexedTensor{Int64, 2, 1, 1}(Tensor{Int64, 2}([-4 4; 2 -2], (:contra, :co)), (:i,), (:j,))
```
"""
function Base.:-(A::IndexedTensor, B::IndexedTensor)
    return A + (-1 * B)
end

"""
Computes the contraction of two tensors A and B along the specified indices.

If no indices match, return the tensor product of A and B

# Examples
A covector acting on a vector, returning a scalar
```
julia> v = Tensor([1, 2]); w = Tensor([3, 5]')
julia> v[:i] * w[:i]
13.0
```
A linear map acting on a vector, returning a vector
```
julia> L = Tensor([[4, -1]', [2, -3]'])
julia> L[:i][:j] * v[:j]
Tensor{Float64, 1}([2.0, -4.0], (:contra,))
```
"""
function Base.:*(A::IndexedTensor, B::IndexedTensor)
    # Simple error checking to avoid repeated indices
    if !isempty(intersect(A.contravariant, B.contravariant))
        error("Repeated contravariant indices")
    elseif !isempty(intersect(A.covariant, B.covariant))
        error("Repeated covariant indices")
    end
    # Find pairs of matching contravariant and covariant indices across A and B (indices to be contracted over)
    pairs = find_pairs(A, B)
    # Find the free indicies (those without pairs, not to be contracted over)
    all_indices = union(A.contravariant, A.covariant, B.contravariant, B.covariant)
    contra_contractions = intersect(A.contravariant, B.covariant)
    co_contractions = intersect(A.covariant, B.contravariant)
    free_indices = setdiff(all_indices, union(contra_contractions, co_contractions))
    # Iteration ranges for the contracted indices
    ranges = []
    for (a_idx, b_idx) in pairs
        if size(A.tensor.data, a_idx) != size(B.tensor.data, b_idx)
            error("Dimensions not the same size")
        end
        push!(ranges, 1:size(A.tensor.data, a_idx))
    end
    # Record information about each free index (what tensor it belongs to, its position in that
    # tensor's data array, its dimension, and its variance)
    free_indices_info = []
    for free_index in free_indices
        if (free_index in A.contravariant)
            A_index = find_index(free_index, A, :contra)
            info = (tensor=:A, index=A_index, dimension=size(A.tensor.data, A_index), variance=:contra)
            push!(free_indices_info, info)
        elseif (free_index in A.covariant)
            A_index = find_index(free_index, A, :co)
            info = (tensor=:A, index=A_index, dimension=size(A.tensor.data, A_index), variance=:co)
            push!(free_indices_info, info)
        elseif (free_index in B.contravariant)
            B_index = find_index(free_index, B, :contra)
            info = (tensor=:B, index=B_index, dimension=size(B.tensor.data, B_index), variance=:contra)
            push!(free_indices_info, info)
        else
            B_index = find_index(free_index, B, :co)
            info = (tensor=:B, index=B_index, dimension=size(B.tensor.data, B_index), variance=:co)
            push!(free_indices_info, info)
        end
    end
    free_ranges = [1:info.dimension for info in free_indices_info]
    # Promote element types across both tensors to ensure mixed arithmetic (e.g. Int64 * Num) doesn't throw type errors
    T = promote_type(eltype(A.tensor.data), eltype(B.tensor.data))
    result = zeros(T, [info.dimension for info in free_indices_info]...)
    # Iterate over all combinations of free index values
    for free_index in Iterators.product(free_ranges...)
        # Sum over all combinations of contracted index values
        for index in Iterators.product(ranges...)
            A_idx = Any[0 for _ in 1:ndims(A.tensor.data)]
            B_idx = Any[0 for _ in 1:ndims(B.tensor.data)]
            # Fill in the free index values for each tensor's index array
            for (value, info) in zip(free_index, free_indices_info)
                if info.tensor == :A
                    A_idx[info.index] = value
                else
                    B_idx[info.index] = value
                end
            end
            # Fill in the contracted index values (same value in both tensors, since they're summed together)
            for (value, location) in zip(index, pairs)
                A_idx[location[1]] = value
                B_idx[location[2]] = value
            end
            result[free_index...] += A.tensor.data[A_idx...] .* B.tensor.data[B_idx...]
        end
    end
    leftover_contra_indices = []
    leftover_co_indices = []
    for (index, info) in zip(free_indices, free_indices_info)
        if info.variance == :contra
            push!(leftover_contra_indices, index)
        else
            push!(leftover_co_indices, index)
        end
    end
    # If all indices are free, return the tensor product
    if isempty(pairs)
        return IndexedTensor(A.tensor ⊗ B.tensor, Tuple(leftover_contra_indices), Tuple(leftover_co_indices))
    end
    # If it's a scalar, return as a scalar
    if isempty(free_indices)
        return result[]
    end
    return IndexedTensor(Tensor(result, Tuple([info.variance for info in free_indices_info])), Tuple(leftover_contra_indices), Tuple(leftover_co_indices))
end

"""
Scales every element of a tensor A by number s.

# Examples
```
julia> A = Tensor([[1, 2]', [3, -1]'])
julia> 2 * A[:i][:j]
IndexedTensor{Int64, 2, 1, 1}(Tensor{Int64, 2}([2 4; 6 -2], (:contra, :co)), (:i,), (:j,))
```
"""
function Base.:*(A::IndexedTensor, s::Number)
    scaled = A.tensor.data .* s
    return IndexedTensor(Tensor(scaled, A.tensor.variance), A.contravariant, A.covariant)
end


function Base.:*(s::Number, A::IndexedTensor)
    return A * s
end

"""
Divides every element of a tensor A by number s.

# Examples
```
julia> A = Tensor([[1, 2]', [3, -1]'])
julia> A[:i][:j] / 2
IndexedTensor{Float64, 2, 1, 1}(Tensor{Float64, 2}([0.5 1.0; 1.5 -0.5], (:contra, :co)), (:i,), (:j,))
```
"""
function Base.:/(A::IndexedTensor, s::Number)
    return (1/s) * A
end

"""
Computes the contraction of a tensor and the Kronecker Delta

# Examples
```
julia> A = Tensor([[1, 2]', [3, -1]'])
julia> δ = KroneckerDelta()
julia> A[:i][:j] * δ[:j, :k]
IndexedTensor{Int64, 2, 1, 1}(Tensor{Int64, 2}([1 2; 3 -1], (:contra, :co)), (:i,), (:k,))
julia> A[:i][:j] * δ[:j, :i]
0
```
"""
function Base.:*(A::IndexedTensor, δ::IndexedKroneckerDelta)
    pairs = find_pairs(A, δ)
    if isempty(pairs)
        error("Delta has no common indices")
    end
    (index, symbol, variance) = pairs[1]
    dim = size(A.tensor.data, index)
    δTensor = Tensor(Matrix(I, dim, dim), (:contra, :co))
    if symbol == δ.indices[1]
        δIndexedTensor = variance == :co ? δTensor[symbol][δ.indices[2]] : δTensor[δ.indices[2]][symbol]
    else
        δIndexedTensor = variance == :co ? δTensor[symbol][δ.indices[1]] : δTensor[δ.indices[1]][symbol]
    end
    return A * δIndexedTensor
end

function Base.:*(δ::IndexedKroneckerDelta, A::IndexedTensor)
    return A * δ
end

"""
Computes the contraction of a tensor and the Levi-Civita Symbol

# Examples
```
julia> v = Tensor([1, 2]); u = Tensor([-2, 1])
julia> ε = LeviCivita()
julia> v[:i] * u[:j] * ε[:i, :j]
5
```
"""
function Base.:*(A::IndexedTensor, ε::IndexedLeviCivita)
    pairs = find_pairs(A, ε)
    if isempty(pairs)
        error("Levi Civita has no common indices")
    end
    free_indices = setdiff(ε.indices, map(x -> x[3], pairs))
    dims = map(x -> size(A.tensor.data, x[1]), pairs)
    if !all(dim -> dim == dims[1], dims)
        error("Levi Civita has non-constant dimension")
    end
    append!(dims, [dims[1] for _ in free_indices])
    B = zeros(Int, dims...)
    n = max(dims[1], length(dims))
    id = Matrix(I, n, n)
    for indices in Iterators.product(ntuple(_ -> 1:dims[1], length(dims))...)
        B[collect(indices)...] = round(Int, sign(det(id[collect(indices), 1:length(dims)])))
    end
    εTensor = Tensor(B, Tuple([pairs[1][4] == :contra ? :co : :contra for _ in dims]))
    if pairs[1][4] == :contra
        εIndexedTensor = IndexedTensor(εTensor, (), ε.indices)
    else
        εIndexedTensor = IndexedTensor(εTensor, ε.indices, ())
    end
    return A * εIndexedTensor
end

function Base.:*(ε::IndexedLeviCivita, A::IndexedTensor)
    return A * ε
end

"""
Computes the contraction of a tensor A with a basis e

Returns a linear combination of the basis tensors in e using the entries of A as weights

# Examples
A vector expressed as a linear combination of basis vectors
```
julia> e = Basis([Tensor([1, 0]), Tensor([0, 1])])
julia> v = Tensor([2, 5])
julia> v[:i] * e[:i]
```
A (1, 1)-tensor expressed as a linear combination of basis (1, 1)-tensors
```
julia> ϵ = Basis([Tensor([1, 0]'), Tensor([0, 1]')])
julia> L = e ⊗ ϵ
julia> M = Tensor([[2, -3]', [4, -1]'])
julia> M[:i][:j] * L[:i, :j]
```
"""
function Base.:*(A::IndexedTensor, e::IndexedBasis)
    if A.tensor.variance != e.basis.variance
        error("Basis must have the same variance")
    end
    if Set(e.indices) != Set(union(A.contravariant, A.covariant))
        error("Free indices not allowed")
    end
    if isempty(A.contravariant)
        T = sum([A.tensor.data[i] * e.basis.elements[i][A.covariant...] for i in eachindex(e.basis.elements)])
    elseif isempty(A.covariant)
        T = sum([A.tensor.data[i] * e.basis.elements[i][A.contravariant...] for i in eachindex(e.basis.elements)])
    else
        T = sum([A.tensor.data[i] * e.basis.elements[i][A.contravariant...][A.covariant...] for i in eachindex(e.basis.elements)])
    end
    return T.tensor
end

function Base.:*(e::IndexedBasis, A::IndexedTensor)
    return A * e
end

"""
Define the standard inner product on two (1, 0) tensors.

# Examples
```
julia> v = Tensor([1, 2]); w = Tensor([3, -1])
Tensor{Int64, 1}([3, -1], (:contra,))
julia> v[:i] ⋅ w[:i]
1
```
"""
function LinearAlgebra.:⋅(A::Tensor, B::Tensor)
    if A.variance != (:contra,) || B.variance != (:contra,)
        error("A and B must both be (1, 0) tensors")
    end
    return sum([A.data[i] * B.data[i] for i in eachindex(A.data)])
end

"""
Symmetrizes a tensor A across the specified indices

# Examples
```
julia> A = Tensor([[1, 3], [-2, 5]])
julia> symmetrize(A[:i, :j], :i, :j)
Tensor{Float64, 2}([1.0 0.5; 0.5 5.0], (:co, :co))
```
"""
function symmetrize(A::IndexedTensor, indices...)
    if !all(x -> x in union(A.contravariant, A.covariant), indices)
        error("Some indices not found")
    end
    if length(indices) < 2
        error("Need at least 2 indices")
    end
    variance = indices[1] in A.contravariant ? :contra : :co
    for index in indices
        index_variance = index in A.contravariant ? :contra : :co
        if index_variance != variance
            error("Indices not all the same variance")
        end
    end
    if variance == :contra
        return make_symmetric(A, indices, :contra).tensor
    end
    return make_symmetric(A, indices, :co).tensor
end

"""
Antisymmetrizes a tensor A across the specified indices

# Examples
```
julia> A = Tensor([[1, 3], [-2, 5]])
julia> antisymmetrize(A[:i, :j], :i, :j)
Tensor{Float64, 2}([0.0 2.5; -2.5 0.0], (:co, :co))
```
"""
function antisymmetrize(A::IndexedTensor, indices...)
    if !all(x -> x in union(A.contravariant, A.covariant), indices)
        error("Some indices not found")
    end
    if length(indices) < 2
        error("Need at least 2 indices")
    end
    variance = indices[1] in A.contravariant ? :contra : :co
    for index in indices
        index_variance = index in A.contravariant ? :contra : :co
        if index_variance != variance
            error("Indices not all the same variance")
        end
    end
    if variance == :contra
        return make_symmetric(A, indices, :contra, true).tensor
    end
    return make_symmetric(A, indices, :co, true).tensor
end

"""
Given a basis, return the dual basis

# Examples
Finding a covector basis
```
julia> e = Basis([
           Tensor([1, 2]),
           Tensor([0, 1])
       ])
julia> dual_basis(e)
Basis(Tensor{Float64, 1}[...], (:co,))
```
Finding a vector basis
```
julia> ε = Basis([
           Tensor([-3, 2]),
           Tensor([1, 1])
       ])
julia> dual_basis(ε)
Basis(Tensor{Float64, 1}[...], (:contra,))
```
"""
function dual_basis(basis)
    if length(basis.variance) != 1
        error("Basis must be either a vector or covector basis")
    end
    E = transpose(hcat([e.data for e in basis.elements]...))
    E_inv = inv(E)
    if (basis.variance == (:contra,))
        dual_elements = [Tensor([col...]') for col in eachcol(E_inv)]
    else
        dual_elements = [Tensor([col...]) for col in eachcol(E_inv)]
    end
    return Basis(dual_elements)
end