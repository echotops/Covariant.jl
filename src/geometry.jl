"""
Computes the inverse of a (2, 0) or (0, 2) tensor (the metric or inverse metric)
"""
function LinearAlgebra.inv(A::Tensor)
    if length(A.variance) != 2
        error("inv needs a rank 2 tensor, but this one has rank $(length(A.variance))")
    elseif A.variance[1] != A.variance[2]
        error("inv needs a (2, 0) or (0, 2) tensor, but the variance is $(A.variance)")
    end
    inverse = exact_inv(A.data)
    if A.variance[1] == :co
        return Tensor(inverse, (:contra, :contra))
    else
        return Tensor(inverse, (:co, :co))
    end
end

"""
Define the Minkowski norm on two (1, 0) tensors.

Sign convention is the timelike_positive argument, false by default. (-, +, +, +)
"""
function minkowski(A::Tensor, B::Tensor, timelike_positive=false)
    if A.variance != (:contra,) || B.variance != (:contra,)
        error("minkowski needs two (1, 0)-tensors, but the variances are $(A.variance) and $(B.variance)")
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
        error("A metric needs a vector basis, but the variance is $(e.variance)")
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
julia> g = Tensor([1 0; 0 sin(θ)^2], :co, :co)
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
Construct a manifold from coordinates and an embedding in R3, taking the induced metric from the embedding

The embedding is called with the symbolic coordinates, so it must be written with functions that
Symbolics.jl can trace, like `cos` and `sin`. The tangent vectors are the columns of its Jacobian, which
become the basis, and the metric is the inner product of those vectors. Other keywords, such as `ranges` and
`simple`, are passed on.

# Examples
```
julia> @variables θ φ
julia> embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
julia> M = Manifold((θ, φ), embedding; simple=true)
julia> ricci_scalar(M)
2
```
"""
function Manifold(coordinates, embedding::Function; inner_product=⋅, kwargs...)
    x = collect(Num.(coordinates))
    J = Symbolics.jacobian(Num.(embedding(x...)), x)
    basis = Basis([Tensor(J[:, i]) for i in axes(J, 2)])
    return Manifold(coordinates, basis; embedding=embedding, inner_product=inner_product, kwargs...)
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

"""
Compute the tangent basis vectors of an embedding at a point, by automatic differentiation

Returns the columns of the Jacobian of the embedding, the coordinate basis vectors ∂/∂uⁱ at x, as a
vector of vectors. These are what plotted vector components are taken in when a Manifold has an
embedding but no basis.

