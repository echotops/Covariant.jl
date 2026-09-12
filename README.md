# Covariant.jl

A tensor and differential geometry library for Julia that stays true to mathematical notation and the Einstein summation convention.

**[Read the docs →](https://echotops.github.io/Covariant.jl/)**  for a full walkthrough of every feature, plus a complete API reference.

## Installation

Covariant.jl isn't yet registered, so install it directly from GitHub:

```julia
julia> using Pkg
julia> Pkg.add("https://github.com/echotops/Covariant.jl")
```

or by pressing `]` and running

```julia
pkg> add https://github.com/echotops/Covariant.jl
```

Then import it with

```julia
julia> using Covariant
```

## Quick Start

Indexing a tensor with symbols and contracting repeated indices, the same way you would on paper:

```julia
julia> L = Tensor([[2, 1]', [-1, 3]'])
julia> v = Tensor([1, 2])
julia> L[:i][:j] * v[:j]  # matrix-vector product
(1, 0)-Tensor:
[4, 5]
  (:contra,)
  (:i,), ()
```

Symbolic coordinates keep derivatives and curvature exact, not numerically approximated. Here's the Riemann curvature tensor on a 2-sphere:

```julia
julia> using Symbolics
julia> @variables θ φ
julia> basis = Basis([
    Tensor([1, 0]),
    Tensor([0, sin(θ)])
])
julia> riemann((θ, φ), basis, simple=true)
(1, 3)-Tensor:
Num[0.0 0.0; 0.0 -1.0;;; 0.0 sin(θ)^2; 0 0;;;; 0.0 0; 1.0 0;;; -(sin(θ)^2) 0; 0 0]
  (:contra, :co, :co, :co)
```

## Features

**Algebra** — tensors and bases of tensors, with contraction, scaling, addition, the tensor product, wedge product for differential forms, dot product for vectors, and symmetrization/antisymmetrization, all driven by Einstein-notation indexing.

**Geometry** — the metric, connection coefficients, and Lie bracket, plus the Riemann, Ricci, and Einstein tensors and the Ricci scalar.

**Calculus** — the partial, covariant, and exterior derivatives, and the Hodge star, for tensor and differential form calculus.

**Symbolic** — symbolic tensor components via Symbolics.jl, with `simplify`, `substitute`, and `evaluate` for turning exact symbolic results into concrete numbers.

**Visualization & solving** — plot surfaces, scalar fields, and vector fields with GLMakie, and solve the geodesic and parallel transport equations with DifferentialEquations.jl. These are optional package extensions — load `GLMakie` and/or `DifferentialEquations` alongside Covariant to enable them.

## Core Types & Operators

`Tensor{T, R}` — an arbitrary rank `R` `(m, n)`-tensor of type `T`

`Basis` — an ordered collection of tensors forming a frame for a vector space

`⊗` — tensor product · `∧` — wedge product · `⋅` — dot product · `*` — contraction, following repeated indices

For the complete API — every type, function, and keyword argument, with runnable examples — see the **[Reference docs](https://echotops.github.io/Covariant.jl/reference/geometric-objects)**.
