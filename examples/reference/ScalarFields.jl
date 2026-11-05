isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/ScalarFields #plot-scalar
"""
function ref_scalar_fields_plot_scalar()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
        embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
        M = Manifold((θ, φ), embedding;
            ranges=(range(0.01, π, 50), range(0, 2π, 50)), simple=true)

        R = ricci_scalar(M)
        s = plot_scalar!(ax3, M, R, colormap=:RdBu, colorrange=(0, 2))
        Colorbar(fig[1, 2], s)
    end
    @ex begin
        # An arbitrary symbolic field on the sphere
        plot_scalar!(ax3, M, sin(θ)^2 * cos(φ), colormap=:plasma)
    end
    return fig
end
