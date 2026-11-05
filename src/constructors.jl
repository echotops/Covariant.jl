"""
Internal. The labels of an indexed tensor in abstract index notation, like T^ijk_xyz

Single-letter labels are written together, and longer ones are separated by commas in braces.
"""
function index_labels(contravariant, covariant)
    function group(labels)
        names = string.(labels)
        all(length.(names) .== 1) ? join(names) : "{" * join(names, ",") * "}"
    end
    out = isempty(contravariant) ? "" : "^" * group(contravariant)
    return out * (isempty(covariant) ? "" : "_" * group(covariant))
end

"""
Internal. Pretty printing for Tensors
"""
function Base.show(io::IO, A::Tensor)
    m = count(x -> x == :contra, A.variance)
    n = count(x -> x == :co, A.variance)
    println(io, "($m, $n)-Tensor")
    show(io, A.data)
end

"""
Internal. Pretty printing for IndexedTensors, with the type and then T named with its index labels
"""
function Base.show(io::IO, A::IndexedTensor)
    m = count(x -> x == :contra, A.tensor.variance)
    n = count(x -> x == :co, A.tensor.variance)
    println(io, "($m, $n)-Tensor T", index_labels(A.contravariant, A.covariant))
    show(io, A.tensor.data)
end

"""
Internal. Pretty printing for Bases
"""
function Base.show(io::IO, e::Basis)
    m = count(x -> x == :contra, e.variance)
    n = count(x -> x == :co, e.variance)
    print(io, "($m, $n)-Basis")
    for element in e.elements
        print(io, "\n")
        show(io, element.data)
    end
end

"""
Create a rank R (m, n)-tensor from an array and the variance of each of its indices

The variance is given as one `:contra` or `:co` for each index, in order. Three shortcuts leave it out:
a vector is a (1, 0)-tensor, an adjoint vector is a (0, 1)-tensor, and a matrix is a (1, 1)-tensor. Any
other array needs its variance stated.

# Examples
A vector, (1, 0) tensor
```
julia> Tensor([1, 3])
(1, 0)-Tensor
[1, 3]
```
A covector, (0, 1) tensor
```
julia> Tensor([2, -5]')
(0, 1)-Tensor
[2, -5]
```
The 90° rotation map, (1, 1) tensor
```
julia> Tensor([0 -1; 1 0])
(1, 1)-Tensor
[0 -1; 1 0]
```
The identity metric, (0, 2) tensor
```
julia> Tensor([1 0; 0 1], :co, :co)
(0, 2)-Tensor
[1 0; 0 1]
```
"""
function Tensor(data::AbstractArray, variance::Symbol...)
    if eltype(data) <: AbstractArray
        error("Tensors are no longer built from nested vectors and adjoints. Use an array and its variance, like Tensor([1 2; 3 4], :contra, :co)")
    end
    if isempty(variance)
        variance = default_variance(data)
    end
    if length(variance) != ndims(data)
        error("A rank $(ndims(data)) array needs $(ndims(data)) variances, but $(length(variance)) were given")
    end
    for v in variance
        if !(v in (:contra, :co))
            error("Variance must be :contra or :co, not $(repr(v))")
        end
    end
    return Tensor(Array(data), variance)
end

function Tensor(data::Adjoint{<:Any, <:AbstractVector})
    return Tensor(collect(parent(data)), (:co,))
end

"""
Internal. The variance of an array given without one: a vector is contravariant and a matrix is (1, 1)
"""
function default_variance(data)
    if ndims(data) == 1
        return (:contra,)
    elseif ndims(data) == 2
        return (:contra, :co)
    end
    error("Specify the variance of a rank $(ndims(data)) tensor, for example Tensor(data, " *
        join([":contra" for _ in 1:ndims(data)], ", ") * ")")
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
        error("Basis elements must have the same variance, but found $(unique(T.variance for T in elements))")
    end
    return Basis(elements, variance)
end
