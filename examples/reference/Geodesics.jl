isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/Geodesics #trajectory
"""
function ref_geodesics_trajectory()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
        M3 = Manifold((r, th, ph), Tensor([1 0 0; 0 r^2 0; 0 0 (r*sin(th))^2], :co, :co))
        solve_geodesic(M3, [1.0, π/2, 0.0], [0.0, 0.0, 1.0], 0:0.25:1)
    end
    return fig
end
