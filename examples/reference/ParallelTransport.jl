isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/ParallelTransport #solve-parallel-transport
"""
function ref_parallel_transport_solve_parallel_transport()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
