"""
Covariant.jl

This Julia package allows for tensor algebra and calculus using the Einstein summation convention and
symbolic indexing. It also includes tools for differential geometry, like the metric tensor, Christoffel
symbols, and covariant derivative.

# Types
Tensor{T, R} - An arbitrary rank R (m, n)-tensor of a type T
KroneckerDelta - The Kronecker Delta δ
LeviCivita - The Levi-Civita Symbol ε
PartialDerivative{N} - The partial derivative operator ∂ on N coordinates
CovariantDerivative - The covariant derivative operator ∇
ExteriorDerivative - The exterior derivative operator d
HodgeStar - The Hodge Star operator

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
∧ - Wedge product for (0, p)-tensors
symmetrize() - Symmetrize a tensor
antisymmetrize() - Antisymmetrize a tensor
dual_basis() - Find the dual basis of a basis
**Geometry**
metric() - Metric tensor from a basis
inv() - Invert a (2, 0) or (0, 2)-tensor
minkowski() - Find the Minkowski norm on two vectors
christoffel() - Compute the Levi-Civita Connection coefficients
lie() - Compute the Lie bracket of two vectors
riemann() - Compute the Riemann Curvature Tensor
ricci() - Compute the Ricci Curvature Tensor
ricci_scalar() - Compute the Ricci Scalar
einstein() - Compute the Einstein Tensor

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
julia> metric((u, v))
Tensor{Int64, 2}([5 -1; -1 10], (:co, :co))
```

echotops
3/22/2026
"""
module Covariant

using LinearAlgebra
using Symbolics
using Combinatorics

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
export Tensor, Basis
export KroneckerDelta, LeviCivita
export PartialDerivative, CovariantDerivative, ExteriorDerivative, HodgeStar

# Algebra
export ⊗, ∧
export ⋅, norm
export symmetrize, antisymmetrize, dual_basis

# Geometry
export metric, christoffel, levicivita, lie
export riemann, ricci, ricci_scalar, einstein
export minkowski

# Symbolic
export evaluate

# Visualization
export surface_2dembed!, scalar_2d!, scalar_2dembed!, path_2dembed!, vector_2dembed!, vectors_2d!, vectors_2dembed!

# Solver
export geodesic!, parallel_transport!, parallel_transport_path!
export solve_geodesic, solve_parallel_transport, solve_parallel_transport_path

end