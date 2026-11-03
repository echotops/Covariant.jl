"""
Computes the inverse of a (2, 0) or (0, 2) tensor (the metric or inverse metric)
"""
function LinearAlgebra.inv(A::Tensor)
    if length(A.variance) != 2
        error("Must be a rank 2 tensor")
    elseif A.variance[1] != A.variance[2]
        error("Must either a (2, 0) or (0, 2) tensor")
    end
    mat = Matrix{Num}(A.data)
    if A.variance[1] == :co
        return Tensor(inv(mat), (:contra, :contra))
    else
        return Tensor(inv(mat), (:co, :co))
    end
end

"""
Define the Minkowski norm on two (1, 0) tensors.

Sign convention is the timelike_positive argument, false by default. (-, +, +, +)
"""
function minkowski(A::Tensor, B::Tensor, timelike_positive=false)
    if A.variance != (:contra,) || B.variance != (:contra,)
        error("A and B must both be (1, 0) tensors")
    end
    k = timelike_positive ? 1 : -1
    return (k * A.data[1] * B.data[1]) + sum([-k * A.data[i] * B.data[i] for i in 2:length(A.data)])
end

"""
Compute the metric tensor g from a vector basis

# Examples
```
julia> basis = (Tensor([1, 2]), Tensor([3, -1]))
julia> g = metric(basis)
Tensor{Int64, 2}([5 1; 1 10], (:co, :co))
```
"""
function metric(e::Basis, inner_product=⋅; simple=false)
    if e.variance != (:contra,)
        error("Must be a vector basis")
    end
    g = [inner_product(e.elements[i], e.elements[j]) for i in eachindex(e.elements), j in eachindex(e.elements)]
    if simple
        return simplify(Tensor(g, (:co, :co,)))
    end
    return Tensor(g, (:co, :co,))
end

"""
Construct a manifold from coordinates and a (0, 2) metric tensor

The optional `ranges` and `embedding` are only used for plotting, and `basis` for plotting vectors on an
embedded surface.

# Examples
```
julia> @variables θ φ
julia> g = Tensor([[1, 0]', [0, sin(θ)^2]']')
julia> M = Manifold((θ, φ), g)
julia> embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
julia> S = Manifold((θ, φ), g; ranges=(range(0, π, 50), range(0, 2π, 50)), embedding=embedding)
```
"""
function Manifold(coordinates, g::Tensor; ranges=nothing, embedding=nothing, basis=nothing, simple=false)
    if g.variance != (:co, :co)
        error("The metric must be a (0, 2)-tensor")
    end
    n = length(coordinates)
    if size(g.data) != (n, n)
        error("The metric must be $n × $n to match the $n coordinates")
    end
    if ranges !== nothing && length(ranges) != n
        error("Expected $n ranges to match the $n coordinates")
    end
    g = simple ? simplify(g) : g
    return Manifold{n}(Tuple(Num.(coordinates)), g, ranges === nothing ? nothing : Tuple(ranges),
        embedding, basis, simple, Dict{Symbol, Any}())
end

"""
Construct a manifold from coordinates and a vector basis, taking the metric from the basis

The basis is kept, so on an embedded surface it also gives the frame that plotted vector components are in.

# Examples
```
julia> @variables θ φ
julia> basis = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
julia> M = Manifold((θ, φ), basis)
```
"""
function Manifold(coordinates, basis::Basis; inner_product=⋅, kwargs...)
    return Manifold(coordinates, metric(basis, inner_product); basis=basis, kwargs...)
end

"""
Construct a flat manifold with the Euclidean metric, for plotting in a coordinate chart

# Examples
```
julia> @variables x y
julia> F = Manifold((x, y); ranges=(range(-2, 2, 30), range(-2, 2, 30)))
```
"""
function Manifold(coordinates; kwargs...)
    n = length(coordinates)
    return Manifold(coordinates, Tensor(Matrix{Int}(I, n, n), (:co, :co)); kwargs...)
end

function Base.show(io::IO, M::Manifold{N}) where N
    print(io, "Manifold{$N}(coordinates = ", M.coordinates, ")")
end

PartialDerivative(M::Manifold) = PartialDerivative(M.coordinates)
HodgeStar(M::Manifold) = HodgeStar(M.metric)

# Internal. Each quantity is cached unsimplified, and the quantities are built from one another in that
# form, since simplifying an intermediate result can make the next one harder to reduce. The public
# functions return the unsimplified result, or a simplified copy (cached separately) when M.simple is set.
function quantity(M::Manifold, key::Symbol, compute)
    raw = get!(compute, M.cache, key)
    M.simple || return raw
    return get!(() -> simplify(raw), M.cache, Symbol(key, :_simple))
