"""
Internal. The Jacobian of the new coordinates with respect to the old ones, J[i, j] = ∂uⁱ/∂xʲ, and its inverse
"""
function transition_jacobians(old, new)
    if length(old) != length(new)
        error("A coordinate change needs as many new coordinates as old ones, but there are $(length(old)) old and $(length(new)) new")
    end
    x = collect(Num.(old))
    J = Symbolics.jacobian(collect(Num.(new)), x)
    return J, simplify.(inv(J))
end

"""
Internal. Replaces the old coordinates by their expressions in the new ones, if an inverse is given
"""
function rewrite_in_new(data, old, to, inverse)
    if inverse === nothing
        return data
    end
    if to === nothing || length(to) != length(old) || length(inverse) != length(old)
        error("To rewrite in the new coordinates, give `to`, the new coordinate symbols, and `inverse`, the old coordinates as expressions in them, each with $(length(old)) entries")
    end
    substitution = Dict(Num(o) => Num(i) for (o, i) in zip(old, inverse))
    return substitute.(data, Ref(substitution))
end

"""
Internal. Multiplies a matrix into one axis of an array, contracting the matrix's second index with that axis
"""
function apply_along(data, M, axis)
    result = Array{Num}(undef, size(data))
    for index in CartesianIndices(data)
        position = Tuple(index)
        result[index] = sum(M[position[axis], j] * data[Base.setindex(position, j, axis)...] for j in axes(data, axis))
    end
    return result
end

"""
Transform the components of a tensor to a new coordinate chart

The new coordinates are given as functions of the old ones, `new = (u(x, y), v(x, y))` for `old = (x, y)`.
Each contravariant index is multiplied by the Jacobian ∂uⁱ/∂xʲ and each covariant index by the inverse
Jacobian, so the tensor itself is unchanged and only its components are. The result is written in terms of the
old coordinates, the components at each point. To write it in the new coordinates, give their symbols as `to`
and the old coordinates as expressions in them as `inverse`.

# Examples
A radial vector field in polar coordinates
```
julia> @variables x y r θ
julia> X = Tensor([x, y])
julia> transform(X, (x, y), (sqrt(x^2 + y^2), atan(y, x)); simple=true)
(1, 0)-Tensor
Num[sqrt(x^2 + y^2), 0]
```
The Euclidean metric in polar coordinates, written in terms of r and θ
```
julia> g = Tensor([1 0; 0 1], :co, :co)
julia> transform(g, (x, y), (sqrt(x^2 + y^2), atan(y, x)); to=(r, θ), inverse=(r*cos(θ), r*sin(θ)), simple=true)
(0, 2)-Tensor
Num[1 0; 0 r^2]
```
"""
function transform(A::Tensor, old, new; to=nothing, inverse=nothing, simple=false)
    J, Jinv = transition_jacobians(old, new)
    n = length(old)
    if any(s -> s != n, size(A.data))
        error("The tensor must have dimension $n to match the $n coordinates, but its size is $(size(A.data))")
    end
    data = Array{Num}(Num.(A.data))
    for (axis, variance) in enumerate(A.variance)
        data = apply_along(data, variance == :contra ? J : transpose(Jinv), axis)
    end
    data = rewrite_in_new(data, old, to, inverse)
    result = Tensor(data, A.variance)
    return tidy(simple ? simplify(result) : result)
end

"""
Transform a vector or covector basis to a new coordinate chart

Basis vectors change the opposite way to components: the new basis vector e′ᵢ = (∂xʲ/∂uⁱ) eⱼ, and a covector
basis changes with the Jacobian. Takes the same arguments as `transform` for a tensor.

# Examples
```
julia> @variables x y
julia> e = Basis([Tensor([1, 0]), Tensor([0, 1])])
julia> transform(e, (x, y), (sqrt(x^2 + y^2), atan(y, x)); simple=true)
```
"""
function transform(e::Basis, old, new; to=nothing, inverse=nothing, simple=false)
    if length(e.variance) != 1
        error("Only a vector or covector basis can be transformed, but this basis has variance $(e.variance)")
    end
    J, Jinv = transition_jacobians(old, new)
    n = length(old)
    if length(e.elements) != n
        error("The basis must have $n elements to match the $n coordinates, but it has $(length(e.elements))")
    end
    M = e.variance == (:contra,) ? transpose(Jinv) : J
    elements = map(1:n) do i
        data = sum(M[i, j] .* Num.(e.elements[j].data) for j in 1:n)
        data = rewrite_in_new(data, old, to, inverse)
        tensor = Tensor(Array(data), e.variance)
        tidy(simple ? simplify(tensor) : tensor)
    end
    return Basis(elements)
end
