isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/IndexedArithmetic #addition
"""
function ref_indexed_arithmetic_addition()
    @ex result begin
        v = Tensor([1, 2])
        w = Tensor([-3, 1])
        v[:i] + w[:i]
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [-2, 3]
    end
    @ex result begin
        A = Tensor([2 1; -3 1], :contra, :contra)
        B = Tensor([0 -1; 4 2], :contra, :contra)
        A[:i, :j] + B[:i, :j]
        # Docs output:
        #   (2, 0)-Tensor T^ij
        #   [2 0; 1 3]
    end
    @throws begin
        # Mismatched index labels raise an error
        A[:i, :j] + B[:i, :k]
        # Docs output:
        #   ERROR: Contravariant indices must match to add tensors, but the left has (:i, :j) and the right has (:i, :k)
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #subtraction
"""
function ref_indexed_arithmetic_subtraction()
    @ex result begin
        v = Tensor([1, 2])
        w = Tensor([-3, 1])
        v[:i] - w[:i]
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [4, 1]
    end
    @ex result begin
        L = Tensor([4 -2; 3 3], :contra, :contra)
        M = Tensor([0 0; -3 3], :contra, :contra)
        L[:i, :j] - M[:i, :j]
        # Docs output:
        #   (2, 0)-Tensor T^ij
        #   [4 -2; 6 0]
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #multiplication-scalar
"""
function ref_indexed_arithmetic_multiplication_scalar()
    @ex result begin
        g = Tensor([2 -1; 0 2], :co, :co)
        2 * g[:i, :j]
        # Docs output:
        #   (0, 2)-Tensor T_ij
        #   [4 -2; 0 4]
    end
    @ex result begin
        v = Tensor([3, -1])
        v[:i] * -1
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [-3, 1]
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #division-scalar
"""
function ref_indexed_arithmetic_division_scalar()
    @ex result begin
        A = Tensor([1 2; 3 -1])
        A[:i][:j] / 2
        # Docs output:
        #   (1, 1)-Tensor T^i_j
        #   [0.5 1.0; 1.5 -0.5]
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #multiplication-kronecker-delta
"""
function ref_indexed_arithmetic_multiplication_kronecker_delta()
    @ex result begin
        δ = KroneckerDelta()
        L = Tensor([1 2; 3 -1])
        L[:i][:j] * δ[:j, :k]   # Relabels covariant index j → k
        # Docs output:
        #   (1, 1)-Tensor T^i_k
        #   [1 2; 3 -1]
    end
    @ex result begin
        # When both indices match, the result is a trace
        L[:i][:j] * δ[:j, :i]
        # Docs output:
        #   0
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #multiplication-levi-civita
"""
function ref_indexed_arithmetic_multiplication_levi_civita()
    @ex result begin
        ε = LeviCivita()

        # Signed area of the parallelogram spanned by v and u
        v = Tensor([1, 2])
        u = Tensor([-2, 1])
        v[:i] * u[:j] * ε[:i, :j]
        # Docs output:
        #   5
    end
    @ex result begin
        # Cross product in 3D — free index k becomes the output
        a = Tensor([1, 0, 0])
        b = Tensor([0, 1, 0])
        a[:i] * b[:j] * ε[:i, :j, :k]
        # Docs output:
        #   (0, 1)-Tensor T_k
        #   [0, 0, 1]
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #multiplication-linearalgebra
"""
function ref_indexed_arithmetic_multiplication_linearalgebra()
    @ex result begin
        # Covector acting on a vector — full contraction returns a scalar
        v = Tensor([2, -1])
        ω = Tensor([-2, 3]')
        v[:i] * ω[:i]
        # Docs output:
        #   -7
    end
    @ex result begin
        # Linear map acting on a vector — one free index remains
        L = Tensor([2 1; -1 3])
        v = Tensor([1, 2])
        L[:i][:j] * v[:j]
        # Docs output:
        #   (1, 0)-Tensor T^i
        #   [4, 5]
    end
    @ex result begin
        # No matching indices — returns the tensor product
        v = Tensor([1, 2])
        w = Tensor([3, 4])
        v[:i] * w[:j]
        # Docs output:
        #   (2, 0)-Tensor T^ij
        #   [3 4; 6 8]
    end
end
