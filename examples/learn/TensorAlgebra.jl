isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page learn/TensorAlgebra
"""
function learn_tensor_algebra()
    @ex result begin
        v = Tensor([1, 2])
        w = Tensor([-3, 1])
        v[:i] + w[:i]
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [-2, 3]
    end
    @ex result begin
        L = Tensor([4 -2; 3 3], :contra, :contra)
        M = Tensor([0 0; -3 3], :contra, :contra)
        L[:i, :j] - M[:i, :j]
        # Docs output:
        #   (2, 0)-Tensor T^ij
        #   [4 -2; 6 0]
    end
    @ex result begin
        g = Tensor([2 -1; 0 2], :co, :co)
        2 * g[:i, :j]
        # Docs output:
        #   (0, 2)-Tensor T_ij
        #   [4 -2; 0 4]
    end
    @ex result begin
        v = Tensor([2, -1])
        ω = Tensor([-2, 3]')
        v[:i] * ω[:i]   # The dot product v · ω
        # Docs output:
        #   -7
    end
    @ex result begin
        A = Tensor([2 -3; -4 -1], :co, :contra)
        B = Tensor([-1 1; 2 2], :co, :contra)
        A[:i][:j] * B[:j][:k]   # Matrix multiplication
        # Docs output:
        #   (1, 1)-Tensor T^i_k
        #   [-6 -4; 2 -8]
    end
    @ex result begin
        A = Tensor([2 1; -3 -1], :co, :contra)
        A[:i][:i]   # tr(A)
        # Docs output:
        #   1
    end
    @ex result begin
        A = Tensor([2 1; -3 1], :contra, :contra)
        symmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor
        #   [2 -1; -1 1]
    end
    @ex result begin
        A = Tensor([2 1; -3 1], :contra, :contra)
        antisymmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor
        #   [0 2; -2 0]
    end
    @ex result begin
        v = Tensor([2, -1])
        w = Tensor([3, 4])
        L = v ⊗ w   # The outer product vwᵀ
        # Docs output:
        #   (2, 0)-Tensor
        #   [6 8; -3 -4]
    end
    @ex result begin
        α = Tensor([2, 3]')
        L ⊗ α ⊗ v
        # Docs output:
        #   (3, 1)-Tensor
        #   [24 32; -12 -16;;; 36 48; -18 -24;;;; -12 -16; 6 8;;; -18 -24; 9 12]
    end
    @ex result begin
        e = Basis([
            Tensor([1, 1]),
            Tensor([0, 1])
        ])
        v = Tensor([2, -1])
        v[:i] * e[:i]
        # Docs output:
        #   (1, 0)-Tensor
        #   [2, 1]
    end
    @ex result begin
        ϵ = dual_basis(e)
        δ = KroneckerDelta()
        for i in 1:2, j in 1:2
            println(ϵ[i][:k] * e[j][:k] == δ[i, j])
        end
        # Docs output:
        #   true
        #   true
        #   true
        #   true
    end
end
