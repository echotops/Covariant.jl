using Test
using Covariant
using Symbolics

@testset "Covariant.jl" begin

    @testset "Algebra" begin
        @testset "Construction" begin
            @test Tensor([1, 2]).variance == (:contra,)
            @test Tensor([1, 2]').variance == (:co,)
            @test Tensor([1 2; 3 4]).variance == (:contra, :co)
            @test Tensor([1 2; 3 4], :co, :co).variance == (:co, :co)
            @test Tensor([1 2; 3 4], :co, :co).data == [1 2; 3 4]
            @test Tensor(reshape(1:8, 2, 2, 2), :co, :contra, :co).variance == (:co, :contra, :co)
            @test_throws ErrorException Tensor(reshape(1:8, 2, 2, 2))
            @test_throws ErrorException Tensor([1 2; 3 4], :co)
            @test_throws ErrorException Tensor([1 2; 3 4], :up, :down)
            @test_throws ErrorException Tensor([[1, 2]', [3, 4]'])
        end

        @testset "Trace and Determinant" begin
            A = Tensor([2 -3; 4 -1])

            @test tr(A) == 1
            @test det(A) == 10
            @test tr(A) isa Int
            @test det(A) isa Int
            @test_throws ErrorException tr(Tensor([1 2; 3 4], :co, :co))
            @test_throws ErrorException det(Tensor([1, 2]))
        end

        @testset "Interior Product" begin
            X = Tensor([2, 3])

            @test interior(X, Tensor([5, 7]')) == 31
            @test interior(X, Tensor([0 1; -1 0], :co, :co)).data == [-3, 2]
            @test interior(X, Tensor([0 1; -1 0], :co, :co)).variance == (:co,)
            @test_throws ErrorException interior(Tensor([1, 2]'), Tensor([5, 7]'))
        end

        @testset "Exact Arithmetic" begin
            g = Tensor([2 0; 0 4], :co, :co)

            @test inv(g).data == [1//2 0; 0 1//4]
            @test inv(Tensor([1 0; 0 1], :co, :co)).data isa Matrix{Int}
            @test symmetrize(Tensor([1 3; -2 5], :contra, :contra)[:i, :j], :i, :j).data == [1 1//2; 1//2 5]
            @test (Tensor([2, 1]') ∧ Tensor([-3, -2]')).data isa Matrix{Int}
        end

        @testset "Contraction" begin
            v = Tensor([1, 2])
            w = Tensor([3, 5]')
            L = Tensor([2 1; -1 3])

            @test v[:i] * w[:i] == 13
            @test (L[:i][:j] * v[:j]).tensor.data == [4, 5]
            @test L[:i][:i] == 5
        end

        @testset "Tensor Product" begin
            v = Tensor([1, 2])
            w = Tensor([3, 5]')

            @test (v ⊗ w).data == [3 5; 6 10]
            @test (v ⊗ w).variance == (:contra, :co)
        end

        @testset "Addition and Subtraction" begin
            L = Tensor([2 1; -1 3])
            M = Tensor([-3 4; 5 5])

            @test (L[:i][:j] + M[:i][:j]).tensor.data == [-1 5; 4 8]
            @test (L[:i][:j] - M[:i][:j]).tensor.data == [5 -3; -6 -2]
        end

        @testset "Scaling" begin
            L = Tensor([2 1; -1 3])

            @test (2 * L[:i][:j]).tensor.data == [4 2; -2 6]
        end

        @testset "Symmetrize and Antisymmetrize" begin
            L = Tensor([2 -1; 5 3], :contra, :contra)

            @test symmetrize(L[:i, :j], :i, :j).data == [2.0 2.0; 2.0 3.0]
            @test antisymmetrize(L[:i, :j], :i, :j).data == [0.0 -3.0; 3.0 0.0]
        end

        @testset "Wedge Product" begin
            ω = Tensor([2, 1]')
            α = Tensor([-3, -2]')

            @test (ω ∧ α).data == [0.0 -1.0; 1.0 0.0]
            @test (ω ∧ α).variance == (:co, :co)
        end
    end

    @testset "Geometry" begin
        @testset "Metric" begin
            basis = Basis([Tensor([1, 2]), Tensor([3, -1])])

            @test metric(basis).data == [5 1; 1 10]
            @test metric(basis).variance == (:co, :co)
        end

        @testset "Christoffel" begin
            @variables x y
            basis = Basis([Tensor([1, 0]), Tensor([0, 1])])

            @test all(iszero, christoffel(Manifold((x, y), basis)).data)
        end

        @testset "Riemann" begin
            @variables u v
            basis = Basis([Tensor([1, 0]), Tensor([0, sin(u)])])
            R = simplify(riemann(Manifold((u, v), basis)))

            @test isequal(R.data[2, 2, 1, 1], -1)
            @test isequal(R.data[1, 2, 2, 1], sin(u)^2)
            @test isequal(R.data[2, 1, 1, 2], 1)
            @test isequal(R.data[1, 1, 2, 2], -(sin(u)^2))
        end

        @testset "Manifold" begin
            @variables θ φ
            g = Tensor([1 0; 0 sin(θ)^2], :co, :co)
            M = Manifold((θ, φ), g)

            @test metric(M) === M.metric
            @test christoffel(M) === christoffel(M)
            @test isequal(simplify(ricci_scalar(M)), 2)

            basis = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
            N = Manifold((θ, φ), basis; simple=true)
            @test isequal(ricci_scalar(N), 2)
            @test isequal(simplify(riemann(M)).data, simplify(riemann(Manifold((θ, φ), basis))).data)
            @test_throws ErrorException Manifold((θ, φ), Tensor([1, 2]))
            @test isequal(ricci_scalar(Manifold((θ, φ))), 0)

            sphere(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
            E = Manifold((θ, φ), sphere; simple=true)
            @test isequal(E.metric.data[1, 1], 1)
            @test isequal(simplify(E.metric.data[2, 2]), sin(θ)^2)
            @test isequal(ricci_scalar(E), 2)
            @test E.embedding === sphere
            @test_throws ErrorException Manifold((θ, φ), g; ranges=(1:2,))
            @test Manifold((θ, φ), basis; ranges=(1:2, 1:3)).basis === basis
        end

        @testset "Embedding Basis" begin
            embedding(u, v) = [cos(v)*sin(u), sin(v)*sin(u), cos(u)]
            e = embedding_basis(embedding, [π/3, π/4])

            @test e[1] ≈ [cos(π/4)*cos(π/3), sin(π/4)*cos(π/3), -sin(π/3)]
            @test e[2] ≈ [-sin(π/4)*sin(π/3), cos(π/4)*sin(π/3), 0]
        end

        @testset "Coordinate Transformation" begin
            @variables x y r θ
            polar = (sqrt(x^2 + y^2), atan(y, x))
            back = (r*cos(θ), r*sin(θ))
            at(expr) = evaluate(Num(expr), Dict(x => 3.0, y => 4.0))
            # Written in r and θ, Symbolics can't take √(r²) to r, so check these values at a point
            polar_at(expr) = evaluate(Num(expr), Dict(r => 2.0, θ => 0.7))

            # A radial vector field is (r, 0) in polar coordinates
            X = transform(Tensor([x, y]), (x, y), polar)
            @test at(X.data[1]) ≈ 5 && abs(at(X.data[2])) < 1e-12
            # dx = cos θ dr - r sin θ dθ
            ω = transform(Tensor([1, 0]'), (x, y), polar; to=(r, θ), inverse=back, simple=true)
            @test ω.variance == (:co,)
            @test polar_at(ω.data[1]) ≈ cos(0.7) && polar_at(ω.data[2]) ≈ -2.0 * sin(0.7)
            # The Euclidean metric is diag(1, r²)
            g = transform(Tensor([1 0; 0 1], :co, :co), (x, y), polar; to=(r, θ), inverse=back, simple=true)
            @test polar_at(g.data[1, 1]) ≈ 1 && polar_at(g.data[2, 2]) ≈ 4 && abs(polar_at(g.data[1, 2])) < 1e-12
            # Trace and determinant of an endomorphism are invariant
            L = Tensor([2 -1; 5 3])
            Lp = transform(L, (x, y), polar)
            @test at(tr(Lp)) ≈ 5 && at(det(Lp)) ≈ 11
            # Basis vectors change opposite to components
            e = transform(Basis([Tensor([1, 0]), Tensor([0, 1])]), (x, y), polar; to=(r, θ), inverse=back, simple=true)
            @test e.variance == (:contra,)
            @test polar_at(e.elements[1].data[1]) ≈ cos(0.7) && polar_at(e.elements[2].data[2]) ≈ 2.0 * cos(0.7)
            @test_throws ErrorException transform(Tensor([x, y]), (x, y), (x, y, x))
            @test_throws ErrorException transform(Tensor([x, y]), (x, y), polar; inverse=back)
        end

        @testset "Lie Derivative" begin
            @variables u v
            ∂ = PartialDerivative((u, v))
            d = ExteriorDerivative(∂)
            X = Tensor([u^2 + 1, -2v])
            ω = Tensor([v, u]')

            # Cartan's formula, L_X ω = ι_X dω + d(ι_X ω)
            dω = d[:i] * ω[:j]
            cartan = [sum(X.data[i] * dω.data[i, j] for i in 1:2) + Symbolics.derivative(interior(X, ω), c)
                for (j, c) in enumerate((u, v))]
            L = lie(X, ω, ∂, simple=true)

            @test L.variance == (:co,)
            @test all(isequal(simplify(a - b), 0) for (a, b) in zip(L.data, cartan))
        end

        @testset "Gaussian and Sectional Curvature" begin
            @variables θ φ x y
            S = Manifold((θ, φ), Basis([Tensor([1, 0]), Tensor([0, sin(θ)])]), simple=true)
            H = Manifold((x, y), Tensor([1/y^2 0; 0 1/y^2], :co, :co), simple=true)

            @test isequal(gaussian_curvature(S), 1)
            @test isequal(sectional_curvature(S, Tensor([1, 2]), Tensor([-1, 3])), 1)
            # The simplifier may leave the half-plane's constant curvature unreduced, so check its value
            @test substitute(gaussian_curvature(H), Dict(y => 2.0)) ≈ -1
            @test substitute(sectional_curvature(H, Tensor([1, 2]), Tensor([-1, 3])), Dict(y => 2.0)) ≈ -1
            @test isequal(gaussian_curvature(Manifold((x, y))), 0)
            @test_throws ErrorException gaussian_curvature(Manifold((x, y, θ)))
        end

        @testset "Lie Bracket" begin
            @variables u v
            ∂ = PartialDerivative((u, v))
            X = Tensor([u^2 + 1, -2v])
            Y = Tensor([v, 3 - v])

            @test isequal(lie(X, Y, ∂).data[1], -2v - 2u*v)
            @test isequal(lie(X, Y, ∂).data[2], 2v + 2*(3 - v))
        end
    end

    @testset "Calculus" begin
        @testset "Partial Derivative" begin
            @variables u v
            x = Tensor([u^2, v])
            ∂ = PartialDerivative((u, v))

            @test isequal(∂[:k] * x[:k], 1 + 2u)
        end

        @testset "Exterior Derivative" begin
            @variables x y z
            ∂ = PartialDerivative((x, y, z))
            d = ExteriorDerivative(∂)
            α = Tensor([x^2, y*z, x]')

            @test isequal((d[:k] * α[:i]).data[1, 3], -1)
            @test isequal((d[:k] * α[:i]).data[2, 3], y)
            @test isequal((d[:k] * α[:i]).data[3, 1], 1)
            @test isequal((d[:k] * α[:i]).data[3, 2], -y)
        end

        @testset "Covariant Derivative" begin
            @variables u v
            x = Tensor([u^2, v])
            basis = Basis([Tensor([1, 0]), Tensor([0, 1])])
            Γ = christoffel(Manifold((u, v), basis))
            ∂ = PartialDerivative((u, v))
            ∇ = CovariantDerivative(Γ, ∂)

            @test isequal(∇[:k] * x[:k], 1 + 2u)
        end

        @testset "Hodge Star" begin
            basis = Basis([Tensor([1, 0]), Tensor([0, 1])])
            α = Tensor([1, 2]')
            g = metric(basis)
            ⋆ = HodgeStar(g)

            @test isequal((⋆(α)).data[1], -2.0)
            @test isequal((⋆(α)).data[2], 1)
        end
    end
end