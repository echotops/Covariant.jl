"""
Internal. Pretty printing for Tensors
"""
function Base.show(io::IO, A::Tensor)
    m = count(x -> x == :contra, A.variance)
    n = count(x -> x == :co, A.variance)
    println(io, "($m, $n)-Tensor:")
    show(io, A.data)
    println(io, "\n  $(A.variance)")
end

"""
Internal. Pretty printing for IndexedTensors
"""
function Base.show(io::IO, A::IndexedTensor)
    show(io, A.tensor)
    println(io, "  $(A.contravariant), $(A.covariant)")
end

"""
Wrapper to create rank R (m, n)-tensors with nested vectors and adjoints.

Each vector corresponds to a contravariant index, and each adjoint corresponds to a covariant index.

# Examples
A vector, (1, 0) tensor
```
julia> Tensor([1, 3])
Tensor{Int64, 1}([1, 3], (:contra,))
```
A covector, (0, 1) tensor
```
julia> Tensor([2, -5]')
Tensor{Int64, 1}([2, -5], (:co,))
```
The 90° rotation map, (1, 1) tensor
```
julia> Tensor([[0, -1]', [1, 0]'])
Tensor{Int64, 2}([0 -1; 1 0], (:contra, :co))
```
The identity metric, (0, 2) tensor
```
julia> Tensor([[1, 0]', [0, 1]']')
Tensor{Int64, 2}([1 0; 0 1], (:co, :co))
```
"""
function Tensor(data)
    variance = get_variance(data, [])
    cleaned_data = clean_data(data)
    permuted_data = permutedims(cleaned_data, Tuple([i for i in length(variance):-1:1]))
    return Tensor(permuted_data, Tuple(variance))
end

"""
Wrapper to create a tensor basis

# Examples
```
julia> e = Basis([Tensor([1, 0]), Tensor([0, 1])])
```
"""
function Basis(elements)
    variance = elements[1].variance
    if !all(T -> T.variance == variance, elements)
        error("Basis elements must have the same variance")
    end
    return Basis(elements, variance)
end

"""
Internal. Collects nested vectors and adjoints into an array.
"""
function clean_data(data)
    if isa(data, Adjoint)
        return clean_data(parent(data))
    elseif isa(data, Vector)
        return stack([clean_data(data[i]) for i in eachindex(data)])
    else
        return data
    end
end

"""
Internal. Compiles nested vectors and adjoints into variances, interpreting vectors as
contravariant and adjoints as covariant.
"""
function get_variance(data, variance)
    if isa(data, Adjoint)
        push!(variance, :co)
        return get_variance(parent(data)[1], variance)
    elseif isa(data, Vector)
        push!(variance, :contra)
        return get_variance(data[1], variance)
    else
        return variance
    end
end