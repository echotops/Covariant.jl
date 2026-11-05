isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/Constructors #tensor
"""
function ref_constructors_tensor()
    @ex results begin
        Tensor([1, 3])         # (1, 0)-tensor — vector
        Tensor([2, -5]')       # (0, 1)-tensor — covector
        # Docs output:
        #   (1, 0)-Tensor
        #   [1, 3]
        #   (0, 1)-Tensor
        #   [2, -5]
    end
    @ex results begin
        Tensor([0 -1; 1 0])    # (1, 1)-tensor — the 90° rotation map
        Tensor([1 0; 0 1], :co, :co)   # (0, 2)-tensor — the identity metric
        # Docs output:
        #   (1, 1)-Tensor
        #   [0 -1; 1 0]
        #   (0, 2)-Tensor
        #   [1 0; 0 1]
    end
    @ex result begin
        # The pattern extends to arbitrary rank
        Tensor([1 0; -1 3;;; 0 1; 2 0], :contra, :contra, :co)
        # Docs output:
        #   (2, 1)-Tensor
        #   [1 0; -1 3;;; 0 1; 2 0]
    end
    @throws begin
        # Arrays beyond a matrix state their variance
        Tensor(reshape(1:8, 2, 2, 2))
        # Docs output:
        #   ERROR: Specify the variance of a rank 3 tensor, for example Tensor(data, :contra, :contra, :contra)
    end
end

"""
Examples from the docs page reference/Constructors #basis
"""
function ref_constructors_basis()
    @ex begin
        # Standard Cartesian basis
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, 1])
        ])
    end
    @ex begin
        # Basis for a 2-sphere in spherical coordinates
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
    end
    @throws begin
        # Mismatched variance raises an error
        Basis([Tensor([1, 0]), Tensor([0, 1]')])
        # Docs output:
        #   ERROR: Basis elements must have the same variance, but found [(:contra,), (:co,)]
    end
end
