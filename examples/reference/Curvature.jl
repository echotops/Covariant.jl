isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/Curvature #riemann
"""
function ref_curvature_riemann()
    @ex result begin
        # Riemann tensor on the 2-sphere
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        riemann(M)
        # Docs output:
        #   (1, 3)-Tensor
        #   Num[0 0; 0 -1;;; 0 sin(θ)^2; 0 0;;;; 0 0; 1 0;;; -(sin(θ)^2) 0; 0 0]
    end
    @ex result begin
        # Flat space — the Riemann tensor vanishes
        e_flat = Basis([Tensor([1, 0]), Tensor([0, 1])])
        @variables x y
        F = Manifold((x, y), e_flat, simple=true)
        riemann(F)
        # Docs output:
        #   (1, 3)-Tensor
        #   Num[0 0; 0 0;;; 0 0; 0 0;;;; 0 0; 0 0;;; 0 0; 0 0]
    end
end

"""
Examples from the docs page reference/Curvature #ricci
"""
function ref_curvature_ricci()
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        ricci(M)
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[1 0; 0 sin(θ)^2]
    end
    @ex result begin
        # On the 2-sphere the Ricci tensor is proportional to the metric,
        # R_ij = K * g_ij, where K is the Gaussian curvature (here K = 1)
        metric(M)
        # Docs output:
        #   (0, 2)-Tensor
        #   Real[1 0; 0 sin(θ)^2]
    end
end

"""
Examples from the docs page reference/Curvature #ricci-scalar
"""
function ref_curvature_ricci_scalar()
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        ricci_scalar(M)
        # Docs output:
        #   2
    end
    @ex result begin
        # Flat space has zero Ricci scalar
        @variables x y
        e_flat = Basis([Tensor([1, 0]), Tensor([0, 1])])
        F = Manifold((x, y), e_flat, simple=true)
        ricci_scalar(F)
        # Docs output:
        #   0
    end
end

"""
Examples from the docs page reference/Curvature #einstein
"""
function ref_curvature_einstein()
    @ex result begin
        # The Einstein tensor vanishes identically in any 2D space,
        # regardless of curvature — a low-dimensional degeneracy of
        # general relativity, not a special property of the sphere
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        einstein(M)
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[0 0; 0 0]
    end
end

"""
Examples from the docs page reference/Curvature #gaussian-curvature
"""
function ref_curvature_gaussian_curvature()
    @ex result begin
        @variables θ φ
        M = Manifold((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]), simple=true)
        gaussian_curvature(M)
        # Docs output:
        #   1
    end
    @ex result begin
        # The hyperbolic half-plane has constant negative curvature
        @variables x y
        H = Manifold((x, y), Tensor([1/y^2 0; 0 1/y^2], :co, :co), simple=true)
        gaussian_curvature(H)
        # Docs output:
        #   -1
    end
end

"""
Examples from the docs page reference/Curvature #sectional-curvature
"""
function ref_curvature_sectional_curvature()
    @ex result begin
        @variables θ φ
        M = Manifold((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]), simple=true)
        sectional_curvature(M, Tensor([1, 2]), Tensor([-1, 3]))
        # Docs output:
        #   1
    end
end
