isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page learn/DifferentialForms
"""
function learn_differential_forms()
    @ex result begin
        α = Tensor([1, -2]')
        β = Tensor([3, 1]')
        γ = α ∧ β
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 7; -7 0]
    end
    @ex result begin
        α ∧ α
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 0; 0 0]
    end
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)
        α = Tensor([u^2 * v, v + 2]')
        d[:i] * α[:j]
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[0 u^2; -(u^2) 0]
    end
    @ex result begin
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, 1])
        ])
        g = metric(e)
        ⋆ = HodgeStar(g)
        ω = Tensor([2, 1]')
        ⋆(ω)
        # Docs output:
        #   (0, 1)-Tensor
        #   [-1, 2]
    end
end
