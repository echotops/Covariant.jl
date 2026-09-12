"""
Index a tensor with either integer or symbolic indices.

Evaluate integer indices, and returns an IndexedTensor or PartialIndexedTensor for use in Einstein summation via *.

# Arguments
A::Tensor
    - The tensor to index

indices...
    - Either integer or symbolic indices corresponding to the contravariant indices

# Examples
```
julia> L = Tensor([[1, 2]', [3, 4]'])
julia> L[1][2]
2
julia> L[:i][:j]
IndexedTensor{Int64, 2, 1, 1}(Tensor{Int64, 2}..., (:i,), (:j,))
```
"""
function Base.getindex(A::Tensor, indices...)
    m = count(x -> x == :contra, A.variance)
    n = count(x -> x == :co, A.variance)
    # Pure covariant tensors are indexed entirely by their covariant indices,
    # so the general mixed-tensor path (which expects contravariant indices first) doesn't apply
    if m == 0
        if length(indices) != n
            error("Incorrect number of indices provided")
        end
        slicing = Any[Colon() for _ in A.variance]
        for i in eachindex(indices)
            index = indices[i]
            data_index = find_nth(i, A.variance, :co)
            if !(index isa Symbol)
                slicing[data_index] = index
            end
        end
        new_variance = [A.variance[i] for i in eachindex(slicing) if slicing[i] == Colon()]
        symbols = filter(x -> x isa Symbol, indices)
        # Scalar case (no symbolic indices)
        if isempty(new_variance)
            return A.data[slicing...]
        end
        return IndexedTensor(Tensor(A.data[slicing...], Tuple(new_variance)), (), symbols)
    end
    if length(indices) != m
        error("Incorrect number of indices provided")
    end
    slicing = Any[Colon() for _ in A.variance]
    for i in eachindex(indices)
        index = indices[i]
        data_index = find_nth(i, A.variance, :contra)
        if !(index isa Symbol)
            slicing[data_index] = index
        end
    end
    new_variance = [A.variance[i] for i in eachindex(slicing) if slicing[i] == Colon()]
    symbols = filter(x -> x isa Symbol, indices)
    # Scalar case (no symbolic indices)
    if isempty(new_variance)
        return A.data[slicing...]
    end
    # Pure contravariant tensors are indexed entirely by their contravariant indices
    if n == 0
        return IndexedTensor(Tensor(A.data[slicing...], Tuple(new_variance)), symbols, ())
    end
    # Mixed tensors defer covariant indexing to a second bracket
    return PartialIndexedTensor(Tensor(A.data[slicing...], Tuple(new_variance)), symbols)
end

"""
Internal. Completes the covariant half of two-bracket symbolic indexing on a Tensor, returning a fully labeled IndexedTensor.

If any index appears as both contravariant and covariant, contract over that index.
"""
function Base.getindex(A::PartialIndexedTensor, indices...)
    n = count(x -> x == :co, A.tensor.variance)
    if length(indices) != n
        error("Incorrect number of indices provided")
    end
    slicing = Any[Colon() for _ in A.tensor.variance]
    for i in eachindex(indices)
        index = indices[i]
        data_index = find_nth(i, A.tensor.variance, :co)
        if !(index isa Symbol)
            slicing[data_index] = index
        end
    end
    new_variance = [A.tensor.variance[i] for i in eachindex(slicing) if slicing[i] == Colon()]
    symbols = filter(x -> x isa Symbol, indices)
    if isempty(new_variance)
        return A.tensor.data[slicing...]
    end
    B = IndexedTensor(Tensor(A.tensor.data[slicing...], Tuple(new_variance)), A.contravariant, symbols)
    duplicates = intersect(B.contravariant, B.covariant)
    if isempty(duplicates)
        return B
    end
    return self_contract(B, duplicates)
end

"""
Index a Kronecker Delta with either integer or symbolic indices.
If given integer indices, returns the Kronecker Delta evaluated on those indices.
If given symbolic indices, returns an IndexedKroneckerDelta for use in Einstein summation via *.

# Arguments
δ::KroneckerDelta
    - The Kronecker Delta to index

indices...
    - Either integer or symbolic indices
"""
function Base.getindex(δ::KroneckerDelta, indices...)
    if all(isa.(indices, Symbol))
        return IndexedKroneckerDelta((indices[1], indices[2]))
    end
    return indices[1] == indices[2] ? 1 : 0
end

"""
Index a Levi-Civita Symbol with either integer or symbolic indices.
If given integer indices, returns the Levi-Civita Symbol evaluated on those indices.
If given symbolic indices, returns an IndexedLeviCivita for use in Einstein summation via *.

# Arguments
ε::LeviCivita
    - The Levi-Civita Symbol to index

indices...
    - Either integer or symbolic indices
"""
function Base.getindex(ε::LeviCivita, indices...)
    if all(isa.(indices, Symbol))
        return IndexedLeviCivita((indices))
    end
    id = Matrix(I, length(indices), length(indices))
    return sign(det(id[collect(indices), :]))
end

"""
Index a Partial Derivative Operator with symbolic indices.

Returns an IndexedPartialDerivative for use in Einstein summation via *.

# Arguments
∂::PartialDerivative
    - The Partial Derivative Operator to index

indices...
    - The symbolic index
"""
function Base.getindex(∂::PartialDerivative, indices...)
    if all(isa.(indices, Symbol))
        return IndexedPartialDerivative(∂, indices[1])
    end
    return nothing
end

"""
Index a Covariant Derivative Operator with symbolic indices.

Returns an IndexedCovariantDerivative for use in Einstein summation via *.

# Arguments
∇::CovariantDerivative
    - The Covariant Derivative Operator to index

indices...
    - The symbolic index
"""
function Base.getindex(∇::CovariantDerivative, indices...)
    if all(isa.(indices, Symbol))
        return IndexedCovariantDerivative(∇, indices[1])
    end
    return nothing
end

"""
Index an Exterior Derivative Operator with symbolic indices.

Returns an IndexedExteriorDerivative for use in Einstein summation via *.

# Arguments
d::ExteriorDerivative
    - The Exterior Derivative Operator to index

indices...
    - The symbolic index
"""
function Base.getindex(d::ExteriorDerivative, indices...)
    if all(isa.(indices, Symbol))
        return IndexedExteriorDerivative(d, indices[1])
    end
    return nothing
end

"""
Index a Basis with either integer or symbolic indices.
If given integer indices, returns the basis tensor associated with those indices.
If given symbolic indices, returns an IndexedBasis for use in Einstein summation via *.

# Arguments
e::Basis
    - The Basis to index

indices...
    - The integer or symbolic indices

# Examples
```
julia> e = Basis([Tensor([1, 0]), Tensor([0, 1])])
julia> e[:i]
julia> e[2]
```
"""
function Base.getindex(e::Basis, indices...)
    if all(isa.(indices, Symbol))
        return IndexedBasis(e, Tuple(indices))
    end
    return e.elements[indices...]
end