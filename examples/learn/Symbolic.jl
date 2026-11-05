isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page learn/Symbolic
"""
function learn_symbolic()
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
        # Equivalent to simplify(ricci_scalar(M))
        ricci_scalar(Manifold((θ, φ), e, simple=true))
        # Docs output:
        #   2
    end
    @ex result begin
        R = ricci(Manifold((θ, φ), e, simple=true))

        # Evaluate at the equator θ = π/2
        substitute(R, Dict(θ => π/2))
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[1 0; 0 sin(1.5707963267948966)^2]
    end
    @ex result begin
        @variables u v
        X = Tensor([u^2 * v, sin(u) + v])
        substitute(X, Dict(u => v^2)) # Partial, and replacing with an expression
        # Docs output:
        #   (1, 0)-Tensor
        #   Num[v^5, sin(v^2) + v]
    end
    @ex result begin
        # Numerically evaluate the Ricci tensor at θ = π/4
        evaluate(R, Dict(θ => π/4, φ => 0.0))
        # Docs output:
        #   (0, 2)-Tensor
        #   [1.0 0.0; 0.0 0.4999999999999999]
    end
    @ex result begin
        f = u^2 * sin(v)
        evaluate(f, Dict(u => 3.0, v => π/6))
        # Docs output:
        #   4.5
    end
end
