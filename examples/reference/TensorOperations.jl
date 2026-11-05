isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/TensorOperations #tensor-product
"""
function ref_tensor_operations_tensor_product()
    @ex result begin
        v = Tensor([1, 2])
        w = Tensor([3, 5]')
        v ⊗ w   # (1, 0) ⊗ (0, 1) → (1, 1)
        # Docs output:
        #   (1, 1)-Tensor
        #   [3 5; 6 10]
    end
    @ex result begin
        # Tensor products can be chained for higher rank
        α = Tensor([2, 3]')
        L = v ⊗ w
        L ⊗ α ⊗ v
        # Docs output:
        #   (2, 2)-Tensor
        #   [6 10; 12 20;;; 9 15; 18 30;;;; 12 20; 24 40;;; 18 30; 36 60]
    end
    @ex result begin
        # Also defined on bases — produces a higher-rank basis
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
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

"""
Examples from the docs page reference/TensorOperations #wedge-product
"""
function ref_tensor_operations_wedge_product()
    @ex result begin
        α = Tensor([1, -2]')
        β = Tensor([3, 1]')
        α ∧ β   # 1-form ∧ 1-form → 2-form
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 7; -7 0]
    end
    @ex result begin
        # Anticommutativity: α ∧ β = -(β ∧ α)
        β ∧ α
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 -7; 7 0]
    end
    @ex result begin
        # Wedging a form with itself always yields zero
        α ∧ α
        # Docs output:
        #   (0, 2)-Tensor
        #   [0 0; 0 0]
    end
end

"""
Examples from the docs page reference/TensorOperations #dot-product
"""
function ref_tensor_operations_dot_product()
    @ex result begin
        v = Tensor([1, 2])
        w = Tensor([3, -1])
        v ⋅ w
        # Docs output:
        #   1
    end
    @ex result begin
        # For a metric inner product, use the metric tensor and contraction
        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        g = metric(e)
        𝔤 = inv(g)
        X = Tensor([1, 0]')
        Y = Tensor([0, 1]')
        𝔤[:i, :j] * X[:i] * Y[:j]   # Inner product via metric
        # Docs output:
        #   0
    end
    @throws begin
        # Only (1, 0)-tensors are accepted
        v = Tensor([1, 2])
        ω = Tensor([3, -1]')
        v ⋅ ω
        # Docs output:
        #   ERROR: ⋅ needs two (1, 0)-tensors, but the variances are (:contra,) and (:co,)
    end
end

"""
Examples from the docs page reference/TensorOperations #trace
"""
function ref_tensor_operations_trace()
    @ex result begin
        A = Tensor([2 -3; 4 -1])
        tr(A)
        # Docs output:
        #   1
    end
    @throws begin
        # Only endomorphisms have an invariant trace
        tr(Tensor([2 -3; 4 -1], :co, :co))
        # Docs output:
        #   ERROR: tr needs a (1, 1)-tensor, but the variance is (:co, :co)
    end
end

"""
Examples from the docs page reference/TensorOperations #determinant
"""
function ref_tensor_operations_determinant()
    @ex result begin
        A = Tensor([2 -3; 4 -1])
        det(A)
        # Docs output:
        #   10
    end
    @ex result begin
        # The determinant of a rotation is 1
        @variables θ
        R = Tensor([cos(θ) -sin(θ); sin(θ) cos(θ)])
        simplify(det(R))
        # Docs output:
        #   1
    end
end

"""
Examples from the docs page reference/TensorOperations #interior-product
"""
function ref_tensor_operations_interior_product()
    @ex result begin
        X = Tensor([2, 3])
        interior(X, Tensor([5, 7]'))
        # Docs output:
        #   31
    end
    @ex result begin
        # Contracting a vector into a 2-form gives a 1-form
        ω = Tensor([0 1; -1 0], :co, :co)
        interior(X, ω)
        # Docs output:
        #   (0, 1)-Tensor
        #   [-3, 2]
    end
end
