isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/MetricConnections #manifold
"""
function ref_metric_connections_manifold()
    @ex result begin
        # The unit sphere from its embedding in 3D. The metric
        # and the tangent basis are found from the embedding
        @variables θ φ
        embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
        M = Manifold((θ, φ), embedding;
            ranges=(range(0, π, 50), range(0, 2π, 50)), simple=true)
        ricci_scalar(M)
        # Docs output:
        #   2
    end
    @ex begin
        # Or from a basis, which also gives the metric
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        M = Manifold((θ, φ), e)
    end
    @ex begin
        # A flat chart, plotted in the plane
        @variables u v
        F = Manifold((u, v); ranges=(range(-2, 2, 30), range(-2, 2, 30)))
    end
end

"""
Examples from the docs page reference/MetricConnections #metric
"""
function ref_metric_connections_metric()
    @ex result begin
        # Euclidean metric from the standard Cartesian basis
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        metric(e)
        # Docs output:
        #   (0, 2)-Tensor
        #   [1 0; 0 1]
    end
    @ex result begin
        # Non-trivial metric from an oblique basis
        e = Basis([Tensor([1, 2]), Tensor([3, -1])])
        metric(e)
        # Docs output:
        #   (0, 2)-Tensor
        #   [5 1; 1 10]
    end
    @ex result begin
        # Minkowski metric for special relativity
        η = metric(
            Basis([
                Tensor([1, 0, 0, 0]),
                Tensor([0, 1, 0, 0]),
                Tensor([0, 0, 1, 0]),
                Tensor([0, 0, 0, 1])
            ]),
            minkowski
        )
        # Docs output:
        #   (0, 2)-Tensor
        #   [-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]
    end
end

"""
Examples from the docs page reference/MetricConnections #inv
"""
function ref_metric_connections_inv()
    @ex result begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        g = metric(e)
        𝔤 = inv(g)   # (0, 2) → (2, 0)
        # Docs output:
        #   (2, 0)-Tensor
        #   [1 0; 0 1]
    end
    @ex result begin
        # Using the inverse metric to raise an index
        ω = Tensor([1, -2]') ⊗ Tensor([-3, 2]')   # A (0, 2)-tensor
        𝔤[:i, :j] * ω[:i, :k]
        # Docs output:
        #   (1, 1)-Tensor T^j_k
        #   [-3 2; 6 -4]
    end
end

"""
Examples from the docs page reference/MetricConnections #minkowski
"""
function ref_metric_connections_minkowski()
    @ex result begin
        # Constructing the Minkowski metric with (-, +, +, +) convention
        η = metric(
            Basis([
                Tensor([1, 0, 0, 0]),
                Tensor([0, 1, 0, 0]),
                Tensor([0, 0, 1, 0]),
                Tensor([0, 0, 0, 1])
            ]),
            minkowski
        )
        # Docs output:
        #   (0, 2)-Tensor
        #   [-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]
    end
    @ex result begin
        # Switching to (+ , -, -, -) convention
        η = metric(
            Basis([
                Tensor([1, 0, 0, 0]),
                Tensor([0, 1, 0, 0]),
                Tensor([0, 0, 1, 0]),
                Tensor([0, 0, 0, 1])
            ]),
            (A, B) -> minkowski(A, B, true)
        )
        # Docs output:
        #   (0, 2)-Tensor
        #   [1 0 0 0; 0 -1 0 0; 0 0 -1 0; 0 0 0 -1]
    end
end

"""
Examples from the docs page reference/MetricConnections #christoffel
"""
function ref_metric_connections_christoffel()
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        Γ = christoffel(M)
        # Docs output:
        #   (1, 2)-Tensor
        #   Num[0 0; 0 cos(θ) / sin(θ);;; 0 (-1//2)*sin(2θ); cos(θ) / sin(θ) 0]
    end
    @ex result begin
        # Passing to CovariantDerivative to build the connection
        ∂ = PartialDerivative((θ, φ))
        ∇ = CovariantDerivative(Γ, ∂)
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[cos(θ) 0; 0 cos(θ)]
    end
end

"""
Examples from the docs page reference/MetricConnections #levi-civita
"""
function ref_metric_connections_levi_civita()
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        ∇ = levicivita(M)

        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[cos(θ) 0; 0 cos(θ)]
    end
    @ex result begin
        # Covariant divergence of a vector field
        ∇[:i] * X[:i]
        # Docs output:
        #   2cos(θ)
    end
end

"""
Examples from the docs page reference/MetricConnections #lie
"""
function ref_metric_connections_lie()
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([u, v])
        Y = Tensor([u^2, -v + 2])
        lie(X, Y, ∂)
        # Docs output:
        #   (1, 0)-Tensor
        #   Num[u^2, -2]
    end
    @ex result begin
        # The Lie bracket is antisymmetric: [X, Y] = -[Y, X]
        lie(Y, X, ∂)
        # Docs output:
        #   (1, 0)-Tensor
        #   Num[-(u^2), 2]
    end
    @ex result begin
        # A vector field commutes with itself
        lie(X, X, ∂, simple=true)
        # Docs output:
        #   (1, 0)-Tensor
        #   Num[0, 0]
    end
    @ex result begin
        # The Lie derivative of a covector
        ω = Tensor([v, u]')
        lie(X, ω, ∂, simple=true)
        # Docs output:
        #   (0, 1)-Tensor
        #   Num[2v, 2u]
    end
    @ex result begin
        # Cartan's formula, the Lie derivative of a form: L_X ω = ι_X dω + d(ι_X ω)
        d = ExteriorDerivative(∂)
        dω = d[:i] * ω[:j]
        simplify(interior(X, dω)[:i] + (d[:i] * interior(X, ω))[:i])
        # Docs output:
        #   (0, 1)-Tensor T_i
        #   Num[2v, 2u]
    end
end
