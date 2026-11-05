isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/SimplifyEvaluate #simplify
"""
function ref_simplify_evaluate_simplify()
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        R = ricci(M)
        simplify(R)
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[1 0; 0 sin(θ)^2]
    end
    @ex result begin
        # Also works on IndexedTensors
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([sin(u)^2 + cos(u)^2, v])
        simplify(∂[:i] * X[:j])
        # Docs output:
        #   (1, 1)-Tensor T^j_i
        #   Num[0 0; 0 1]
    end
    @ex result begin
        # Equivalent to passing simple=true when constructing the manifold
        ricci_scalar(Manifold((θ, φ), e, simple=true))
        # Docs output:
        #   2
    end
end

"""
Examples from the docs page reference/SimplifyEvaluate #substitute
"""
function ref_simplify_evaluate_substitute()
    @ex result begin
        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        R = ricci(Manifold((θ, φ), e, simple=true))

        # Evaluate at the equator θ = π/2
        substitute(R, Dict(θ => π/2))
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[1 0; 0 sin(1.5707963267948966)^2]
    end
    @ex result begin
        # Partial substitution — result is still symbolic
        @variables u v
        X = Tensor([u^2 * v, sin(u) + v])
        substitute(X, Dict(u => 2))
        # Docs output:
        #   (1, 0)-Tensor
        #   Num[4v, sin(2) + v]
    end
    @ex result begin
        # Replacing a variable with an expression
        substitute(X, Dict(u => v^2))
        # Docs output:
        #   (1, 0)-Tensor
        #   Num[v^5, sin(v^2) + v]
    end
end

"""
Examples from the docs page reference/SimplifyEvaluate #evaluate
"""
function ref_simplify_evaluate_evaluate()
    @ex result begin
        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        R = ricci(Manifold((θ, φ), e, simple=true))

        # Numerically evaluate the Ricci tensor at θ = π/4
        evaluate(R, Dict(θ => π/4, φ => 0.0))
        # Docs output:
        #   (0, 2)-Tensor
        #   [1.0 0.0; 0.0 0.4999999999999999]
    end
    @ex result begin
        # Also works on scalars
        @variables u v
        f = u^2 * sin(v)
        evaluate(f, Dict(u => 3.0, v => π/6))
        # Docs output:
        #   4.5
    end
    @ex result begin
        # Useful for sampling a symbolic vector field at a point
        X = Tensor([sin(θ) * cos(φ), cos(θ)])
        evaluate(X, Dict(θ => π/3, φ => π/4))
        # Docs output:
        #   (1, 0)-Tensor
        #   [0.6123724356957946, 0.5000000000000001]
    end
end
