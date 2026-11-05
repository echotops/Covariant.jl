isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page learn/DifferentialGeometry
"""
function learn_differential_geometry()
    @ex result begin
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, 1])
        ])
        g = metric(e)
        # Docs output:
        #   (0, 2)-Tensor
        #   [1 0; 0 1]
    end
    @ex result begin
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
        𝔤 = inv(g)
        ω = Tensor([1, -2]') ⊗ Tensor([-3, 2]') # A (0, 2)-tensor
        𝔤[:i, :j] * ω[:i, :k]
        # Docs output:
        #   (1, 1)-Tensor T^j_k
        #   [-3 2; 6 -4]
    end
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[v u; 0 2v]
    end
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e) # The coordinates, with the metric from the basis
        ∂ = PartialDerivative((θ, φ))
        Γ = christoffel(M) # The Christoffel symbols of the Levi-Civita connection
        ∇ = CovariantDerivative(Γ, ∂) # Alternatively ∇ = levicivita(M)
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[cos(θ) 0; 0 cos(θ)]
    end
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        riemann(M)
        # Docs output:
        #   (1, 3)-Tensor
        #   Num[0 0; 0 -1;;; 0 sin(θ)^2; 0 0;;;; 0 0; 1 0;;; -(sin(θ)^2) 0; 0 0]
    end
    @ex result begin
        ricci(M)
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[1 0; 0 sin(θ)^2]
    end
    @ex result begin
        ricci_scalar(M)
        # Docs output:
        #   2
    end
    @ex result begin
        einstein(M)
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[0 0; 0 0]
    end
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
        ω = Tensor([v, u]')
        lie(X, ω, ∂, simple=true)
        # Docs output:
        #   (0, 1)-Tensor
        #   Num[2v, 2u]
    end
end
