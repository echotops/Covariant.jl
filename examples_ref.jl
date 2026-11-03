using Covariant
using Symbolics
using DifferentialEquations
using ForwardDiff
using GLMakie

"""
Internal. Statements in an example that are not displayed: assignments, definitions, and plot calls
"""
const _quiet = (:(=), :function, :for, :while, :if, :let, :using, :import, :local, :global, :const, :macro, :(+=), :(-=))
_shows(s) = !(s isa Expr && (s.head in _quiet || (s.head == :macrocall && string(s.args[1]) == "@variables") ||
                             (s.head == :call && s.args[1] in (:plot_surface!, :plot_scalar!, :plot_vectors!, :plot_path!))))
_show(x) = (x === nothing || x isa Makie.AbstractPlot || x isa Makie.Figure) ? nothing : (display(x); nothing)

"""
Internal. Runs a block of statements in the calling function's scope, displaying the value of each one
like a REPL would
"""
macro ex(block)
    out = Expr(:block)
    for s in block.args
        if s isa LineNumberNode || !_shows(s)
            push!(out.args, esc(s))
        else
            push!(out.args, :(_show($(esc(s)))))
        end
    end
    return out
end

"""
Internal. Runs a block of statements that is expected to throw, printing the error
"""
macro throws(block)
    return quote
        try
            $(esc(block))
            println("Expected an error, but there was none")
        catch err
            println("ERROR: ", sprint(showerror, err))
        end
    end
end

"""
Internal. The unit sphere, its embedding, and an axis, which the plotting examples continue from
"""
function _plot_context()
    @variables θ φ
    embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
    basis = Basis([
        Tensor([cos(φ)*cos(θ), sin(φ)*cos(θ), -sin(θ)]),
        Tensor([-sin(φ)*sin(θ), cos(φ)*sin(θ), 0])
    ])
    θs = range(0.1, π-0.1, 30)
    φs = range(0, 2π, 30)
    M = Manifold((θ, φ), basis; ranges=(θs, φs), embedding=embedding)
    fig = Figure()
    ax3 = Axis3(fig[1, 1])
    return (; θ, φ, embedding, basis, θs, φs, M, fig, ax3)
end


