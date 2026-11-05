isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/HodgeStar #hodge-star
"""
function ref_hodge_star_hodge_star()
    @ex result begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        g = metric(e)
        ⋆ = HodgeStar(g)

        # In 2D, a 1-form maps to a 1-form
        α = Tensor([3, -1]')
        ⋆(α)
        # Docs output:
        #   (0, 1)-Tensor
        #   [1, 3]
    end
    @ex result begin
        # In 3D, a 1-form maps to a 2-form
        e3 = Basis([Tensor([1,0,0]), Tensor([0,1,0]), Tensor([0,0,1])])
        star3 = HodgeStar(metric(e3))
        β = Tensor([1, 0, 0]')
        star3(β)
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 0 0; 0 0 1; 0 -1 0]
    end
    @ex result begin
        # A top-form maps to a scalar
        ω = Tensor([0 1; -1 0], :co, :co)   # A 2-form in 2D
        ⋆(ω)
        # Docs output:
        #   1
    end
end
