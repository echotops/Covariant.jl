isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page learn/Tensors
"""
function learn_tensors()
    @ex begin
        v = Tensor([1, 2]) # A vector
        ω = Tensor([-3, 1]') # A covector
    end
    @ex begin
        L = Tensor([4 -2; 1 1]) # A linear map
        g = Tensor([2 1; 1 2], :co, :co) # A bilinear form
        T = Tensor(reshape(1:8, 2, 2, 2), :contra, :contra, :co)
    end
    @ex result begin
        L = Tensor([4 -2; 1 1])
        # Docs output:
        #   (1, 1)-Tensor
        #   [4 -2; 1 1]
    end
    @ex result begin
        v = Tensor([1, 2])
        v[1]
        # Docs output:
        #   1
    end
    @ex result begin
        L = Tensor([4 -2; 1 1])
        L[1][2]
        # Docs output:
        #   -2
    end
    @ex result begin
        v[:i]
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [1, 2]
    end
    @ex result begin
        L[:i][:j]
        # Docs output:
        #   (1, 1)-Tensor T^i_j
        #   [4 -2; 1 1]
    end
    @ex result begin
        L[2][:k]
        # Docs output:
        #   (0, 1)-Tensor T_k
        #   [1, 1]
    end
end
