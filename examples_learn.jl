using Covariant
using Symbolics
using DifferentialEquations
using GLMakie

"""
Internal. Statements in an example that are not displayed: assignments, definitions, and plot calls
"""
const _quiet = (:(=), :function, :for, :while, :if, :let, :using, :import, :local, :global, :const, :macro, :(+=), :(-=))
_shows(s) = !(s isa Expr && (s.head in _quiet || (s.head == :macrocall && string(s.args[1]) == "@variables") ||
                             (s.head == :call && s.args[1] in (:plot_surface!, :plot_scalar!, :plot_vectors!, :plot_path!))))
_show(x) = (x === nothing || x isa Makie.AbstractPlot || x isa Makie.Figure) ? nothing : (display(x); nothing)

"""
Internal. Whether a statement is an assignment, rather than a function definition
"""
_assigns(s) = s isa Expr && s.head == :(=) && !(s.args[1] isa Expr && s.args[1].head == :call)

"""
Internal. Runs a block of statements in the calling function's scope, displaying the value of each one
like a REPL would. With `result`, the docs show the block's output, so its last assignment is displayed too,
and with `results`, where the docs show several outputs, every assignment is
"""
macro ex(mode, block)
    return _ex(block, mode in (:result, :results), mode === :results)
end

macro ex(block)
    return _ex(block, false, false)
end

function _ex(block, result, every)
    stmts = filter(s -> !(s isa LineNumberNode), block.args)
    every = every && all(_assigns, stmts)
    out = Expr(:block)
    for s in block.args
        if s isa LineNumberNode
            push!(out.args, s)
        elseif _shows(s) || (result && _assigns(s) && (every || s === last(stmts)))
            push!(out.args, :(_show($(esc(s)))))
        else
            push!(out.args, esc(s))
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
    θs = range(0.1, π-0.1, 30)
    φs = range(0, 2π, 30)
    M = Manifold((θ, φ), embedding; ranges=(θs, φs))
    fig = Figure()
    ax3 = Axis3(fig[1, 1])
    return (; θ, φ, embedding, θs, φs, M, fig, ax3)
end


