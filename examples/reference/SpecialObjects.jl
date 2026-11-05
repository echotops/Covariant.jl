isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/SpecialObjects
"""
function ref_special_objects()
    @ex result begin
        δ = KroneckerDelta()
        L = Tensor([1 2; 3 4])
        L[:i][:j] * δ[:i, :k]   # Relabels the contravariant index i → k, stored with k first
        # Docs output:
        #   (1, 1)-Tensor T^k_j
        #   [1 3; 2 4]
    end
    @ex result begin
        # Verifying that a dual basis satisfies the duality condition
        e = Basis([Tensor([2, 0]), Tensor([0, 3])])
        ϵ = dual_basis(e)
        for i in 1:2, j in 1:2
            println(ϵ[i][:k] * e[j][:k] == δ[i, j])
        end
        # Docs output:
        #   true
        #   true
        #   true
        #   true
    end
    @ex result begin
        # The identity tensor is δ made concrete in a fixed dimension —
        # contracting it with itself recovers that dimension
        Id = Tensor([1 0; 0 1])
        Id[:i][:i]
        # Docs output:
        #   2
    end
    @ex result begin
        ε = LeviCivita()

        # 2D: computes the signed area of the parallelogram spanned by v and u
        v = Tensor([2, 1])
        u = Tensor([-3, 2])
        v[:i] * u[:j] * ε[:i, :j]
        # Docs output:
        #   7
    end
    @ex result begin
        # 3D: computes the cross product of two vectors
        a = Tensor([1, 0, 0])
        b = Tensor([0, 1, 0])
        a[:i] * b[:j] * ε[:i, :j, :k]
        # Docs output:
        #   (0, 1)-Tensor T_k
        #   [0, 0, 1]
    end
    @ex result begin
        # Antisymmetry means repeated indices always cancel to 0,
        # so crossing a vector with itself vanishes
        v[:i] * v[:j] * ε[:i, :j]
        # Docs output:
        #   0
    end
    @ex result begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        g = metric(e)
        ⋆ = HodgeStar(g)

        α = Tensor([3, -1]')   # A 1-form in 2D → maps to a 1-form
        ⋆(α)
        # Docs output:
        #   (0, 1)-Tensor
        #   [1, 3]
    end
    @ex result begin
        # In 3D, a 1-form maps to a 2-form
        e3 = Basis([Tensor([1,0,0]), Tensor([0,1,0]), Tensor([0,0,1])])
        ⋆₃ = HodgeStar(metric(e3))
        β = Tensor([1, 0, 0]')
        ⋆₃(β)
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 0 0; 0 0 1; 0 -1 0]
    end
    @ex result begin
        # A top-form (n-form) maps to a scalar
        ω = Tensor([0 1; -1 0], :co, :co)   # A 2-form in 2D
        ⋆(ω)
        # Docs output:
        #   1
    end
end
