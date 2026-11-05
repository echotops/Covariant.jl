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

const _helpers_loaded = true