"""
Examples from the docs page learn/DifferentialForms
"""
function learn_differential_forms()
    @ex result begin
        α = Tensor([1, -2]')
        β = Tensor([3, 1]')
        γ = α ∧ β
        # Docs output:
        #   (0, 2)-Tensor:
        #   [0.0 7.0; -7.0 0.0]
        #       (:co, :co)
    end
    @ex result begin
        α ∧ α
        # Docs output:
        #   (0, 2)-Tensor:
        #   [0.0 0.0; 0.0 0.0]
        #       (:co, :co)
    end
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        d = ExteriorDerivative(∂)
        α = Tensor([u^2 * v, v + 2]')
        d[:i] * α[:j]
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0.0 u^2; -(u^2) 0.0]
        #       (:co, :co)
    end
    @ex result begin
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, 1])
        ])
        g = metric(e)
        ⋆ = HodgeStar(g)
        ω = Tensor([2, 1]')
        ⋆(ω)
        # Docs output:
        #   (0, 1)-Tensor:
        #   Num[-1.0, 2.0]
        #       (:co,)
    end
end

"""
Examples from the docs page learn/DifferentialGeometry
"""
function learn_differential_geometry()
    @ex result begin
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, 1])
        ])
        g = metric(e)
        # Docs output:
        #   (0, 2)-Tensor:
        #   [1 0; 0 1]
        #       (:co, :co)
    end
    @ex result begin
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
        #     (:co, :co)
    end
    @ex result begin
        𝔤 = inv(g)
        ω = Tensor([1, -2]') ⊗ Tensor([-3, 2]') # A (0, 2)-tensor
        𝔤[:i, :j] * ω[:i, :k]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[-3 2; 6 -4]
        #       (:contra, :co)
        #       (:j,), (:k,)
    end
    @ex result begin
        @variables u v
        ∂ = PartialDerivative((u, v))
        X = Tensor([u * v, v^2 - 1])
        ∂[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[v u; 0 2v]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex result begin
        @variables θ φ
        e = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(θ)])
        ])
        M = Manifold((θ, φ), e) # The coordinates, with the metric from the basis
        ∂ = PartialDerivative((θ, φ))
        Γ = christoffel(M) # The Christoffel symbols of the Levi-Civita connection
        ∇ = CovariantDerivative(Γ, ∂) # Alternatively ∇ = levicivita(M)
        X = Tensor([sin(θ), 0])
        ∇[:i] * X[:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   Num[cos(θ) 0; 0 cos(θ)]
        #       (:contra, :co)
        #       (:j,), (:i,)
    end
    @ex result begin
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
    @ex result begin
        ricci(M)
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[1.0 0.0; 0.0 sin(θ)^2]
        #       (:co, :co)
    end
    @ex result begin
        ricci_scalar(M)
        # Docs output:
        #   2
    end
    @ex result begin
        einstein(M)
        # Docs output:
        #   (0, 2)-Tensor:
        #   Num[0.0 0.0; 0.0 0]
        #       (:co, :co)
    end
    @ex result begin
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
end

"""
Examples from the docs page learn/GettingStarted
"""
function learn_getting_started()
    @ex result begin
        L = Tensor([[2, 1]', [-1, 3]'])
        v = Tensor([1, 2])
        L[:i][:j] * v[:j]  # Matrix-vector product
        # Docs output:
        #   (1, 0)-Tensor:
        #   [4, 5]
        #       (:contra,)
        #       (:i,), ()
    end
    @ex result begin
        @variables u v
        basis = Basis([
            Tensor([1, 0]),
            Tensor([0, sin(u)])
        ])
        riemann(Manifold((u, v), basis, simple=true))
        # Docs output:
        #   (1, 3)-Tensor:
        #   Num[0.0 0.0; 0.0 -1.0;;; 0.0 sin(u)^2; 0 0;;;; 0.0 0; 1.0 0;;; -(sin(u)^2) 0; 0 0]
        #       (:contra, :co, :co, :co)
    end
end

"""
Examples from the docs page learn/Solver
"""
function learn_solver()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        x0 = [π/2, π/6]
        v0 = [0.5, -0.5]
        times = range(0.0, 15.0, 250)
        trajectory = solve_geodesic(M, x0, v0, times)
        plot_path!(ax3, M, trajectory)
    end
    @ex begin
        x0 = [π/4, 3π/4]
        v0 = [0.5, 2]
        w0 = [2,  0]
        times = range(0.0, 1.5, 15)
        trajectory = solve_parallel_transport(M, t -> x0 + v0 * t, w0, times)
        plot_vectors!(ax3, M, trajectory, which=:velocities)
        plot_vectors!(ax3, M, trajectory)
    end
    @ex begin
        path(t) = [0.4cos(t) + 0.1sin(2t) + π/3, 0.7sin(t) - 2π/3]
        times = range(0.0, 2π, 101)
        w0 = [2, -1]
        trajectory = solve_parallel_transport(M, path, w0, times)
        plot_path!(ax3, M, trajectory)
        plot_vectors!(ax3, M, trajectory, spacing=5)
    end
    return fig
end

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
        #   (0, 2)-Tensor:
        #   Num[1.0 0.0; 0.0 sin(θ)^2]
        #       (:co, :co)
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
        #   (0, 2)-Tensor:
        #   Num[1.0 0.0; 0.0 sin(1.5707963267948966)^2]
        #       (:co, :co)
    end
    @ex result begin
        @variables u v
        X = Tensor([u^2 * v, sin(u) + v])
        substitute(X, Dict(u => v^2)) # Partial, and replacing with an expression
        # Docs output:
        #   (1, 0)-Tensor:
        #   Num[v^5, sin(v^2) + v]
        #       (:contra,)
    end
    @ex result begin
        # Numerically evaluate the Ricci tensor at θ = π/4
        evaluate(R, Dict(θ => π/4, φ => 0.0))
        # Docs output:
        #   (0, 2)-Tensor:
        #   [1.0 0.0; 0.0 0.5]
        #       (:co, :co)
    end
    @ex result begin
        f = u^2 * sin(v)
        evaluate(f, Dict(u => 3.0, v => π/6))
        # Docs output:
        #   4.5
    end
end

"""
Examples from the docs page learn/TensorAlgebra
"""
function learn_tensor_algebra()
    @ex result begin
        v = Tensor([1, 2])
        w = Tensor([-3, 1])
        v[:i] + w[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [-2, 3]
        #       (:contra,)
        #       (:i,), ()
    end
    @ex result begin
        L = Tensor([[4, -2], [3, 3]])
        M = Tensor([[0, 0], [-3, 3]])
        L[:i, :j] - M[:i, :j]
        # Docs output:
        #   (2, 0)-Tensor:
        #   [4 -2; 6 0]
        #       (:contra, :contra)
        #       (:i, :j), ()
    end
    @ex result begin
        g = Tensor([[2, -1]', [0, 2]']')
        2 * g[:i, :j]
        # Docs output:
        #   (0, 2)-Tensor:
        #   [4 -2; 0 4]
        #       (:co, :co)
        #       (), (:i, :j)
    end
    @ex result begin
        v = Tensor([2, -1])
        ω = Tensor([-2, 3]')
        v[:i] * ω[:i]   # The dot product v · ω
        # Docs output:
        #   -7
    end
    @ex result begin
        A = Tensor([[2, -3], [-4, -1]]')
        B = Tensor([[-1, 1], [2, 2]]')
        A[:i][:j] * B[:j][:k]   # Matrix multiplication
        # Docs output:
        #   (1, 1)-Tensor:
        #   [-6 -4; 2 -8]
        #       (:contra, :co)
        #       (:i,), (:k,)
    end
    @ex result begin
        A = Tensor([[2, 1], [-3, -1]]')
        A[:i][:i]   # tr(A)
        # Docs output:
        #   1
    end
    @ex result begin
        A = Tensor([[2, 1], [-3, 1]])
        symmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor:
        #   [2.0 -1.0; -1.0 1.0]
        #       (:contra, :contra)
    end
    @ex result begin
        A = Tensor([[2, 1], [-3, 1]])
        antisymmetrize(A[:i, :j], :i, :j)
        # Docs output:
        #   (2, 0)-Tensor:
        #   [0.0 2.0; -2.0 0.0]
        #       (:contra, :contra)
    end
    @ex result begin
        v = Tensor([2, -1])
        w = Tensor([3, 4])
        L = v ⊗ w   # The outer product vwᵀ
        # Docs output:
        #   (2, 0)-Tensor:
        #   [6 8; -3 -4]
        #       (:contra, :contra)
    end
    @ex result begin
        α = Tensor([2, 3]')
        L ⊗ α ⊗ v
        # Docs output:
        #   (3, 1)-Tensor:
        #   [24 32; -12 -16;;; 36 48; -18 -24;;;; -12 -16; 6 8;;; -18 -24; 9 12]
        #       (:contra, :contra, :co, :contra)
    end
    @ex result begin
        e = Basis([
            Tensor([1, 1]),
            Tensor([0, 1])
        ])
        v = Tensor([2, -1])
        v[:i] * e[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [2, 1]
        #     (:contra,)
    end
    @ex result begin
        ϵ = dual_basis(e)
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
end

"""
Examples from the docs page learn/Tensors
"""
function learn_tensors()
    @ex begin
        v = Tensor([1, 2]) # A vector
        ω = Tensor([-3, 1]') # A covector
    end
    @ex begin
        L = Tensor([[4, -2]', [1, 1]']) # A linear map
        g = Tensor([[2, 1]', [1, 2]']') # A bilinear form
    end
    @ex result begin
        L = Tensor([[4, -2]', [1, 1]'])
        # Docs output:
        #   (1, 1)-Tensor:
        #   [4 -2; 1 1]
        #       (:contra, :co)
    end
    @ex result begin
        v = Tensor([1, 2])
        v[1]
        # Docs output:
        #   1
    end
    @ex result begin
        L = Tensor([[4, -2]', [1, 1]'])
        L[1][2]
        # Docs output:
        #   -2
    end
    @ex result begin
        v[:i]
        # Docs output:
        #   (1, 0)-Tensor:
        #   [1, 2]
        #       (:contra,)
        #       (:i,), ()
    end
    @ex result begin
        L[:i][:j]
        # Docs output:
        #   (1, 1)-Tensor:
        #   [4 -2; 1 1]
        #       (:contra, :co)
        #       (:i,), (:j,)
    end
    @ex result begin
        L[2][:k]
        # Docs output:
        #   (0, 1)-Tensor:
        #   [1, 1]
        #       (:co,)
        #       (), (:k,)
    end
end

"""
Examples from the docs page learn/Visualization
"""
function learn_visualization()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
    @ex begin
        fig = Figure()
        ax3 = Axis3(fig[1,1])
        # Unit sphere embedding in 3D
        embedding(u, v) = [
            cos(v)*sin(u),
            sin(v)*sin(u),
            cos(u)
        ]
        # Coordinates and their ranges
        @variables θ, φ
        θs = range(0, π, 50)
        φs = range(0, 2π, 50)
        M = Manifold((θ, φ), embedding; ranges=(θs, φs))
    end
    @ex begin
        plot_surface!(ax3, M)
    end
    @ex begin
        λ(t) = [t - π/2, t^3 - 3t + π/2]
        times = range(0, 1.0, 50)
        plot_path!(ax3, M, λ, times)
    end
    @ex begin
        R = ricci_scalar(M)
        plot_scalar!(ax3, M, R)
    end
    @ex begin
        X = Tensor([sin(θ), cos(φ)])
        plot_vectors!(ax3, M, X, spacing=2, normalize=true)
    end
    return fig
end

"""
Internal. The list of learn example functions
"""
const EXAMPLES_LEARN = [
    learn_differential_forms,
    learn_differential_geometry,
    learn_getting_started,
    learn_solver,
    learn_symbolic,
    learn_tensor_algebra,
    learn_tensors,
    learn_visualization,
]

"""
Every learn example function, one per docs page or entry

Run one by name, such as `learn_tensor_algebra()`. Plotting examples return the Figure.
"""
examples_learn() = foreach(f -> println(nameof(f)), EXAMPLES_LEARN)

"""
Run every learn example, reporting any that error, and return the names of the failures
"""
function run_learn()
    failed = Symbol[]
    for f in EXAMPLES_LEARN
        try
            redirect_stdout(devnull) do
                f()
            end
        catch err
            push!(failed, nameof(f))
            println("FAILED ", nameof(f), ": ", sprint(showerror, err)[1:min(end, 200)])
        end
    end
    println(length(EXAMPLES_LEARN) - length(failed), " of ", length(EXAMPLES_LEARN), " examples ran")
    return failed
end
