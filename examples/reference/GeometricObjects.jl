isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/GeometricObjects
"""
function ref_geometric_objects()
    @ex results begin
        v = Tensor([1, 2])         # (1, 0)-tensor — vector
        ω = Tensor([-3, 1]')       # (0, 1)-tensor — covector
        # Docs output:
        #   (1, 0)-Tensor
        #   [1, 2]
        #   (0, 1)-Tensor
        #   [-3, 1]
    end
    @ex results begin
        L = Tensor([4 -2; 1 1])   # (1, 1)-tensor — linear map
        g = Tensor([2 1; 1 2], :co, :co)  # (0, 2)-tensor — bilinear form
        # Docs output:
        #   (1, 1)-Tensor
        #   [4 -2; 1 1]
        #   (0, 2)-Tensor
        #   [2 1; 1 2]
    end
    @ex result begin
        # The pattern extends naturally to higher rank
        T = Tensor([1 0; -1 3;;; 0 1; 2 0], :contra, :contra, :co)
        # Docs output:
        #   (2, 1)-Tensor
        #   [1 0; -1 3;;; 0 1; 2 0]
    end
    @ex result begin
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, 1])
        ])
        e[2]   # Integer indexing returns the element
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
        # Two bases can be combined with the tensor product
        ε = Basis([Tensor([1, 0]'), Tensor([0, 1]')])
        e ⊗ ε
        # Docs output:
        #   (1, 1)-Basis
        #   [1 0; 0 0]
        #   [0 1; 0 0]
        #   [0 0; 1 0]
        #   [0 0; 0 1]
    end
end
