import FunctionDocs from '../../components/Docs/FunctionDocs';
import PageNav from '../../components/PageNav/PageNav';
import CodeBlock from '../../components/Code/CodeBlock';
import Math from '../../components/Math/Math';
import ptvector from '../../assets/learn/ptvector.png';
import ptpath from '../../assets/learn/ptpath.png';

export default function ParallelTransport() {
    return (
        <>
            <p className="learn-title">Parallel Transport</p>
            <p className="learn-body">
                Parallel transport moves a vector along a curve while keeping it as
                constant as the curvature of the space allows — formally, by requiring
                that the covariant derivative of the vector along the curve vanishes.
                Covariant provides two variants: transporting along a geodesic defined
                by an initial position and velocity, and transporting along an arbitrary
                parametric path. As with geodesics, both variants expose the raw ODE
                function for use with <code>DifferentialEquations.jl</code> directly,
                and a higher-level solver that wraps it automatically.
            </p>

            <FunctionDocs
                id="parallel-transport"
                name="parallel_transport!"
                code={`parallel_transport!(coordinates, Γ, du, u, p, t)`}
                description={<>The in-place ODE function defining parallel transport along a geodesic, for use directly with <code>DifferentialEquations.jl</code>. At each timestep, evaluates <Math>{'\\Gamma'}</Math> at the current position and computes the transport equation <Math>{'\\dot{w}^i = -\\Gamma^i_{jk} w^j \\dot{x}^k'}</Math>, where <Math>{'\\dot{x}'}</Math> is the geodesic velocity and <Math>{'w'}</Math> is the transported vector. The geodesic velocity is held constant — position evolves but the curve is not re-solved. The state vector <code>u</code> packs position in <code>u[1:2]</code>, geodesic velocity in <code>u[3:4]</code>, and the transported vector in <code>u[5:6]</code>. Most use cases should call <code>solve_parallel_transport</code> instead.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>The symbolic coordinate variables, used to evaluate <code>Γ</code> at the current position.</>],
                    ['Γ', 'Tensor', <>The <Math>{'(1, 2)'}</Math>-tensor of Christoffel symbols, computed by <code>christoffel</code>.</>],
                    ['du', 'Vector{Float64}', <>The output derivative vector, mutated in place by the function.</>],
                    ['u', 'Vector{Float64}', <>The current state vector. <code>u[1:2]</code> is position, <code>u[3:4]</code> is geodesic velocity, <code>u[5:6]</code> is the transported vector.</>],
                    ['p', 'Any', <>Parameters passed through by <code>DifferentialEquations.jl</code>. Not used internally.</>],
                    ['t', 'Float64', <>The current time, passed through by <code>DifferentialEquations.jl</code>. Not used internally.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`# Using parallel_transport! directly with DifferentialEquations.jl
@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
Γ = christoffel((θ, φ), e)

x0 = [π/4, 3π/4]
v0 = [0.5, 2]
w0 = [2, 0]
u0 = [x0..., v0..., w0...]
times = range(0.0, 1.5, 15)

problem = ODEProblem(
    (du, u, p, t) -> parallel_transport!((θ, φ), Γ, du, u, p, t),
    u0, (times[begin], times[end])
)
solution = solve(problem, abstol=1e-5, reltol=1e-5, saveat=times)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="solve-parallel-transport"
                name="solve_parallel_transport"
                code={`solve_parallel_transport(coordinates, basis, x0, v0, w0, times; abstol=1e-5, reltol=1e-5)`}
                description={<>Solves the parallel transport equation along a geodesic, given an initial position, geodesic velocity, and vector to transport. Internally computes the Christoffel symbols, constructs an <code>ODEProblem</code> from <code>parallel_transport!</code>, and solves with <code>DifferentialEquations.jl</code>. Returns a solution object whose <code>.u</code> field is a vector of state vectors, each packing position in <code>1:2</code>, geodesic velocity in <code>3:4</code>, and the transported vector in <code>5:6</code>.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>A tuple of symbolic variables defined with <code>@variables</code>, one per dimension.</>],
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis defining the geometry of the manifold.</>],
                    ['x0', 'Vector{Float64}', <>The initial position in coordinate space.</>],
                    ['v0', 'Vector{Float64}', <>The initial geodesic velocity in coordinate space.</>],
                    ['w0', 'Vector{Float64}', <>The initial vector to transport in coordinate space.</>],
                    ['times', 'AbstractRange', <>The time range over which to solve, also used as the <code>saveat</code> grid.</>],
                ]}
                kwargs={[
                    ['abstol', 'Float64', '1e-5', <>Absolute tolerance passed to the ODE solver.</>],
                    ['reltol', 'Float64', '1e-5', <>Relative tolerance passed to the ODE solver.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])

x0 = [π/4, 3π/4]
v0 = [0.5, 2]
w0 = [2, 0]
times = range(0.0, 1.5, 15)

solution = solve_parallel_transport((θ, φ), e, x0, v0, w0, times;
    abstol=1e-5, reltol=1e-5)

positions = [(u[1], u[2]) for u in solution.u]
vectors   = [Tensor([u[5], u[6]]) for u in solution.u]

# Initial velocity in red, transported vector in blue
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions,
    [Tensor(v0) for _ in positions], lengthscale=0.1, colormap=:reds)
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions,
    vectors, lengthscale=0.1, colormap=:ice)`}
                    img={ptvector}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# The angle between the initial and final transported vector
# reveals the holonomy of the loop
w_initial = Tensor(w0)
w_final   = Tensor([solution.u[end][5], solution.u[end][6]])
w_initial ⋅ w_final / (norm(w_initial) * norm(w_final)) |> acos`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="parallel-transport-path"
                name="parallel_transport_path!"
                code={`parallel_transport_path!(coordinates, Γ, path, velocity, du, u, p, t)`}
                description={<>The in-place ODE function defining parallel transport along an arbitrary parametric path, for use directly with <code>DifferentialEquations.jl</code>. Unlike <code>parallel_transport!</code>, the curve is specified explicitly as a pair of functions — <code>path(t)</code> returning the position at time <code>t</code>, and <code>velocity(t)</code> returning its derivative — rather than being solved as a geodesic. The state vector <code>u</code> holds only the transported vector in <code>u[1:2]</code>, since the path is evaluated analytically at each timestep. Most use cases should call <code>solve_parallel_transport_path</code> instead.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>The symbolic coordinate variables, used to evaluate <code>Γ</code> at the current position.</>],
                    ['Γ', 'Tensor', <>The <Math>{'(1, 2)'}</Math>-tensor of Christoffel symbols, computed by <code>christoffel</code>.</>],
                    ['path', 'Function', <>A parametric function <code>t -&gt; [u, v]</code> giving the position at each time.</>],
                    ['velocity', 'Function', <>A function <code>t -&gt; [du, dv]</code> giving the velocity of the path at each time. Must be the exact derivative of <code>path</code>.</>],
                    ['du', 'Vector{Float64}', <>The output derivative vector, mutated in place by the function.</>],
                    ['u', 'Vector{Float64}', <>The current state vector. <code>u[1:2]</code> is the transported vector.</>],
                    ['p', 'Any', <>Parameters passed through by <code>DifferentialEquations.jl</code>. Not used internally.</>],
                    ['t', 'Float64', <>The current time, used to evaluate <code>path</code> and <code>velocity</code>.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])
Γ = christoffel((θ, φ), e)

path(t)     = [0.4cos(t) + 0.1sin(2t) + π/3, 0.7sin(t) - 2π/3]
velocity(t) = [-0.4sin(t) + 0.2cos(2t), 0.7cos(t)]
w0   = [2.0, -1.0]
times = range(0.0, 2π, 101)

problem = ODEProblem(
    (du, u, p, t) -> parallel_transport_path!((θ, φ), Γ, path, velocity, du, u, p, t),
    w0, (times[begin], times[end])
)
solution = solve(problem, abstol=1e-5, reltol=1e-5, saveat=times)`}
                />
            </FunctionDocs>

            <FunctionDocs
                id="solve-parallel-transport-path"
                name="solve_parallel_transport_path"
                code={`solve_parallel_transport_path(coordinates, basis, path, velocity, w0, times; abstol=1e-5, reltol=1e-5)`}
                description={<>Solves the parallel transport equation along an arbitrary parametric path, given the path, its velocity, and an initial vector to transport. The path need not be a geodesic — any smooth curve is accepted, making this the natural function for studying holonomy by transporting a vector around a closed loop. Returns a solution object whose <code>.u</code> field is a vector of state vectors, each holding the transported vector in <code>u[1:2]</code>. The rotation of the vector after one full loop is the holonomy angle, which on a surface of constant curvature equals the enclosed area times the Gaussian curvature.</>}
                args={[
                    ['coordinates', 'Tuple{Num}', <>A tuple of symbolic variables defined with <code>@variables</code>, one per dimension.</>],
                    ['basis', 'Basis', <>A vector <Math>{'(:contra,)'}</Math> basis defining the geometry of the manifold.</>],
                    ['path', 'Function', <>A parametric function <code>t -&gt; [u, v]</code> giving the position at each time.</>],
                    ['velocity', 'Function', <>A function <code>t -&gt; [du, dv]</code> giving the velocity of the path. Must be the exact derivative of <code>path</code>.</>],
                    ['w0', 'Vector{Float64}', <>The initial vector to transport in coordinate space.</>],
                    ['times', 'AbstractRange', <>The time range over which to solve, also used as the <code>saveat</code> grid.</>],
                ]}
                kwargs={[
                    ['abstol', 'Float64', '1e-5', <>Absolute tolerance passed to the ODE solver.</>],
                    ['reltol', 'Float64', '1e-5', <>Relative tolerance passed to the ODE solver.</>],
                ]}
            >
                <p className="learn-heading">Examples</p>
                <CodeBlock lang="julia" inset={60}
                    code={`@variables θ φ
e = Basis([Tensor([1, 0]), Tensor([0, sin(θ)])])

path(t)     = [0.4cos(t) + 0.1sin(2t) + π/3, 0.7sin(t) - 2π/3]
velocity(t) = [-0.4sin(t) + 0.2cos(2t), 0.7cos(t)]
w0    = [2.0, -1.0]
times = range(0.0, 2π, 101)

solution = solve_parallel_transport_path((θ, φ), e, path, velocity, w0, times;
    abstol=1e-5, reltol=1e-5)

positions = [path(t) for t in times[begin:5:end]]
vectors   = [Tensor([u[1], u[2]]) for u in solution.u[begin:5:end]]
colorscale = [RGBf(1-i/length(positions), 0, i/length(positions))
    for i in 1:length(positions)]

path_2dembed!(ax3, embedding, path, times, color=:lightblue)
vector_2dembed!(ax3, (θ, φ), basis, embedding, positions,
    vectors, lengthscale=0.1, colormap=:ice)
scatter!(ax3, [Point3f(embedding(p...)) for p in positions],
    color=colorscale, markersize=10)`}
                    img={ptpath}
                />
                <CodeBlock lang="julia" inset={60}
                    code={`# Measuring the holonomy angle after one full loop
w_initial = Tensor(w0)
w_final   = Tensor([solution.u[end][1], solution.u[end][2]])
holonomy  = acos(w_initial ⋅ w_final / (norm(w_initial) * norm(w_final)))`}
                />
            </FunctionDocs>

            <PageNav prev="Geodesics" />
        </>
    );
}