end

raw(M::Manifold, key::Symbol, compute) = get!(compute, M.cache, key)

"""
Return the metric tensor of a manifold
"""
metric(M::Manifold) = M.metric

"""
Return the inverse metric (a (2, 0)-tensor) of a manifold
"""
inverse_metric(M::Manifold) = raw(M, :inverse_metric, () -> inv(M.metric))

function raw_christoffel(M::Manifold)
    return raw(M, :christoffel, () -> begin
        ∂ = PartialDerivative(M)
        g = metric(M)
        G = inverse_metric(M)
        T1 = ∂[:k] * g[:r, :j]
        T2 = ∂[:j] * g[:r, :k]
        T3 = ∂[:r] * g[:j, :k]
        (0.5 * G[:l, :r] * (T1 + T2 - T3)).tensor
    end)
end

function raw_riemann(M::Manifold)
    return raw(M, :riemann, () -> begin
        ∂ = PartialDerivative(M)
        Γ = raw_christoffel(M)
        T1 = ∂[:i] * Γ[:l][:j, :k]
        T2 = ∂[:j] * Γ[:l][:i, :k]
        T3 = Γ[:l][:i, :m] * Γ[:m][:j, :k]
        T4 = Γ[:l][:j, :m] * Γ[:m][:i, :k]
        (T1 - T2 + T3 - T4).tensor
    end)
end

function raw_ricci(M::Manifold)
    return raw(M, :ricci, () -> begin
        R = raw_riemann(M)
        R[:i][:j, :k, :i].tensor
    end)
end

function raw_ricci_scalar(M::Manifold)
    return raw(M, :ricci_scalar, () -> begin
        G = inverse_metric(M)
        R = raw_ricci(M)
        G[:i, :j] * R[:i, :j]
    end)
end

"""
Compute the Christoffel Symbols Γ for the Levi-Civita Connection of a manifold

Returns a (1, 2)-tensor containing the connection coefficients

# Examples
```
julia> @variables u v
julia> M = Manifold((u, v), Basis([Tensor([u, 0]), Tensor([0, v])]))
julia> christoffel(M)
```
"""
christoffel(M::Manifold) = quantity(M, :christoffel, () -> raw_christoffel(M))

"""
Return the Levi-Civita Connection of a manifold as a covariant derivative operator
"""
levicivita(M::Manifold) = CovariantDerivative(christoffel(M), PartialDerivative(M))

"""
Compute the Lie bracket of two (1, 0)-tensors

Returns a (1, 0)-tensor

# Examples
```
julia> @variables u, v
julia> ∂ = PartialDerivative((u, v))
julia> X = Tensor([u^2 + 1, -2v])
julia> Y = Tensor([v, 3 - v])
julia> lie(X, Y, ∂)
Tensor{Num, 1}(Num[-2v - 2u*v, 2v + 2(3 - v)], (:contra,))
```
"""
function lie(X::Tensor, Y::Tensor, ∂::PartialDerivative; simple=false)
    T1 = X[:i] * (∂[:i] * Y[:k])
    T2 = Y[:i] * (∂[:i] * X[:k])
    if simple
        return simplify((T1 - T2).tensor)
    end
    return (T1 - T2).tensor
end

"""
Compute the Riemann Curvature Tensor R of a manifold

Returns a (1, 3)-tensor ordered as R^c_abd
"""
riemann(M::Manifold) = quantity(M, :riemann, () -> raw_riemann(M))

"""
Compute the Ricci Curvature Tensor R_ab of a manifold, from the Riemann Curvature Tensor R^c_abd

Returns a (0, 2)-tensor
"""
ricci(M::Manifold) = quantity(M, :ricci, () -> raw_ricci(M))

"""
Compute the Ricci Scalar of a manifold, the trace of the Ricci Curvature Tensor
"""
ricci_scalar(M::Manifold) = quantity(M, :ricci_scalar, () -> raw_ricci_scalar(M))

"""
Compute the Einstein Tensor G_ab of a manifold

Returns a (0, 2)-tensor
"""
function einstein(M::Manifold)
    return quantity(M, :einstein, () -> begin
        R = raw_ricci(M)
        g = metric(M)
        (R[:i, :j] - (0.5 * raw_ricci_scalar(M) * g[:i, :j])).tensor
    end)
end
