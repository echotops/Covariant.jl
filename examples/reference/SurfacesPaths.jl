isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/SurfacesPaths #plot-surface
"""
function ref_surfaces_paths_plot_surface()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
Examples from the docs page reference/SurfacesPaths #embedding-basis
"""
function ref_surfaces_paths_embedding_basis()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
    @ex result begin
        embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
        embedding_basis(embedding, [π/2, 0.0])
        # Docs output:
        #   2-element Vector{Vector{Float64}}:
        #    [6.123233995736766e-17, 0.0, -1.0]
        #    [0.0, 1.0, -0.0]
    end
    @ex begin
        # A Manifold built from an embedding finds these vectors itself,
        # so vectors can be plotted without writing out a basis
        @variables θ φ
        M = Manifold((θ, φ), embedding;
            ranges=(range(0.1, π-0.1, 20), range(0, 2π, 20)))
        plot_vectors!(ax3, M, Tensor([sin(θ), cos(φ)]), spacing=2, normalize=true)
    end
    return fig
end
