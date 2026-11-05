isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/Derivatives #partial-differentiation
"""
function ref_derivatives_partial_differentiation()
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))

        # Differentiating a vector field yields a (1, 1)-tensor
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[v u; 0 2v]
    end
    @ex result begin
        # Differentiating a (1, 1)-tensor yields a (1, 2)-tensor
        A = Tensor([u 2v; 3u v^2])
        ∂[:k] * A[:i][:j]
        # Docs output:
        #   (1, 2)-Tensor T^i_jk
        #   Num[1 0; 3 0;;; 0 2; 0 2v]
    end
    @ex result begin
        # Repeated index triggers contraction — yields the divergence
        ∂[:i] * X[:i]
        # Docs output:
        #   3v
    end
end

"""
Examples from the docs page reference/Derivatives #covariant-differentiation
"""
function ref_derivatives_covariant_differentiation()
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        ∇ = levicivita(M)

        # Covariant derivative of a vector field on the 2-sphere
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[cos(θ) 0; 0 cos(θ)]
    end
    @ex result begin
        # Covariant derivative of a covector field
        ω = Tensor([1, sin(θ)]')
        ∇[:i] * ω[:j]
        # Docs output:
        #   (0, 2)-Tensor T_ji
        #   Num[0 -cos(θ); 0 cos(θ)*sin(θ)]
    end
    @ex result begin
        # Repeated index yields the covariant divergence
        ∇[:i] * X[:i]
        # Docs output:
        #   2cos(θ)
    end
end

"""
Examples from the docs page reference/Derivatives #exterior-differentiation
"""
function ref_derivatives_exterior_differentiation()
    @ex result begin
        @variables x y z
        ∂ = PartialDerivative((x, y, z))
        d = ExteriorDerivative(∂)

        # Exterior derivative of a 1-form yields an antisymmetric 2-form
        α = Tensor([x^2, y*z, x]')
        d[:k] * α[:i]
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[0 0 -1; 0 0 y; 1 -y 0]
    end
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)

        # Exterior derivative of a 0-form (scalar function) yields a 1-form
        f = u^2 * v
        d[:i] * f
        # Docs output:
        #   (0, 1)-Tensor
        #   Num[2u*v, u^2]
    end
    @ex result begin
        # Nilpotency: applying d twice always yields the zero form
        @variables x y z
        d = ExteriorDerivative(PartialDerivative((x, y, z)))
        α = Tensor([x^2, y*z, x]')
        β = d[:k] * α[:i]
        d[:m] * β[:k, :i]
        # Docs output:
        #   (0, 3)-Tensor
        #   Num[0 0 0; 0 0 0; 0 0 0;;; 0 0 0; 0 0 0; 0 0 0;;; 0 0 0; 0 0 0; 0 0 0]
    end
end
