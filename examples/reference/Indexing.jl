isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/Indexing #tensor-getindex
"""
function ref_indexing_tensor_getindex()
    @ex result begin
        v = Tensor([1, 2])
        v[1]       # Integer index — returns a scalar
        v[:i]      # Symbolic index — returns an IndexedTensor
        # Docs output:
        #   1
        #   (1, 0)-Tensor T^i
        #   [1, 2]
    end
    @ex results begin
        # Mixed-variance tensors use two brackets
        L = Tensor([4 -2; 1 1])
        L[1][:j]   # Slice first contravariant index, label covariant
        L[:i][:j]  # Label both — returns an IndexedTensor
        # Docs output:
        #   (0, 1)-Tensor T_j
        #   [4, -2]
        #   (1, 1)-Tensor T^i_j
        #   [4 -2; 1 1]
    end
    @ex result begin
        # Repeating the same symbol in both brackets triggers a self-contraction
        A = Tensor([3 1; -2 4])
        A[:i][:i]   # trace
        # Docs output:
        #   7
    end
end

"""
Examples from the docs page reference/Indexing #partial-indexed-tensor-getindex
"""
function ref_indexing_partial_indexed_tensor_getindex()
    @ex result begin
        L = Tensor([4 -2; 1 1])
        L[:i][:j]   # Second bracket labels the covariant index
        # Docs output:
        #   (1, 1)-Tensor T^i_j
        #   [4 -2; 1 1]
    end
    @ex result begin
        # Matching symbols across brackets trigger an implicit self-contraction
        L[:i][:i]   # trace
        # Docs output:
        #   5
    end
    @ex result begin
        # Integer in the second bracket slices the covariant index
        L[:i][1]
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [4, 1]
    end
end

"""
Examples from the docs page reference/Indexing #kronecker-delta-getindex
"""
function ref_indexing_kronecker_delta_getindex()
    @ex result begin
        δ = KroneckerDelta()
        δ[1, 1]    # Equal integer indices → 1
        δ[1, 2]    # Unequal integer indices → 0
        # Docs output:
        #   1
        #   0
    end
    @ex result begin
        # Symbolic indexing returns an IndexedKroneckerDelta
        L = Tensor([4 -2; 1 1])
        L[:i][:j] * δ[:i, :k]   # Relabels contravariant index i → k, stored with k first
        # Docs output:
        #   (1, 1)-Tensor T^k_j
        #   [4 1; -2 1]
    end
end

"""
Examples from the docs page reference/Indexing #levi-civita-getindex
"""
function ref_indexing_levi_civita_getindex()
    @ex result begin
        ε = LeviCivita()
        ε[1, 2]    # Even permutation → 1
        ε[2, 1]    # Odd permutation → -1
        ε[1, 1]    # Repeated index → 0
        # Docs output:
        #   1
        #   -1
        #   0
    end
    @ex result begin
        # Symbolic indexing for use in summation
        v = Tensor([2, 1])
        u = Tensor([-3, 2])
        v[:i] * u[:j] * ε[:i, :j]   # Signed area
        # Docs output:
        #   7
    end
end

"""
Examples from the docs page reference/Indexing #partial-derivative-getindex
"""
function ref_indexing_partial_derivative_getindex()
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]   # Jacobian of X
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[v u; 0 2v]
    end
    @ex result begin
        # Contracting with a matching index gives the divergence
        ∂[:i] * X[:i]
        # Docs output:
        #   3v
    end
end

"""
Examples from the docs page reference/Indexing #covariant-derivative-getindex
"""
function ref_indexing_covariant_derivative_getindex()
    @ex result begin
        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        ∇ = levicivita(Manifold((θ, φ), e))
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]   # Covariant Jacobian of X
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[cos(θ) 0; 0 cos(θ)]
    end
    @ex result begin
        # Contracting with a matching index gives the covariant divergence
        ∇[:i] * X[:i]
        # Docs output:
        #   2cos(θ)
    end
end

"""
Examples from the docs page reference/Indexing #exterior-derivative-getindex
"""
function ref_indexing_exterior_derivative_getindex()
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)
        α = Tensor([u^2 * v, v + 2]')
        d[:i] * α[:j]   # Exterior derivative of a 1-form
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[0 u^2; -(u^2) 0]
    end
    @ex result begin
        # Nilpotency: d² = 0 — β's indices must be freshly labeled,
        # distinct from d's next index, since β carries no memory of :i, :j
        β = d[:i] * α[:j]
        d[:m] * β[:k, :l]
        # Docs output:
        #   (0, 3)-Tensor
        #   Num[0 0; 0 0;;; 0 0; 0 0]
    end
end

"""
Examples from the docs page reference/Indexing #basis-getindex
"""
function ref_indexing_basis_getindex()
    @ex result begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        e[2]    # Integer index — returns the second basis element
        # Docs output:
        #   (1, 0)-Tensor
        #   [0, 1]
    end
    @ex result begin
        # Symbolic indexing and contraction yields a linear combination
        v = Tensor([3, -2])
        v[:i] * e[:i]
        # Docs output:
        #   (1, 0)-Tensor
        #   [3, -2]
    end
    @ex result begin
        # Works with non-orthogonal bases too
        e = Basis([Tensor([1, 1]), Tensor([0, 1])])
        v = Tensor([2, -1])
        v[:i] * e[:i]
        # Docs output:
        #   (1, 0)-Tensor
        #   [2, 1]
    end
end