"""
Examples from the docs page reference/Constructors #tensor
"""
function ref_constructors_tensor()
    @ex begin
        Tensor([1, 3])         # (1, 0)-tensor — vector
        Tensor([2, -5]')       # (0, 1)-tensor — covector
        # Docs output:
        #   (1, 0)-Tensor:
        #   [1, 3]
        #       (:contra,)
        #   (0, 1)-Tensor:
        #   [2, -5]
        #       (:co,)
    end
    @ex begin
        Tensor([[0, -1]', [1, 0]'])    # (1, 1)-tensor — the 90° rotation map
        Tensor([[1, 0]', [0, 1]']')   # (0, 2)-tensor — the identity metric
        # Docs output:
        #   (1, 1)-Tensor:
        #   [0 -1; 1 0]
        #       (:contra, :co)
        #   (0, 2)-Tensor:
        #   [1 0; 0 1]
        #       (:co, :co)
    end
    @ex begin
        # The pattern extends to arbitrary rank
        Tensor([[[1, 0]', [0, 1]'], [[-1, 2]', [3, 0]']])
        # Docs output:
        #   (2, 1)-Tensor:
        #   [1 0; 0 1;;; -1 2; 3 0]
        #       (:contra, :contra, :co)
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
        #   ERROR: Basis elements must have the same variance
    end
end

"""
Examples from the docs page reference/Curvature #riemann
"""
function ref_curvature_riemann()
    @ex begin
        # Riemann tensor on the 2-sphere
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        riemann(M)
        # Docs output:
        #   (1, 3)-Tensor:
        #   Num[0.0 0.0; 0.0 -1.0;;; 0.0 sin(θ)^2; 0 0;;;; 0.0 0; 1.0 0;;; -(sin(θ)^2) 0; 0 0]
        #       (:contra, :co, :co, :co)
    end
    @ex begin
        # Flat space — the Riemann tensor vanishes
        e_flat = Basis([Tensor([1, 0]), Tensor([0, 1])])
        @variables x y
        F = Manifold((x, y), e_flat, simple=true)
        riemann(F)
        # Docs output:
        #   (1, 3)-Tensor:
        #   Num[0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0;;;; 0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0]
        #       (:contra, :co, :co, :co)
    end
end

"""
Examples from the docs page reference/Curvature #ricci
"""
function ref_curvature_ricci()
    @ex begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        ricci(M)
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[1.0 0.0; 0.0 sin(θ)^2]
        #       (:co, :co)
    end
    @ex begin
        # On the 2-sphere the Ricci tensor is proportional to the metric,
        # R_ij = K * g_ij, where K is the Gaussian curvature (here K = 1)
        metric(M)
        # Docs output:
        #   (0, 2)-Tensor:
        #   Real[1 0; 0 sin(θ)^2]
        #       (:co, :co)
    end
end

"""
Examples from the docs page reference/Curvature #ricci-scalar
"""
function ref_curvature_ricci_scalar()
    @ex begin
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
    @ex begin
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
    @ex begin
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
        #   (0, 2)-Tensor:
        #   Num[0.0 0.0; 0.0 0]
        #       (:co, :co)
    end
end

"""
Examples from the docs page reference/Derivatives #partial-differentiation
"""
function ref_derivatives_partial_differentiation()
    @ex begin
        @variables u v
        ∂ = PartialDerivative((u, v))

        # Differentiating a vector field yields a (1, 1)-tensor
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[v u; 0 2v]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
        # Differentiating a (1, 1)-tensor yields a (1, 2)-tensor
        A = Tensor([[u, 2v]', [3u, v^2]'])
        ∂[:k] * A[:i][:j]
        # Docs output:
        #   (1, 2)-Tensor:
        #   Num[1 0; 3 0;;; 0 2; 0 2v]
        #       (:contra, :co, :co)
        #       (:i,), (:j, :k)
    end
    @ex begin
        # Repeated index triggers contraction — yields the divergence
        ∂[:i] * X[:i]
        # Docs output:
        #   v + 2v
    end
end

"""
Examples from the docs page reference/Derivatives #covariant-differentiation
"""
function ref_derivatives_covariant_differentiation()
    @ex begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        ∇ = levicivita(M)

        # Covariant derivative of a vector field on the 2-sphere
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[cos(θ) 0; 0 cos(θ)]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
        # Covariant derivative of a covector field
        ω = Tensor([1, sin(θ)]')
        ∇[:i] * ω[:j]
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0 cos(θ); -cos(θ) 0]
        #       (:co, :co)
        #       (), (:j, :i)
    end
    @ex begin
        # Repeated index yields the covariant divergence
        ∇[:i] * X[:i]
        # Docs output:
        #   2cos(θ)
    end
end

"""
Examples from the docs page reference/Derivatives #exterior-differentiation
"""
function ref_derivatives_exterior_differentiation()
    @ex begin
        @variables x y z
        ∂ = PartialDerivative((x, y, z))
        d = ExteriorDerivative(∂)

        # Exterior derivative of a 1-form yields an antisymmetric 2-form
        α = Tensor([x^2, y*z, x]')
        d[:k] * α[:i]
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0.0 0.0 -1.0; 0.0 0.0 y; 1.0 -y 0.0]
        #       (:co, :co)
    end
    @ex begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)

        # Exterior derivative of a 0-form (scalar function) yields a 1-form
        f = u^2 * v
        d[:i] * f
        # Docs output:
        #   (0, 1)-Tensor:
        #   Num[2u*v, u^2]
        #       (:co,)
    end
    @ex begin
        # Nilpotency: applying d twice always yields the zero form
        @variables x y z
        d = ExteriorDerivative(PartialDerivative((x, y, z)))
        α = Tensor([x^2, y*z, x]')
        β = d[:k] * α[:i]
        d[:m] * β[:k, :i]
        # Docs output:
        #   (0, 3)-Tensor:
        #   Num[0.0 0.0 0.0; 0.0 0.0 0.0; 0.0 0.0 0.0]
        #       (:co, :co, :co)
    end
end

"""
Examples from the docs page reference/DifferentialOperators
"""
function ref_differential_operators()
    @ex begin
        @variables u v
        ∂ = PartialDerivative((u, v))

        # Differentiating a vector field — yields a (1, 1)-tensor
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[v u; 0 2v]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
        # Differentiating a covector field — yields a (0, 2)-tensor
        α = Tensor([u^2 * v, v + 2]')
        ∂[:i] * α[:j]
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[2u*v u^2; v 1]
        #       (:co, :co)
        #       (), (:i, :j)
    end
    @ex begin
        # Contracting with a matching index computes the divergence
        ∂[:i] * X[:i]
        # Docs output:
        #   v + 2v
    end
    @ex begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        ∂ = PartialDerivative((θ, φ))
        Γ = christoffel(M)
        ∇ = CovariantDerivative(Γ, ∂)

        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[cos(θ) 0; 0 cos(θ)]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
        # levicivita constructs the Levi-Civita connection in one step
        ∇ = levicivita(M)
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[cos(θ) 0; 0 cos(θ)]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
        # Contracting with a matching index computes the covariant divergence
        ∇[:i] * X[:i]
        # Docs output:
        #   2cos(θ)
    end
    @ex begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)

        # Exterior derivative of a 1-form yields a 2-form
        α = Tensor([u^2 * v, v + 2]')
        d[:i] * α[:j]
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0.0 u^2; -(u^2) 0.0]
        #       (:co, :co)
    end
    @ex begin
        # Exterior derivative of a 0-form (scalar) yields a 1-form
        @variables x y z
        ∂3 = PartialDerivative((x, y, z))
        d3 = ExteriorDerivative(∂3)
        f = x^2 * y + z
        d3[:i] * f
        # Docs output:
        #   (0, 1)-Tensor:
        #   Num[2x*y, x^2, 1]
        #       (:co,)
    end
    @ex begin
        # Nilpotency: applying d twice returns the zero form
        β = d[:i] * α[:j]
        d[:m] * β[:k, :l]
        # Docs output:
        #   (0, 3)-Tensor:
        #   Num[0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0]
        #       (:co, :co, :co)
    end
end

"""
Examples from the docs page reference/Geodesics #trajectory
"""
function ref_geodesics_trajectory()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        trajectory = solve_geodesic(M, [π/2, π/6], [0.5, -0.5], range(0.0, 15.0, 250))

        trajectory.positions[1]    # [π/2, π/6]
        trajectory.velocities[1]   # [0.5, -0.5]
    end
    return fig
end

"""
Examples from the docs page reference/Geodesics #solve-geodesic
"""
function ref_geodesics_solve_geodesic()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        x0 = [π/2, π/6]
        v0 = [0.5, -0.5]
        times = range(0.0, 15.0, 250)

        trajectory = solve_geodesic(M, x0, v0, times)
        plot_path!(ax3, M, trajectory, color=:lightblue, linewidth=5)
    end
    @ex begin
        # Plot tangent vectors along the geodesic
        plot_vectors!(ax3, M, trajectory, spacing=10,
            normalize=true, lengthscale=0.1, colormap=:viridis)
    end
    @ex begin
        # Geodesics in any dimension: flat space in spherical coordinates
        @variables r th ph
        M3 = Manifold((r, th, ph), Tensor([[1, 0, 0]', [0, r^2, 0]', [0, 0, (r*sin(th))^2]']'))
        solve_geodesic(M3, [1.0, π/2, 0.0], [0.0, 0.0, 1.0], 0:0.25:1)
    end
    return fig
end

"""
Examples from the docs page reference/GeometricObjects
"""
function ref_geometric_objects()
    @ex begin
        v = Tensor([1, 2])         # (1, 0)-tensor — vector
        ω = Tensor([-3, 1]')       # (0, 1)-tensor — covector
        # Docs output:
        #   (1, 0)-Tensor:
        #   [1, 2]
        #       (:contra,)
        #   (0, 1)-Tensor:
        #   [-3, 1]
        #       (:co,)
    end
    @ex begin
        L = Tensor([[4, -2]', [1, 1]'])   # (1, 1)-tensor — linear map
        g = Tensor([[2, 1]', [1, 2]']')  # (0, 2)-tensor — bilinear form
        # Docs output:
        #   (1, 1)-Tensor:
        #   [4 -2; 1 1]
        #       (:contra, :co)
        #   (0, 2)-Tensor:
        #   [2 1; 1 2]
        #       (:co, :co)
    end
    @ex begin
        # The pattern extends naturally to higher rank
        T = Tensor([[[1, 0]', [0, 1]'], [[-1, 2]', [3, 0]']])
        # Docs output:
        #   (2, 1)-Tensor:
        #   [1 0; 0 1;;; -1 2; 3 0]
        #       (:contra, :contra, :co)
    end
    @ex begin
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, 1])
        ])
        e[2]   # Integer indexing returns the element
        # Docs output:
        #   (1, 0)-Tensor:
        #   [0, 1]
        #       (:contra,)
    end
    @ex begin
        # Symbolic indexing and contraction yields a linear combination
        v = Tensor([3, -2])
        v[:i] * e[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [3, -2]
        #       (:contra,)
    end
    @ex begin
        # Two bases can be combined with the tensor product
        ε = Basis([Tensor([1, 0]'), Tensor([0, 1]')])
        e ⊗ ε
        # Docs output:
        #   Basis(Tensor{Int64, 2}[...], (:contra, :co))
    end
end

"""
Examples from the docs page reference/HodgeStar #hodge-star
"""
function ref_hodge_star_hodge_star()
    @ex begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        g = metric(e)
        ⋆ = HodgeStar(g)

        # In 2D, a 1-form maps to a 1-form
        α = Tensor([3, -1]')
        ⋆(α)
        # Docs output:
        #   (0, 1)-Tensor:
        #   Num[1.0, 3.0]
        #       (:co,)
    end
    @ex begin
        # In 3D, a 1-form maps to a 2-form
        e3 = Basis([Tensor([1,0,0]), Tensor([0,1,0]), Tensor([0,0,1])])
        star3 = HodgeStar(metric(e3))
        β = Tensor([1, 0, 0]')
        star3(β)
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0.0 0.0 0.0; 0.0 0.0 1.0; 0.0 -1.0 0.0]
        #       (:co, :co)
    end
    @ex begin
        # A top-form maps to a scalar
        ω = Tensor([[0, 1]', [-1, 0]']')   # A 2-form in 2D
        ⋆(ω)
        # Docs output:
        #   -1.0
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #addition
"""
function ref_indexed_arithmetic_addition()
    @ex begin
        v = Tensor([1, 2])
        w = Tensor([-3, 1])
        v[:i] + w[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [-2, 3]
        #       (:contra,)
        #       (:i,), ()
    end
    @ex begin
        A = Tensor([[2, 1], [-3, 1]])
        B = Tensor([[0, -1], [4, 2]])
        A[:i, :j] + B[:i, :j]
        # Docs output:
        #   (2, 0)-Tensor:
        #   [2 0; 1 3]
        #       (:contra, :contra)
        #       (:i, :j), ()
    end
    @throws begin
        # Mismatched index labels raise an error
        A[:i, :j] + B[:i, :k]
        # Docs output:
        #   ERROR: Contravariant indices must match
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #subtraction
"""
function ref_indexed_arithmetic_subtraction()
    @ex begin
        v = Tensor([1, 2])
        w = Tensor([-3, 1])
        v[:i] - w[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [4, 1]
        #       (:contra,)
        #       (:i,), ()
    end
    @ex begin
        L = Tensor([[4, -2], [3, 3]])
        M = Tensor([[0, 0], [-3, 3]])
        L[:i, :j] - M[:i, :j]
        # Docs output:
        #   (2, 0)-Tensor:
        #   [4 -2; 6 0]
        #       (:contra, :contra)
        #       (:i, :j), ()
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #multiplication-scalar
"""
function ref_indexed_arithmetic_multiplication_scalar()
    @ex begin
        g = Tensor([[2, -1]', [0, 2]']')
        2 * g[:i, :j]
        # Docs output:
        #   (0, 2)-Tensor:
        #   [4 -2; 0 4]
        #       (:co, :co)
        #       (), (:i, :j)
    end
    @ex begin
        v = Tensor([3, -1])
        v[:i] * -1
        # Docs output:
        #   (1, 0)-Tensor:
        #   [-3, 1]
        #       (:contra,)
        #       (:i,), ()
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #division-scalar
"""
function ref_indexed_arithmetic_division_scalar()
    @ex begin
        A = Tensor([[1, 2]', [3, -1]'])
        A[:i][:j] / 2
        # Docs output:
        #   (1, 1)-Tensor:
        #   [0.5 1.0; 1.5 -0.5]
        #       (:contra, :co)
        #       (:i,), (:j,)
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #multiplication-kronecker-delta
"""
function ref_indexed_arithmetic_multiplication_kronecker_delta()
    @ex begin
        δ = KroneckerDelta()
        L = Tensor([[1, 2]', [3, -1]'])
        L[:i][:j] * δ[:j, :k]   # Relabels covariant index j → k
        # Docs output:
        #   (1, 1)-Tensor:
        #   [1 2; 3 -1]
        #       (:contra, :co)
        #       (:i,), (:k,)
    end
    @ex begin
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
    @ex begin
        ε = LeviCivita()

        # Signed area of the parallelogram spanned by v and u
        v = Tensor([1, 2])
        u = Tensor([-2, 1])
        v[:i] * u[:j] * ε[:i, :j]
        # Docs output:
        #   5
    end
    @ex begin
        # Cross product in 3D — free index k becomes the output
        a = Tensor([1, 0, 0])
        b = Tensor([0, 1, 0])
        a[:i] * b[:j] * ε[:i, :j, :k]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [0, 0, 1]
        #       (:contra,)
        #       (:k,), ()
    end
end

"""
Examples from the docs page reference/IndexedArithmetic #multiplication-linearalgebra
"""
function ref_indexed_arithmetic_multiplication_linearalgebra()
    @ex begin
        # Covector acting on a vector — full contraction returns a scalar
        v = Tensor([2, -1])
        ω = Tensor([-2, 3]')
        v[:i] * ω[:i]
        # Docs output:
        #   -7
    end
    @ex begin
        # Linear map acting on a vector — one free index remains
        L = Tensor([[2, 1]', [-1, 3]'])
        v = Tensor([1, 2])
        L[:i][:j] * v[:j]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [4, 5]
        #       (:contra,)
        #       (:i,), ()
    end
    @ex begin
        # No matching indices — returns the tensor product
        v = Tensor([1, 2])
        w = Tensor([3, 4])
        v[:i] * w[:j]
        # Docs output:
        #   (2, 0)-Tensor:
        #   [3 4; 6 8]
        #       (:contra, :contra)
        #       (:i, :j), ()
    end
end

"""
Examples from the docs page reference/Indexing #tensor-getindex
"""
function ref_indexing_tensor_getindex()
    @ex begin
        v = Tensor([1, 2])
        v[1]       # Integer index — returns a scalar
        v[:i]      # Symbolic index — returns an IndexedTensor
        # Docs output:
        #   1
        #   (1, 0)-Tensor:
        #   [1, 2]
        #       (:contra,)
        #       (:i,), ()
    end
    @ex begin
        # Mixed-variance tensors use two brackets
        L = Tensor([[4, -2]', [1, 1]'])
        L[1][:j]   # Slice first contravariant index, label covariant
        L[:i][:j]  # Label both — returns an IndexedTensor
        # Docs output:
        #   (0, 1)-Tensor:
        #   [4, -2]
        #       (:co,)
        #       (), (:j,)
        #   (1, 1)-Tensor:
        #   [4 -2; 1 1]
        #       (:contra, :co)
        #       (:i,), (:j,)
    end
    @ex begin
        # Repeating the same symbol in both brackets triggers a self-contraction
        A = Tensor([[3, 1]', [-2, 4]'])
        A[:i][:i]   # trace
        # Docs output:
        #   7
    end
end

"""
Examples from the docs page reference/Indexing #partial-indexed-tensor-getindex
"""
function ref_indexing_partial_indexed_tensor_getindex()
    @ex begin
        L = Tensor([[4, -2]', [1, 1]'])
        L[:i][:j]   # Second bracket labels the covariant index
        # Docs output:
        #   (1, 1)-Tensor:
        #   [4 -2; 1 1]
        #       (:contra, :co)
        #       (:i,), (:j,)
    end
    @ex begin
        # Matching symbols across brackets trigger an implicit self-contraction
        L[:i][:i]   # trace
        # Docs output:
        #   5
    end
    @ex begin
        # Integer in the second bracket slices the covariant index
        L[:i][1]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [4, 1]
        #       (:contra,)
        #       (:i,), ()
    end
end

"""
Examples from the docs page reference/Indexing #kronecker-delta-getindex
"""
function ref_indexing_kronecker_delta_getindex()
    @ex begin
        δ = KroneckerDelta()
        δ[1, 1]    # Equal integer indices → 1
        δ[1, 2]    # Unequal integer indices → 0
        # Docs output:
        #   1
        #   0
    end
    @ex begin
        # Symbolic indexing returns an IndexedKroneckerDelta
        L = Tensor([[4, -2]', [1, 1]'])
        L[:i][:j] * δ[:i, :k]   # Relabels contravariant index i → k
        # Docs output:
        #   (1, 1)-Tensor:
        #   [4 -2; 1 1]
        #       (:contra, :co)
        #       (:k,), (:j,)
    end
end

"""
Examples from the docs page reference/Indexing #levi-civita-getindex
"""
function ref_indexing_levi_civita_getindex()
    @ex begin
        ε = LeviCivita()
        ε[1, 2]    # Even permutation → 1
        ε[2, 1]    # Odd permutation → -1
        ε[1, 1]    # Repeated index → 0
        # Docs output:
        #   1
        #   -1
        #   0
    end
    @ex begin
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
    @ex begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]   # Jacobian of X
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[v u; 0 2v]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
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
    @ex begin
        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        ∇ = levicivita(Manifold((θ, φ), e))
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]   # Covariant Jacobian of X
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[cos(θ) 0; 0 cos(θ)]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
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
    @ex begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)
        α = Tensor([u^2 * v, v + 2]')
        d[:i] * α[:j]   # Exterior derivative of a 1-form
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0.0 u^2; -(u^2) 0.0]
        #       (:co, :co)
    end
    @ex begin
        # Nilpotency: d² = 0 — β's indices must be freshly labeled,
        # distinct from d's next index, since β carries no memory of :i, :j
        β = d[:i] * α[:j]
        d[:m] * β[:k, :l]
        # Docs output:
        #   (0, 3)-Tensor:
        #   Num[0.0 0.0; 0.0 0.0;;; 0.0 0.0; 0.0 0.0]
        #       (:co, :co, :co)
    end
end

"""
Examples from the docs page reference/Indexing #basis-getindex
"""
function ref_indexing_basis_getindex()
    @ex begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        e[2]    # Integer index — returns the second basis element
        # Docs output:
        #   (1, 0)-Tensor:
        #   [0, 1]
        #       (:contra,)
    end
    @ex begin
        # Symbolic indexing and contraction yields a linear combination
        v = Tensor([3, -2])
        v[:i] * e[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [3, -2]
        #       (:contra,)
    end
    @ex begin
        # Works with non-orthogonal bases too
        e = Basis([Tensor([1, 1]), Tensor([0, 1])])
        v = Tensor([2, -1])
        v[:i] * e[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [2, 1]
        #       (:contra,)
    end
end

"""
Examples from the docs page reference/MetricConnections #manifold
"""
function ref_metric_connections_manifold()
    @ex begin
        @variables θ φ
        embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
        basis = Basis([
            Tensor([cos(φ)*cos(θ), sin(φ)*cos(θ), -sin(θ)]),
            Tensor([-sin(φ)*sin(θ), cos(φ)*sin(θ), 0])
        ])
        M = Manifold((θ, φ), basis; ranges=(range(0, π, 50), range(0, 2π, 50)),
            embedding=embedding)
    end
    @ex begin
        # A flat chart, plotted in the plane
        @variables u v
        F = Manifold((u, v); ranges=(range(-2, 2, 30), range(-2, 2, 30)))
    end
end

"""
Examples from the docs page reference/MetricConnections #metric
"""
function ref_metric_connections_metric()
    @ex begin
        # Euclidean metric from the standard Cartesian basis
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        metric(e)
        # Docs output:
        #   (0, 2)-Tensor:
        #   [1 0; 0 1]
        #       (:co, :co)
    end
    @ex begin
        # Non-trivial metric from an oblique basis
        e = Basis([Tensor([1, 2]), Tensor([3, -1])])
        metric(e)
        # Docs output:
        #   (0, 2)-Tensor:
        #   [5 1; 1 10]
        #       (:co, :co)
    end
    @ex begin
        # Minkowski metric for special relativity
        η = metric(
            Basis([
                Tensor([1, 0, 0, 0]),
                Tensor([0, 1, 0, 0]),
                Tensor([0, 0, 1, 0]),
                Tensor([0, 0, 0, 1])
            ]),
            minkowski
        )
        # Docs output:
        #   (0, 2)-Tensor:
        #   [-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]
        #       (:co, :co)
    end
end

"""
Examples from the docs page reference/MetricConnections #inv
"""
function ref_metric_connections_inv()
    @ex begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        g = metric(e)
        𝔤 = inv(g)   # (0, 2) → (2, 0)
        # Docs output:
        #   (2, 0)-Tensor:
        #   [1 0; 0 1]
        #       (:contra, :contra)
    end
    @ex begin
        # Using the inverse metric to raise an index
        ω = Tensor([1, -2]') ⊗ Tensor([-3, 2]')   # A (0, 2)-tensor
        𝔤[:i, :j] * ω[:i, :k]
        # Docs output:
        #   (1, 1)-Tensor:
        #   [1 -2; -3 2]
        #       (:contra, :co)
        #       (:j,), (:k,)
    end
end

"""
Examples from the docs page reference/MetricConnections #minkowski
"""
function ref_metric_connections_minkowski()
    @ex begin
        # Constructing the Minkowski metric with (-, +, +, +) convention
        η = metric(
            Basis([
                Tensor([1, 0, 0, 0]),
                Tensor([0, 1, 0, 0]),
                Tensor([0, 0, 1, 0]),
                Tensor([0, 0, 0, 1])
            ]),
            minkowski
        )
        # Docs output:
        #   (0, 2)-Tensor:
        #   [-1 0 0 0; 0 1 0 0; 0 0 1 0; 0 0 0 1]
        #       (:co, :co)
    end
    @ex begin
        # Switching to (+ , -, -, -) convention
        η = metric(
            Basis([
                Tensor([1, 0, 0, 0]),
                Tensor([0, 1, 0, 0]),
                Tensor([0, 0, 1, 0]),
                Tensor([0, 0, 0, 1])
            ]),
            (A, B) -> minkowski(A, B, true)
        )
        # Docs output:
        #   (0, 2)-Tensor:
        #   [1 0 0 0; 0 -1 0 0; 0 0 -1 0; 0 0 0 -1]
        #       (:co, :co)
    end
end

"""
Examples from the docs page reference/MetricConnections #christoffel
"""
function ref_metric_connections_christoffel()
    @ex begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e, simple=true)
        Γ = christoffel(M)
        # Docs output:
        #   (1, 2)-Tensor:
        #   Num[0.0 0.0; 0.0 -sin(θ)*cos(θ);;; 0.0 cos(θ)/sin(θ); cos(θ)/sin(θ) 0.0]
        #       (:contra, :co, :co)
    end
    @ex begin
        # Passing to CovariantDerivative to build the connection
        ∂ = PartialDerivative((θ, φ))
        ∇ = CovariantDerivative(Γ, ∂)
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[cos(θ) 0; 0 cos(θ)]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
end

"""
Examples from the docs page reference/MetricConnections #levi-civita
"""
function ref_metric_connections_levi_civita()
    @ex begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        ∇ = levicivita(M)

        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[cos(θ) 0; 0 cos(θ)]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
        # Covariant divergence of a vector field
        ∇[:i] * X[:i]
        # Docs output:
        #   2cos(θ)
    end
end

"""
Examples from the docs page reference/MetricConnections #lie
"""
function ref_metric_connections_lie()
    @ex begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([u, v])
        Y = Tensor([u^2, -v + 2])
        lie(X, Y, ∂)
        # Docs output:
        #   (1, 0)-Tensor:
        #   Num[u^2, -2]
        #       (:contra,)
    end
    @ex begin
        # The Lie bracket is antisymmetric: [X, Y] = -[Y, X]
        lie(Y, X, ∂)
        # Docs output:
        #   (1, 0)-Tensor:
        #   Num[-(u^2), 2]
        #       (:contra,)
    end
    @ex begin
        # A vector field commutes with itself
        lie(X, X, ∂, simple=true)
        # Docs output:
        #   (1, 0)-Tensor:
        #   Num[0, 0]
        #       (:contra,)
    end
end

"""
Examples from the docs page reference/ParallelTransport #solve-parallel-transport
"""
function ref_parallel_transport_solve_parallel_transport()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        # Transport along a straight line in coordinates: a constant direction
        x0 = [π/4, 3π/4]
        v0 = [0.5, 2]
        w0 = [2, 0]
        times = range(0.0, 1.5, 15)

        trajectory = solve_parallel_transport(M, t -> x0 + v0 * t, w0, times)

        # The path's velocity in red, the transported vector in blue
        plot_vectors!(ax3, M, trajectory, which=:velocities, lengthscale=0.1, colormap=:reds)
        plot_vectors!(ax3, M, trajectory, lengthscale=0.1, colormap=:ice)
    end
    @ex begin
        # Around a closed loop. The angle between the initial and final
        # transported vector reveals the holonomy of the loop
        path(t) = [0.4cos(t) + 0.1sin(2t) + π/3, 0.7sin(t) - 2π/3]
        times = range(0.0, 2π, 101)

        trajectory = solve_parallel_transport(M, path, [2.0, -1.0], times;
            abstol=1e-5, reltol=1e-5)

        plot_path!(ax3, M, trajectory, color=:lightblue)
        plot_vectors!(ax3, M, trajectory, spacing=5, lengthscale=0.1, colormap=:ice)
    end
    @ex begin
        # Along a geodesic: pass the solved geodesic as the path
        geodesic = solve_geodesic(M, [π/2, π/6], [0.5, -0.5], range(0.0, 5.0, 50))
        transported = solve_parallel_transport(M, geodesic, [1.0, 0.0], range(0.0, 5.0, 50))
    end
    return fig
end

"""
Examples from the docs page reference/ScalarFields #plot-scalar
"""
function ref_scalar_fields_plot_scalar()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        # On a flat chart
        fig = Figure()
        ax = Axis(fig[1, 1])

        @variables u v
        F = Manifold((u, v); ranges=(range(-π, π, 100), range(-π, π, 100)))
        plot_scalar!(ax, F, sin(u) * cos(v))
    end
    @ex begin
        # The Ricci scalar on the sphere
        fig = Figure()
        ax3 = Axis3(fig[1, 1])

        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        M = Manifold((θ, φ), e; ranges=(range(0.01, π, 50), range(0, 2π, 50)),
            embedding=(u, v) -> [cos(v)*sin(u), sin(v)*sin(u), cos(u)])

        R = simplify(ricci_scalar(M))
        s = plot_scalar!(ax3, M, R, colormap=:RdBu, colorrange=(0, 2))
        Colorbar(fig[1, 2], s)
    end
    @ex begin
        # An arbitrary symbolic field on the sphere
        plot_scalar!(ax3, M, sin(θ)^2 * cos(φ), colormap=:plasma)
    end
    return fig
end

"""
Examples from the docs page reference/SimplifyEvaluate #simplify
"""
function ref_simplify_evaluate_simplify()
    @ex begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e)
        R = ricci(M)
        simplify(R)
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[1.0 0.0; 0.0 sin(θ)^2]
        #       (:co, :co)
    end
    @ex begin
        # Also works on IndexedTensors
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([sin(u)^2 + cos(u)^2, v])
        simplify(∂[:i] * X[:j])
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[1 0; 0 1]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex begin
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
    @ex begin
        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        R = ricci(Manifold((θ, φ), e, simple=true))

        # Evaluate at the equator θ = π/2
        substitute(R, Dict(θ => π/2))
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[1.0 0.0; 0.0 1.0]
        #       (:co, :co)
    end
    @ex begin
        # Partial substitution — result is still symbolic
        @variables u v
        X = Tensor([u^2 * v, sin(u) + v])
        substitute(X, Dict(u => 2))
        # Docs output:
        #   (1, 0)-Tensor:
        #   Num[4v, sin(2) + v]
        #       (:contra,)
    end
    @ex begin
        # Replacing a variable with an expression
        substitute(X, Dict(u => v^2))
        # Docs output:
        #   (1, 0)-Tensor:
        #   Num[v^6, sin(v^2) + v]
        #       (:contra,)
    end
end

"""
Examples from the docs page reference/SimplifyEvaluate #evaluate
"""
function ref_simplify_evaluate_evaluate()
    @ex begin
        @variables θ φ
        e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
        R = ricci(Manifold((θ, φ), e, simple=true))

        # Numerically evaluate the Ricci tensor at θ = π/4
        evaluate(R, Dict(θ => π/4, φ => 0.0))
        # Docs output:
        #   (0, 2)-Tensor:
        #   [1.0 0.0; 0.0 0.5]
        #       (:co, :co)
    end
    @ex begin
        # Also works on scalars
        @variables u v
        f = u^2 * sin(v)
        evaluate(f, Dict(u => 3.0, v => π/6))
        # Docs output:
        #   4.5
    end
    @ex begin
        # Useful for sampling a symbolic vector field at a point
        X = Tensor([sin(θ) * cos(φ), cos(θ)])
        evaluate(X, Dict(θ => π/3, φ => π/4))
        # Docs output:
        #   (1, 0)-Tensor:
        #   [0.6124, 0.5]
        #       (:contra,)
    end
end

"""
Examples from the docs page reference/SpecialObjects
"""
function ref_special_objects()
    @ex begin
        δ = KroneckerDelta()
        L = Tensor([[1, 2]', [3, 4]'])
        L[:i][:j] * δ[:i, :k]   # Relabels the contravariant index i → k
        # Docs output:
        #   (1, 1)-Tensor:
        #   [1 3; 2 4]
        #       (:contra, :co)
        #       (:k,), (:j,)
    end
    @ex begin
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
    @ex begin
        # The identity tensor is δ made concrete in a fixed dimension —
        # contracting it with itself recovers that dimension
        Id = Tensor([[1, 0]', [0, 1]'])
        Id[:i][:i]
        # Docs output:
        #   2
    end
    @ex begin
        ε = LeviCivita()

        # 2D: computes the signed area of the parallelogram spanned by v and u
        v = Tensor([2, 1])
        u = Tensor([-3, 2])
        v[:i] * u[:j] * ε[:i, :j]
        # Docs output:
        #   7
    end
    @ex begin
        # 3D: computes the cross product of two vectors
        a = Tensor([1, 0, 0])
        b = Tensor([0, 1, 0])
        a[:i] * b[:j] * ε[:i, :j, :k]
        # Docs output:
        #   (0, 1)-Tensor:
        #   [0, 0, 1]
        #       (:co,)
        #       (), (:k,)
    end
    @ex begin
        # Antisymmetry means repeated indices always cancel to 0,
        # so crossing a vector with itself vanishes
        v[:i] * v[:j] * ε[:i, :j]
        # Docs output:
        #   0
    end
    @ex begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        g = metric(e)
        ⋆ = HodgeStar(g)

        α = Tensor([3, -1]')   # A 1-form in 2D → maps to a 1-form
        ⋆(α)
        # Docs output:
        #   (0, 1)-Tensor:
        #   Num[1, 3.0]
        #       (:co,)
    end
    @ex begin
        # In 3D, a 1-form maps to a 2-form
        e3 = Basis([Tensor([1,0,0]), Tensor([0,1,0]), Tensor([0,0,1])])
        ⋆₃ = HodgeStar(metric(e3))
        β = Tensor([1, 0, 0]')
        ⋆₃(β)
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0.0 0.0 0.0; 0.0 0.0 1; 0.0 -1.0 0.0]
        #       (:co, :co)
    end
    @ex begin
        # A top-form (n-form) maps to a scalar
        ω = Tensor([[0, 1]', [-1, 0]']')   # A 2-form in 2D
        ⋆(ω)
        # Docs output:
        #   1
    end
end

"""
Examples from the docs page reference/SurfacesPaths #plot-surface
"""
function ref_surfaces_paths_plot_surface()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        fig = Figure()
        ax3 = Axis3(fig[1, 1])

        plot_surface!(ax3, M)
    end
    @ex begin
        # Custom colormap and transparency
        plot_surface!(ax3, M, colormap=:plasma, alpha=0.8)
    end
    return fig
end

"""
Examples from the docs page reference/SurfacesPaths #plot-path
"""
function ref_surfaces_paths_plot_path()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        λ(t) = [t - π/2, t^3 - 3t + π/2]
        times = range(0, 1.0, 50)
        plot_path!(ax3, M, λ, times)
    end
    @ex begin
        # A closed path — a latitude circle at θ = π/3
        circle(t) = [π/3, t]
        plot_path!(ax3, M, circle, range(0, 2π, 100),
            color=:red, linewidth=3)
    end
    return fig
end

"""
Examples from the docs page reference/SymmetryDuality #symmetrize
"""
function ref_symmetry_duality_symmetrize()
    @ex begin
        A = Tensor([[2, 1], [-3, 1]])
        symmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor:
        #   [2.0 -1.0; -1.0 1.0]
        #       (:contra, :contra)
    end
    @ex begin
        # Symmetrizing an already symmetric tensor leaves it unchanged
        g = Tensor([[1, 0]', [0, 1]']')
        symmetrize(g[:i, :j], :i, :j)
        # Docs output:
        #   (0, 2)-Tensor:
        #   [1.0 0.0; 0.0 1.0]
        #       (:co, :co)
    end
    @throws begin
        # Mixing contravariant and covariant indices raises an error
        L = Tensor([[2, 1]', [-3, 1]'])
        symmetrize(L[:i][:j], :i, :j)
        # Docs output:
        #   ERROR: Indices not all the same variance
    end
end

"""
Examples from the docs page reference/SymmetryDuality #antisymmetrize
"""
function ref_symmetry_duality_antisymmetrize()
    @ex begin
        A = Tensor([[2, 1], [-3, 1]])
        antisymmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor:
        #   [0.0 2.0; -2.0 0.0]
        #       (:contra, :contra)
    end
    @ex begin
        # Antisymmetrizing an already antisymmetric tensor leaves it unchanged
        ω = Tensor([[0, 1]', [-1, 0]']')
        antisymmetrize(ω[:i, :j], :i, :j)
        # Docs output:
        #   (0, 2)-Tensor:
        #   [0.0 1.0; -1.0 0.0]
        #       (:co, :co)
    end
    @ex begin
        # Antisymmetrizing a symmetric tensor yields zero
        g = Tensor([[1, 0]', [0, 1]']')
        antisymmetrize(g[:i, :j], :i, :j)
        # Docs output:
        #   (0, 2)-Tensor:
        #   [0.0 0.0; 0.0 0.0]
        #       (:co, :co)
    end
end

"""
Examples from the docs page reference/SymmetryDuality #dual-basis
"""
function ref_symmetry_duality_dual_basis()
    @ex begin
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        ϵ = dual_basis(e)   # Dual of a vector basis is a covector basis
        # Docs output:
        #   Basis(Tensor{Float64, 1}[...], (:co,))
    end
    @ex begin
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
    @ex begin
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

"""
Examples from the docs page reference/TensorOperations #tensor-product
"""
function ref_tensor_operations_tensor_product()
    @ex begin
        v = Tensor([1, 2])
        w = Tensor([3, 5]')
        v ⊗ w   # (1, 0) ⊗ (0, 1) → (1, 1)
        # Docs output:
        #   (1, 1)-Tensor:
        #   [3 5; 6 10]
        #       (:contra, :co)
    end
    @ex begin
        # Tensor products can be chained for higher rank
        α = Tensor([2, 3]')
        L = v ⊗ w
        L ⊗ α ⊗ v
        # Docs output:
        #   (2, 2)-Tensor:
        #   [6 10; 12 20;;; 9 15; 18 30;;;; 12 20; 24 40;;; 18 30; 36 60]
        #       (:contra, :co, :co, :contra)
    end
    @ex begin
        # Also defined on bases — produces a higher-rank basis
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        ε = Basis([Tensor([1, 0]'), Tensor([0, 1]')])
        e ⊗ ε
        # Docs output:
        #   Basis(Tensor{Int64, 2}[...], (:contra, :co))
    end
end

"""
Examples from the docs page reference/TensorOperations #wedge-product
"""
function ref_tensor_operations_wedge_product()
    @ex begin
        α = Tensor([1, -2]')
        β = Tensor([3, 1]')
        α ∧ β   # 1-form ∧ 1-form → 2-form
        # Docs output:
        #   (0, 2)-Tensor:
        #   [0.0 7.0; -7.0 0.0]
        #       (:co, :co)
    end
    @ex begin
        # Anticommutativity: α ∧ β = -(β ∧ α)
        β ∧ α
        # Docs output:
        #   (0, 2)-Tensor:
        #   [0.0 -7.0; 7.0 0.0]
        #       (:co, :co)
    end
    @ex begin
        # Wedging a form with itself always yields zero
        α ∧ α
        # Docs output:
        #   (0, 2)-Tensor:
        #   [0.0 0.0; 0.0 0.0]
        #       (:co, :co)
    end
end

"""
Examples from the docs page reference/TensorOperations #dot-product
"""
function ref_tensor_operations_dot_product()
    @ex begin
        v = Tensor([1, 2])
        w = Tensor([3, -1])
        v ⋅ w
        # Docs output:
        #   1
    end
    @ex begin
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
        #   ERROR: A and B must both be (1, 0) tensors
    end
end

"""
Examples from the docs page reference/VectorFields #vectors
"""
function ref_vector_fields_vectors()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        # On a flat chart
        fig = Figure()
        ax = Axis(fig[1, 1])

        @variables u v
        F = Manifold((u, v); ranges=(range(-2, 2, 30), range(-2, 2, 30)))

        # Rotational vector field
        X = Tensor([-v, u])
        plot_vectors!(ax, F, X, spacing=2, normalize=true)
    end
    @ex begin
        # On the sphere
        fig = Figure()
        ax3 = Axis3(fig[1, 1])

        @variables θ φ
        basis = Basis([
            Tensor([cos(φ)*cos(θ), sin(φ)*cos(θ), -sin(θ)]),
            Tensor([-sin(φ)*sin(θ), cos(φ)*sin(θ), 0])
        ])
        M = Manifold((θ, φ), basis; ranges=(range(0.1, π-0.1, 20), range(0, 2π, 20)),
            embedding=(u, v) -> [cos(v)*sin(u), sin(v)*sin(u), cos(u)])

        X = Tensor([sin(θ), cos(φ)])
        plot_vectors!(ax3, M, X,
            spacing=2, normalize=true, lengthscale=0.15, colormap=:magma)
    end
    @ex begin
        # The gradient of a scalar function as a vector field
        f = sin(θ)^2 * cos(φ)
        ∂ = PartialDerivative((θ, φ))
        gradf = (∂[:i] * f).tensor
        plot_vectors!(ax3, M, gradf, spacing=2, lengthscale=0.1, colormap=:RdBu)
    end
    return fig
end

"""
Examples from the docs page reference/VectorFields #vectors-positions
"""
function ref_vector_fields_vectors_positions()
    (; θ, φ, embedding, basis, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        # Visualizing parallel-transported vectors alongside initial vectors
        x0 = [π/4, 3π/4]
        v0 = [0.5, 2]
        w0 = [2, 0]
        times = range(0.0, 1.5, 15)
        trajectory = solve_parallel_transport(M, t -> x0 + v0 * t, w0, times)

        # The vectors of a Trajectory are plotted directly: the path's velocity
        # in red, and the transported vectors in blue
        plot_vectors!(ax3, M, trajectory, which=:velocities, lengthscale=0.1, colormap=:reds)
        plot_vectors!(ax3, M, trajectory, lengthscale=0.1, colormap=:ice)

        # Individual vectors can also be given at explicit positions
        positions = trajectory.positions
        plot_vectors!(ax3, M, positions, [Tensor(w0) for _ in positions], lengthscale=0.1)
    end
    @ex begin
        # Plotting tangent vectors along a geodesic
        x0 = [π/2, π/6]
        v0 = [0.5, -0.5]
        times = range(0.0, 5.0, 20)
        trajectory = solve_geodesic(M, x0, v0, times)
        plot_vectors!(ax3, M, trajectory,
            normalize=true, lengthscale=0.1, colormap=:viridis)
    end
    return fig
end

"""
Internal. The list of ref example functions
"""
const EXAMPLES_REF = [
    ref_constructors_tensor,
    ref_constructors_basis,
    ref_curvature_riemann,
    ref_curvature_ricci,
    ref_curvature_ricci_scalar,
    ref_curvature_einstein,
    ref_derivatives_partial_differentiation,
    ref_derivatives_covariant_differentiation,
    ref_derivatives_exterior_differentiation,
    ref_differential_operators,
    ref_geodesics_trajectory,
    ref_geodesics_solve_geodesic,
    ref_geometric_objects,
    ref_hodge_star_hodge_star,
    ref_indexed_arithmetic_addition,
    ref_indexed_arithmetic_subtraction,
    ref_indexed_arithmetic_multiplication_scalar,
    ref_indexed_arithmetic_division_scalar,
    ref_indexed_arithmetic_multiplication_kronecker_delta,
    ref_indexed_arithmetic_multiplication_levi_civita,
    ref_indexed_arithmetic_multiplication_linearalgebra,
    ref_indexing_tensor_getindex,
    ref_indexing_partial_indexed_tensor_getindex,
    ref_indexing_kronecker_delta_getindex,
    ref_indexing_levi_civita_getindex,
    ref_indexing_partial_derivative_getindex,
    ref_indexing_covariant_derivative_getindex,
    ref_indexing_exterior_derivative_getindex,
    ref_indexing_basis_getindex,
    ref_metric_connections_manifold,
    ref_metric_connections_metric,
    ref_metric_connections_inv,
    ref_metric_connections_minkowski,
    ref_metric_connections_christoffel,
    ref_metric_connections_levi_civita,
    ref_metric_connections_lie,
    ref_parallel_transport_solve_parallel_transport,
    ref_scalar_fields_plot_scalar,
    ref_simplify_evaluate_simplify,
    ref_simplify_evaluate_substitute,
    ref_simplify_evaluate_evaluate,
    ref_special_objects,
    ref_surfaces_paths_plot_surface,
    ref_surfaces_paths_plot_path,
    ref_symmetry_duality_symmetrize,
    ref_symmetry_duality_antisymmetrize,
    ref_symmetry_duality_dual_basis,
    ref_tensor_operations_tensor_product,
    ref_tensor_operations_wedge_product,
    ref_tensor_operations_dot_product,
    ref_vector_fields_vectors,
    ref_vector_fields_vectors_positions,
]

"""
Every ref example function, one per docs page or entry

Run one by name, such as `ref_curvature_riemann()`. Plotting examples return the Figure.
"""
examples_ref() = foreach(f -> println(nameof(f)), EXAMPLES_REF)

"""
Run every ref example, reporting any that error, and return the names of the failures
"""
function run_ref()
    failed = Symbol[]
    for f in EXAMPLES_REF
        try
            redirect_stdout(devnull) do
                f()
            end
        catch err
            push!(failed, nameof(f))
            println("FAILED ", nameof(f), ": ", sprint(showerror, err)[1:min(end, 200)])
        end
    end
    println(length(EXAMPLES_REF) - length(failed), " of ", length(EXAMPLES_REF), " examples ran")
    return failed
end
