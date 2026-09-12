import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';
import Layout from './components/Layout/Layout';
import {
    GettingStarted,
    Tensors,
    TensorAlgebra,
    DifferentialGeometry,
    DifferentialForms,
    Symbolic,
    Visualization,
    Solver,
} from './pages/learn';
import {
    GeometricObjects,
    SpecialObjects,
    DifferentialOperators,
    Constructors,
    Indexing,
    TensorOperations,
    IndexedArithmetic,
    SymmetryDuality,
    Derivatives,
    HodgeStar,
    MetricConnections,
    Curvature,
    SimplifyEvaluate,
    SurfacesPaths,
    ScalarFields,
    VectorFields,
    Geodesics,
    ParallelTransport,
} from './pages/reference';

export default function App() {
    return (
        <BrowserRouter basename="/Covariant.jl">
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route element={<Layout />}>
                    <Route path="/learn/getting-started" element={<GettingStarted />} />
                    <Route path="/learn/tensors" element={<Tensors />} />
                    <Route path="/learn/tensor-algebra" element={<TensorAlgebra />} />
                    <Route path="/learn/differential-geometry" element={<DifferentialGeometry />} />
                    <Route path="/learn/differential-forms" element={<DifferentialForms />} />
                    <Route path="/learn/symbolic" element={<Symbolic />} />
                    <Route path="/learn/visualization" element={<Visualization />} />
                    <Route path="/learn/solver" element={<Solver />} />
                    <Route path="/reference/geometric-objects" element={<GeometricObjects />} />
                    <Route path="/reference/special-objects" element={<SpecialObjects />} />
                    <Route path="/reference/differential-operators" element={<DifferentialOperators />} />
                    <Route path="/reference/constructors" element={<Constructors />} />
                    <Route path="/reference/indexing" element={<Indexing />} />
                    <Route path="/reference/tensor-operations" element={<TensorOperations />} />
                    <Route path="/reference/indexed-arithmetic" element={<IndexedArithmetic />} />
                    <Route path="/reference/symmetry-and-duality" element={<SymmetryDuality />} />
                    <Route path="/reference/derivatives" element={<Derivatives />} />
                    <Route path="/reference/hodge-star" element={<HodgeStar />} />
                    <Route path="/reference/metric-and-connections" element={<MetricConnections />} />
                    <Route path="/reference/curvature" element={<Curvature />} />
                    <Route path="/reference/simplify-evaluate" element={<SimplifyEvaluate />} />
                    <Route path="/reference/surfaces-and-paths" element={<SurfacesPaths />} />
                    <Route path="/reference/scalar-fields" element={<ScalarFields />} />
                    <Route path="/reference/vector-fields" element={<VectorFields />} />
                    <Route path="/reference/geodesics" element={<Geodesics />} />
                    <Route path="/reference/parallel-transport" element={<ParallelTransport />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}