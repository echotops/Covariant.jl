"""
Simplifies symbolic expressions within a Tensor
"""
function Symbolics.simplify(A::Tensor)
    return Tensor(simplify.(A.data), A.variance)
end

"""
Simplifies symbolic expressions within an IndexedTensor
"""
function Symbolics.simplify(A::IndexedTensor)
    return IndexedTensor(simplify(A.tensor), A.contravariant, A.covariant)
end

"""
Substitutes symbolic expressions within a Tensor
"""
function Symbolics.substitute(A::Tensor, dict)
    a = substitute.(A.data, Ref(dict))
    return Tensor(a, A.variance)
end

"""
Evaluates symbolic expressions within a Tensor
"""
function evaluate(A::Tensor, dict)
    a = [Float64(Symbolics.symbolic_to_float(substitute(expr, dict; fold=Val(true)))) for expr in A.data]
    return Tensor(reshape(a, size(A.data)), A.variance)
end

"""
Evaluates symbolic expressions within a scalar
"""
function evaluate(x::Num, dict)
    result = substitute(x, dict; fold=Val(true))
    return Float64(Symbolics.symbolic_to_float(result))
end

"""
Compile a symbolic tensor into a fast numeric function of the coordinates

Returns a function that takes a point (a collection of coordinate values) and returns the tensor's
components there as an array. Useful when the same tensor is evaluated many times, since `evaluate`
substitutes into the symbolic expressions on every call.

# Examples
```
julia> @variables x y
julia> f = lambdify(Tensor([x * y, y^2]), (x, y))
julia> f((2.0, 3.0))
2-element Vector{Float64}:
 6.0
 9.0
```
"""
function lambdify(A::Tensor, coordinates)
    f = Symbolics.build_function(Num.(A.data), collect(Num.(coordinates))...; expression=Val{false})[1]
    return x -> f(x...)
end

"""
Compile a symbolic scalar into a fast numeric function of the coordinates
"""
function lambdify(f, coordinates)
    g = Symbolics.build_function(Num(f), collect(Num.(coordinates))...; expression=Val{false})
    return x -> g(x...)
end

# Internal. Compile a symbolic tensor into an in-place function f!(out, x), where x is a tuple of coordinate
# values. Calling it with a tuple keeps the splat free of allocation, and out is filled with the components.
function lambdify!(A::Tensor, coordinates)
    f! = Symbolics.build_function(Num.(A.data), collect(Num.(coordinates))...; expression=Val{false})[2]
    return (out, x) -> f!(out, x...)
end

