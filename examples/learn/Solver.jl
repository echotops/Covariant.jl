isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

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
