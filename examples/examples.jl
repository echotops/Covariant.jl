include(joinpath(@__DIR__, "helpers.jl"))

include(joinpath(@__DIR__, "learn", "DifferentialForms.jl"))
include(joinpath(@__DIR__, "learn", "DifferentialGeometry.jl"))
include(joinpath(@__DIR__, "learn", "GettingStarted.jl"))
include(joinpath(@__DIR__, "learn", "Solver.jl"))
include(joinpath(@__DIR__, "learn", "Symbolic.jl"))
include(joinpath(@__DIR__, "learn", "TensorAlgebra.jl"))
include(joinpath(@__DIR__, "learn", "Tensors.jl"))
include(joinpath(@__DIR__, "learn", "Visualization.jl"))

include(joinpath(@__DIR__, "reference", "Constructors.jl"))
include(joinpath(@__DIR__, "reference", "CoordinateChanges.jl"))
include(joinpath(@__DIR__, "reference", "Curvature.jl"))
include(joinpath(@__DIR__, "reference", "Derivatives.jl"))
include(joinpath(@__DIR__, "reference", "DifferentialOperators.jl"))
include(joinpath(@__DIR__, "reference", "Geodesics.jl"))
include(joinpath(@__DIR__, "reference", "GeometricObjects.jl"))
include(joinpath(@__DIR__, "reference", "HodgeStar.jl"))
include(joinpath(@__DIR__, "reference", "IndexedArithmetic.jl"))
include(joinpath(@__DIR__, "reference", "Indexing.jl"))
include(joinpath(@__DIR__, "reference", "MetricConnections.jl"))
include(joinpath(@__DIR__, "reference", "ParallelTransport.jl"))
include(joinpath(@__DIR__, "reference", "ScalarFields.jl"))
include(joinpath(@__DIR__, "reference", "SimplifyEvaluate.jl"))
include(joinpath(@__DIR__, "reference", "SpecialObjects.jl"))
include(joinpath(@__DIR__, "reference", "SurfacesPaths.jl"))
include(joinpath(@__DIR__, "reference", "SymmetryDuality.jl"))
include(joinpath(@__DIR__, "reference", "TensorOperations.jl"))
include(joinpath(@__DIR__, "reference", "VectorFields.jl"))

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

"""
Internal. The list of ref example functions
"""
const EXAMPLES_REF = [
    ref_constructors_tensor,
    ref_constructors_basis,
    ref_coordinate_changes_transform,
    ref_coordinate_changes_transform_basis,
    ref_curvature_riemann,
    ref_curvature_ricci,
    ref_curvature_ricci_scalar,
    ref_curvature_einstein,
    ref_curvature_gaussian_curvature,
    ref_curvature_sectional_curvature,
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
    ref_surfaces_paths_embedding_basis,
    ref_symmetry_duality_symmetrize,
    ref_symmetry_duality_antisymmetrize,
    ref_symmetry_duality_dual_basis,
    ref_tensor_operations_tensor_product,
    ref_tensor_operations_wedge_product,
    ref_tensor_operations_dot_product,
    ref_tensor_operations_trace,
    ref_tensor_operations_determinant,
    ref_tensor_operations_interior_product,
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
