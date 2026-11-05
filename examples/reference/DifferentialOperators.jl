isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/DifferentialOperators
"""
function ref_differential_operators()
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))

        # Differentiating a vector field — yields a (1, 1)-tensor
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[v u; 0 2v]
    end
    @ex result begin
        # Differentiating a covector field — yields a (0, 2)-tensor
        α = Tensor([u^2 * v, v + 2]')
        ∂[:i] * α[:j]
        # Docs output:
        #   (0, 2)-Tensor T_ji
        #   Num[2u*v u^2; 0 1]
    end
    @ex result begin
        # Contracting with a matching index computes the divergence
        ∂[:i] * X[:i]
        # Docs output:
        #   3v
    end
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        ∂ = PartialDerivative((θ, φ))
        Γ = christoffel(M)
        ∇ = CovariantDerivative(Γ, ∂)

        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[cos(θ) 0; 0 cos(θ)]
    end
    @ex result begin
        # levicivita constructs the Levi-Civita connection in one step
        ∇ = levicivita(M)
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[cos(θ) 0; 0 cos(θ)]
    end
    @ex result begin
        # Contracting with a matching index computes the covariant divergence
        ∇[:i] * X[:i]
        # Docs output:
        #   2cos(θ)
    end
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)

        # Exterior derivative of a 1-form yields a 2-form
        α = Tensor([u^2 * v, v + 2]')
        d[:i] * α[:j]
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[0 u^2; -(u^2) 0]
    end
    @ex result begin
        # Exterior derivative of a 0-form (scalar) yields a 1-form
        @variables x y z
        ∂3 = PartialDerivative((x, y, z))
        d3 = ExteriorDerivative(∂3)
        f = x^2 * y + z
        d3[:i] * f
        # Docs output:
        #   (0, 1)-Tensor
        #   Num[2x*y, x^2, 1]
    end
    @ex result begin
        # Nilpotency: applying d twice returns the zero form
        β = d[:i] * α[:j]
        d[:m] * β[:k, :l]
        # Docs output:
        #   (0, 3)-Tensor
        #   Num[0 0; 0 0;;; 0 0; 0 0]
    end
end
