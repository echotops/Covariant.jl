"""
Covariant.jl

This Julia package allows for tensor algebra and calculus using the Einstein summation convention and
symbolic indexing. It also includes tools for differential geometry, like the metric tensor, Christoffel
symbols, and covariant derivative.

# Types
Tensor{T, R} - An arbitrary rank R (m, n)-tensor of a type T
Basis - A collection of tensors, such as a vector basis
KroneckerDelta - The Kronecker Delta δ
LeviCivita - The Levi-Civita Symbol ε
PartialDerivative{N} - The partial derivative operator ∂ on N coordinates
CovariantDerivative - The covariant derivative operator ∇
ExteriorDerivative - The exterior derivative operator d
HodgeStar - The Hodge Star operator
Manifold{N} - A manifold in a coordinate chart, with a metric and optionally an embedding and plot ranges
Trajectory - A solved path on a manifold, with its velocities and transported vectors

# Functions
**General**
Tensor() - Constructor for Tensor{T, R}
getindex() - Einstein convention indexing
**Algebra**
⊗ - Tensor product
* - Tensor scaling and contraction
+ - Tensor addition
- - Tensor subtraction
⋅ - Dot product for (1, 0)-tensors
norm() - Norm of a (1, 0)-tensor
∧ - Wedge product for (0, p)-tensors
symmetrize() - Symmetrize a tensor
antisymmetrize() - Antisymmetrize a tensor
dual_basis() - Find the dual basis of a basis
**Geometry**
Manifold() - Construct a manifold from coordinates and an embedding, metric, or basis
metric() - Metric tensor from a basis or manifold
inverse_metric() - Inverse metric of a manifold
inv() - Invert a (2, 0) or (0, 2)-tensor
minkowski() - Find the Minkowski norm on two vectors
christoffel() - Compute the Levi-Civita Connection coefficients
levicivita() - The Levi-Civita Connection as a covariant derivative
lie() - Compute the Lie bracket of two vectors
riemann() - Compute the Riemann Curvature Tensor
ricci() - Compute the Ricci Curvature Tensor
ricci_scalar() - Compute the Ricci Scalar
einstein() - Compute the Einstein Tensor
**Embeddings**
embedding_basis() - The tangent basis vectors of an embedding at a point, by automatic differentiation
**Symbolic**
simplify() - Simplify the symbolic components of a tensor
evaluate() - Evaluate symbolic components at a point
lambdify() - Compile symbolic components into a fast numeric function
**Solver** (requires DifferentialEquations)
solve_geodesic() - Solve the geodesic equation on a manifold
solve_parallel_transport() - Parallel transport a vector along a path
**Visualization** (requires GLMakie)
plot_surface!() - Plot an embedded surface
plot_scalar!() - Plot a scalar field
plot_vectors!() - Plot a vector field, or vectors along a trajectory
plot_path!() - Plot a path or trajectory

# Examples
Defining a tensor
```
julia> L = Tensor([[1, 2]', [3, -1]'])
Tensor{Int64, 2}([1 2; 3 -1], (:contra, :co))
```
Tensor contraction
```
julia> v = Tensor([4, -2]); w = Tensor([1, 1]')
julia> v[:i] * w[:i]
2
```
Finding the metric tensor
```
julia> v = Tensor([3, 1]); u = Tensor([-1, 2])
julia> metric(Basis([u, v]))
Tensor{Int64, 2}([5 -1; -1 10], (:co, :co))
```
Curvature of the unit sphere
```
julia> @variables θ φ
julia> M = Manifold((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]))
julia> simplify(ricci_scalar(M))
2
```

echotops
3/22/2026
"""
module Covariant

using LinearAlgebra
using Symbolics
using Combinatorics
using ForwardDiff

import Base: getindex, show, +, -, *, /, inv
import LinearAlgebra: ⋅

include("types.jl")
include("constructors.jl")
include("indexing.jl")
include("utils.jl")
include("algebra.jl")
include("calculus.jl")
include("geometry.jl")
include("symbolic.jl")
include("visualization.jl")
include("solver.jl")

# Core types
export Tensor, Basis, Manifold
export KroneckerDelta, LeviCivita
export PartialDerivative, CovariantDerivative, ExteriorDerivative, HodgeStar

# Algebra
export ⊗, ∧
export ⋅, norm
export symmetrize, antisymmetrize, dual_basis

# Geometry
export metric, inverse_metric, christoffel, levicivita, lie
export riemann, ricci, ricci_scalar, einstein
export minkowski
export embedding_basis

# Symbolic
export evaluate, lambdify

# Visualization
export plot_surface!, plot_scalar!, plot_vectors!, plot_path!

# Solver
export Trajectory
export solve_geodesic, solve_parallel_transport

end