# Examples
```
julia> embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
julia> embedding_basis(embedding, [π/2, 0.0])
2-element Vector{Vector{Float64}}:
 [6.123233995736766e-17, 0.0, -1.0]
 [0.0, 1.0, -0.0]
```
"""
function embedding_basis(embedding, x)
    J = ForwardDiff.jacobian(p -> embedding(p...), collect(Float64, x))
    return [J[:, i] for i in axes(J, 2)]
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
    return get!(() -> tidy(simplify(raw)), M.cache, Symbol(key, :_simple))
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
        tidy(((1 // 2) * G[:l, :r] * (T1 + T2 - T3)).tensor)
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
        tidy((T1 - T2 + T3 - T4).tensor)
    end)
end

function raw_ricci(M::Manifold)
    return raw(M, :ricci, () -> begin
        R = raw_riemann(M)
        tidy(R[:i][:j, :k, :i].tensor)
    end)
end

function raw_ricci_scalar(M::Manifold)
    return raw(M, :ricci_scalar, () -> begin
        G = inverse_metric(M)
        R = raw_ricci(M)
        tidy(G[:i, :j] * R[:i, :j])
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
Compute the Lie derivative of a tensor A along a vector field X

Returns a tensor of the same type as A. For two (1, 0)-tensors this is the Lie bracket [X, Y]. Each
contravariant index of A subtracts a term from the derivative of X, and each covariant index adds one.

# Examples
The Lie bracket of two vectors
```
julia> @variables u v
julia> ∂ = PartialDerivative((u, v))
julia> X = Tensor([u^2 + 1, -2v])
julia> Y = Tensor([v, 3 - v])
julia> lie(X, Y, ∂)
(1, 0)-Tensor
Num[-2v - 2u*v, 2v + 2(3 - v)]
```
The Lie derivative of a covector
```
julia> ω = Tensor([v, u]')
julia> lie(X, ω, ∂)
```
"""
function lie(X::Tensor, A::Tensor, ∂::PartialDerivative; simple=false)
    coordinates = ∂.coordinates
    n = length(coordinates)
    if X.variance != (:contra,)
        error("The Lie derivative needs a vector field X, a (1, 0)-tensor, but the variance is $(X.variance)")
    end
    if length(X.data) != n || any(s -> s != n, size(A.data))
        error("X and A must have dimension $n to match the $n coordinates, but their sizes are $(size(X.data)) and $(size(A.data))")
    end
    derivative(f, k) = expand_derivatives(Differential(coordinates[k])(Num(f)))
    dX = [derivative(X.data[i], k) for i in 1:n, k in 1:n]
    L = Array{Num}(undef, size(A.data))
    for index in CartesianIndices(A.data)
        position = Tuple(index)
        term = sum(X.data[k] * derivative(A.data[index], k) for k in 1:n)
        for (slot, variance) in enumerate(A.variance), k in 1:n
            swapped = Base.setindex(position, k, slot)
            if variance == :contra
                term -= dX[position[slot], k] * A.data[swapped...]
            else
                term += dX[k, position[slot]] * A.data[swapped...]
            end
        end
        L[index] = term
    end
    result = Tensor(L, A.variance)
    return simple ? simplify(result) : result
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
        tidy((R[:i, :j] - ((1 // 2) * raw_ricci_scalar(M) * g[:i, :j])).tensor)
    end)
end

"""
Compute the Gaussian curvature of a surface, a 2-dimensional manifold

Half of the Ricci scalar, K = R / 2. It is 1 on the unit sphere, 0 on the plane, and negative on a saddle.
"""
function gaussian_curvature(M::Manifold)
    if length(M.coordinates) != 2
        error("Gaussian curvature is defined on surfaces, but this manifold has dimension $(length(M.coordinates)). Use sectional_curvature for a plane in higher dimensions")
    end
    return tidy((1 // 2) * ricci_scalar(M))
end

"""
Compute the sectional curvature of a manifold on the plane spanned by two vectors X and Y

K(X, Y) = R(X, Y, X, Y) / (g(X, X) g(Y, Y) - g(X, Y)²), the Gaussian curvature of the surface that the plane
sweeps out. X and Y are (1, 0)-tensors whose components may be symbolic.

# Examples
```
julia> @variables θ φ
julia> M = Manifold((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]), simple=true)
julia> sectional_curvature(M, Tensor([1, 0]), Tensor([0, 1]))
1
```
"""
function sectional_curvature(M::Manifold, X::Tensor, Y::Tensor)
    for V in (X, Y)
        if V.variance != (:contra,)
            error("sectional_curvature needs vectors, (1, 0)-tensors, but the variance is $(V.variance)")
        end
    end
    n = length(M.coordinates)
    if length(X.data) != n || length(Y.data) != n
        error("The vectors must have $n components to match the $n coordinates")
    end
    g = metric(M).data
    R = raw_riemann(M).data
    # R[α, ν, σ, μ] is R^α_σμν, so lowering α gives R_ρσμν
    numerator = sum(g[ρ, α] * X.data[ρ] * Y.data[σ] * X.data[μ] * Y.data[ν] * R[α, ν, σ, μ]
        for ρ in 1:n, α in 1:n, σ in 1:n, μ in 1:n, ν in 1:n)
    inner(A, B) = sum(g[i, j] * A.data[i] * B.data[j] for i in 1:n, j in 1:n)
    K = tidy(numerator / (inner(X, X) * inner(Y, Y) - inner(X, Y)^2))
    return M.simple ? tidy(simplify(K; expand=true)) : K
end

