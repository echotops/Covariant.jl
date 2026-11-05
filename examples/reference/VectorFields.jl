isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/VectorFields #vectors
"""
function ref_vector_fields_vectors()
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
        embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
        M = Manifold((θ, φ), embedding; ranges=(range(0.1, π-0.1, 20), range(0, 2π, 20)))

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
    (; θ, φ, embedding, θs, φs, M, fig, ax3) = _plot_context()
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
