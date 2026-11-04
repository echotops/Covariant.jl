using Test
using Covariant
using Symbolics

@testset "Covariant.jl" begin

    @testset "Algebra" begin
        @testset "Contraction" begin
            v = Tensor([1, 2])
            w = Tensor([3, 5]')
            L = Tensor([[2, 1]', [-1, 3]'])

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
            L = Tensor([[2, 1]', [-1, 3]'])
            M = Tensor([[-3, 4]', [5, 5]'])

            @test (L[:i][:j] + M[:i][:j]).tensor.data == [-1 5; 4 8]
            @test (L[:i][:j] - M[:i][:j]).tensor.data == [5 -3; -6 -2]
        end

        @testset "Scaling" begin
            L = Tensor([[2, 1]', [-1, 3]'])

            @test (2 * L[:i][:j]).tensor.data == [4 2; -2 6]
        end

        @testset "Symmetrize and Antisymmetrize" begin
            L = Tensor([[2, -1], [5, 3]])

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
            g = Tensor([[1, 0]', [0, sin(θ)^2]']')
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