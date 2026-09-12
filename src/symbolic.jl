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