isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page learn/GettingStarted
"""
function learn_getting_started()
    @ex result begin
        L = Tensor([2 1; -1 3])
        v = Tensor([1, 2])
        L[:i][:j] * v[:j]  # Matrix-vector product
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [4, 5]
    end
    @ex result begin
        @variables u v
        basis = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(u)])
        ])
        riemann(Manifold((u, v), basis, simple=true))
        # Docs output:
        #   (1, 3)-Tensor
        #   Num[0 0; 0 -1;;; 0 sin(u)^2; 0 0;;;; 0 0; 1 0;;; -(sin(u)^2) 0; 0 0]
    end
end
