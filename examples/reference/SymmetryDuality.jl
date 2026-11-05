isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/SymmetryDuality #symmetrize
"""
function ref_symmetry_duality_symmetrize()
    @ex result begin
        A = Tensor([2 1; -3 1], :contra, :contra)
        symmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor
        #   [2 -1; -1 1]
    end
    @ex result begin
        # Symmetrizing an already symmetric tensor leaves it unchanged
        g = Tensor([1 0; 0 1], :co, :co)
        symmetrize(g[:i, :j], :i, :j)
        # Docs output:
        #   (0, 2)-Tensor
        #   [1 0; 0 1]
    end
    @throws begin
        # Mixing contravariant and covariant indices raises an error
        L = Tensor([2 1; -3 1])
        symmetrize(L[:i][:j], :i, :j)
        # Docs output:
        #   ERROR: Index j is co but i is contra. Symmetrizing needs indices of one variance
    end
end

"""
Examples from the docs page reference/SymmetryDuality #antisymmetrize
"""
function ref_symmetry_duality_antisymmetrize()
    @ex result begin
        A = Tensor([2 1; -3 1], :contra, :contra)
        antisymmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor
        #   [0 2; -2 0]
    end
    @ex result begin
        # Antisymmetrizing an already antisymmetric tensor leaves it unchanged
        ω = Tensor([0 1; -1 0], :co, :co)
        antisymmetrize(ω[:i, :j], :i, :j)
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 1; -1 0]
    end
    @ex result begin
        # Antisymmetrizing a symmetric tensor yields zero
        g = Tensor([1 0; 0 1], :co, :co)
        antisymmetrize(g[:i, :j], :i, :j)
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 0; 0 0]
    end
end

"""
Examples from the docs page reference/SymmetryDuality #dual-basis
"""
function ref_symmetry_duality_dual_basis()
    @ex result begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        ϵ = dual_basis(e)   # Dual of a vector basis is a covector basis
        # Docs output:
        #   (0, 1)-Basis
        #   [1.0, 0.0]
        #   [0.0, 1.0]
    end
    @ex result begin
        # Verifying the duality condition
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
    @ex result begin
        # Works for non-orthogonal bases too
        e = Basis([
            Tensor([1, 2]),
            Tensor([0, 1])
        ])
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
end
