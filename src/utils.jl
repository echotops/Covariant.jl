"""
Internal. Contracts a tensor A along duplicate indices by contracting with the Kronecker Delta δ
"""
function self_contract(A::IndexedTensor, duplicates)
    pairs = []
    B_covariant = collect(A.covariant)
    for i in eachindex(duplicates)
        index = duplicates[i]
        dummy_index = Symbol("dummy_$i")
        co_index = findfirst(x -> x == index, A.covariant)
        B_covariant[co_index] = dummy_index
        push!(pairs, (index, dummy_index))
    end
    B = IndexedTensor(A.tensor, A.contravariant, Tuple(B_covariant))
    δ = KroneckerDelta()
    for (index, dummy_index) in pairs
        B = B * δ[index, dummy_index]
    end
    return B
end

"""
Internal. Converts a contra- or covariant symbolic index to its index in a tensor's data array,
"""
function find_index(symbolic_index, A::IndexedTensor, variance)
    search_space = variance == :contra ? A.contravariant : A.covariant
    space_index = findfirst(x -> x == symbolic_index, search_space)
    return find_nth(space_index, A.tensor.variance, variance)
end

"""
Internal. Converts a contra- or covariant symbolic index to its index in a tensor's data array,
"""
function find_nth(n, list, key)
    key_list = filter(x -> x[2] == key, collect(enumerate(list)))
    return key_list[n][1]
end

"""
Internal. Finds symbolic pairs in the contravariant and covariant indices of two tensors A and B.
Returns matching indices in the data arrays of A and B.
"""
function find_pairs(A::IndexedTensor, B::IndexedTensor)
    pairs = []
    for index in intersect(A.contravariant, B.covariant)
        A_index = find_index(index, A, :contra)
        B_index = find_index(index, B, :co)
        push!(pairs, (A_index, B_index))
    end
    for index in intersect(A.covariant, B.contravariant)
        A_index = find_index(index, A, :co)
        B_index = find_index(index, B, :contra)
        push!(pairs, (A_index, B_index))
    end
    return pairs
end

"""
Internal. Finds symbolic pairs in the contravariant and covariant indices a tensor A and the
Kronecker Delta δ. Returns matching indices in the data arrays of A and δ, including the variance
of the index.
"""
function find_pairs(A::IndexedTensor, δ::IndexedKroneckerDelta)
    pairs = []
    for index in intersect(A.contravariant, δ.indices)
        A_index = find_index(index, A, :contra)
        push!(pairs, (A_index, index, :contra))
    end
    for index in intersect(A.covariant, δ.indices)
        A_index = find_index(index, A, :co)
        push!(pairs, (A_index, index, :co))
    end
    return pairs
end

"""
Internal. Finds symbolic pairs in the contravariant and covariant indices a tensor A and the
Levi-Civita Symbol ε. Returns matching indices in the data arrays of A and ε, including the 
symbolic index and the variance of the index.
"""
function find_pairs(A::IndexedTensor, ε::IndexedLeviCivita)
    pairs = []
    for index in intersect(A.contravariant, ε.indices)
        A_index = find_index(index, A, :contra)
        ε_index = findfirst(x -> x == index, ε.indices)
        push!(pairs, (A_index, ε_index, index, :contra))
    end
    for index in intersect(A.covariant, ε.indices)
        A_index = find_index(index, A, :co)
        ε_index = findfirst(x -> x == index, ε.indices)
        push!(pairs, (A_index, ε_index, index, :co))
    end
    return pairs
end

"""
Internal. Helper method for symmetric and antisymmetric functions
"""
function make_symmetric(A::IndexedTensor, indices, variance, anti=false)
    id = Matrix(I, length(indices), length(indices))
    symbols = collect(variance == :contra ? A.contravariant : A.covariant)
    # Positions of the indices to symmetrize within the full symbol list
    variables = findall(x -> x in indices, symbols)
    swaps = []
    for perm in permutations(indices)
        for (index, symbol) in zip(variables, perm)
            symbols[index] = symbol
        end
        perm_indices = map(i -> findfirst(x -> x == i, collect(indices)), perm)
        # Sign of the permutation (+1 for even, -1 for odd) if antisymmetrizing, 1 otherwise
        k = anti ? Int(sign(det(id[perm_indices, :]))) : 1
        if variance == :contra
            if isempty(A.covariant)
                push!(swaps, k * A.tensor[symbols...])
            else
                push!(swaps, k * A.tensor[symbols...][A.covariant...])
            end
        else
            if isempty(A.contravariant)
                push!(swaps, k * A.tensor[symbols...])
            else
                push!(swaps, k * A.tensor[A.contravariant...][symbols...])
            end
        end
    end
    return (1 // length(swaps)) * sum(swaps)
end

"""
Internal. Converts an array of Rational numbers to integers when every entry is whole, so exact results that
are whole numbers stay integers. Other arrays are returned unchanged.
"""
tidy(data::AbstractArray{<:Rational}) = all(x -> isone(denominator(x)), data) ? Int.(data) : data
tidy(data) = data
tidy(x::Rational) = isone(denominator(x)) ? numerator(x) : x
function tidy(x::Num)
    v = Symbolics.value(x)
    return v isa Rational && isone(denominator(v)) ? Num(numerator(v)) : x
end
tidy(data::AbstractArray{Num}) = tidy.(data)
tidy(A::Tensor) = Tensor(tidy(A.data), A.variance)

"""
Internal. The determinant of a square array, exact for integer entries
"""
exact_det(data) = eltype(data) <: Integer ? first(tidy(fill(det(Rational.(data)), 1))) : det(data)

"""
Internal. The inverse of a square array, exact for integer entries, and symbolic when the entries are
not all one concrete number type
"""
function exact_inv(data)
    T = eltype(data)
    if T <: Integer
        return tidy(inv(Rational.(data)))
    elseif isconcretetype(T) && (T <: AbstractFloat || T <: Rational)
        return inv(data)
    end
    return inv(Matrix{Num}(data))
end

"""
Internal. The square root, exact when the argument is a perfect square integer
"""
function exact_sqrt(x::Integer)
    r = isqrt(abs(x))
    return r * r == abs(x) ? r : sqrt(abs(x))
end
exact_sqrt(x) = sqrt(x)

