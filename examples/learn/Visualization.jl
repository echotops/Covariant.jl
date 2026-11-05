isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

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
