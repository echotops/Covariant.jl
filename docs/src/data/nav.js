export const learnNav = [
    {
        title: 'Introduction',
        sections: [
            {
                heading: 'Getting Started',
                path: '/learn/getting-started',
                items: [
                    { title: 'Installation', anchor: 'installation' },
                    { title: 'Quick Start', anchor: 'quick-start' },
                ],
            }
        ]
    },
    {
        title: 'Core',
        sections: [
            {
                heading: 'Tensors',
                path: '/learn/tensors',
                items: [
                    { title: 'Initialization', anchor: 'initialization' },
                    { title: 'Tensor Type', anchor: 'tensor-type' },
                    { title: 'Indexing Conventions', anchor: 'indexing-conventions' },
                ],
            },
            {
                heading: 'Tensor Algebra',
                path: '/learn/tensor-algebra',
                items: [
                    { title: 'Addition', anchor: 'addition' },
                    { title: 'Scaling', anchor: 'scaling' },
                    { title: 'Contraction', anchor: 'contraction' },
                    { title: 'Symmetrization', anchor: 'symmetrization' },
                    { title: 'Tensor Product', anchor: 'tensor-product' },
                    { title: 'Basis and Duality', anchor: 'basis-and-duality' },
                ],
            },
            {
                heading: 'Differential Geometry',
                path: '/learn/differential-geometry',
                items: [
                    { title: 'Metric Tensor', anchor: 'metric-tensor' },
                    { title: 'Covariant Derivative', anchor: 'covariant-derivative' },
                    { title: 'Curvature', anchor: 'curvature' },
                    { title: 'Lie Bracket', anchor: 'lie-bracket' },
                ],
            },
            {
                heading: 'Differential Forms',
                path: '/learn/differential-forms',
                items: [
                    { title: 'Wedge Product', anchor: 'wedge-product' },
                    { title: 'Exterior Derivative', anchor: 'exterior-derivative' },
                    { title: 'Hodge Star', anchor: 'hodge-star' },
                ],
            },
        ]
    },
    {
        title: 'Advanced',
        sections: [
            {
                heading: 'Symbolic',
                path: '/learn/symbolic',
                items: [
                    { title: 'Simplify', anchor: 'simplify' },
                    { title: 'Substitute', anchor: 'substitute' },
                    { title: 'Evaluate', anchor: 'evaluate' },
                ],
            },
            {
                heading: 'Visualization',
                path: '/learn/visualization',
                items: [
                    { title: 'Setup', anchor: 'setup' },
                    { title: 'Surfaces', anchor: 'surfaces' },
                    { title: 'Paths', anchor: 'paths' },
                    { title: 'Scalar Fields', anchor: 'scalar-fields' },
                    { title: 'Vector Fields', anchor: 'vector-fields' },
                ],
            },
            {
                heading: 'Solver',
                path: '/learn/solver',
                items: [
                    { title: 'Geodesics', anchor: 'geodesics' },
                    { title: 'Parallel Transport', anchor: 'parallel-transport' },
                ],
            },
        ]
    },
];

export const referenceNav = [
    {
        title: 'Types',
        sections: [
            {
                heading: 'Geometric Objects',
                path: '/reference/geometric-objects',
                items: [
                    { title: 'Tensor', anchor: 'tensor' },
                    { title: 'Basis', anchor: 'basis' },
                ],
            },
            {
                heading: 'Special Objects',
                path: '/reference/special-objects',
                items: [
                    { title: 'KroneckerDelta', anchor: 'kronecker-delta' },
                    { title: 'LeviCivita', anchor: 'levi-civita-symbol' },
                    { title: 'HodgeStar', anchor: 'hodge-star' },
                ],
            },
            {
                heading: 'Differential Operators',
                path: '/reference/differential-operators',
                items: [
                    { title: 'PartialDerivative', anchor: 'partial-derivative' },
                    { title: 'CovariantDerivative', anchor: 'covariant-derivative' },
                    { title: 'ExteriorDerivative', anchor: 'exterior-derivative' },
                ],
            },
        ]
    },
    {
        title: 'Constructors & Indexing',
        sections: [
            {
                heading: 'Constructors',
                path: '/reference/constructors',
                items: [
                    { title: 'Tensor', anchor: 'tensor' },
                    { title: 'Basis', anchor: 'basis' },
                ],
            },
            {
                heading: 'Indexing',
                path: '/reference/indexing',
                items: [
                    { title: 'Tensor', anchor: 'tensor-getindex' },
                    { title: 'PartialIndexedTensor', anchor: 'partial-indexed-tensor-getindex' },
                    { title: 'KroneckerDelta', anchor: 'kronecker-delta-getindex' },
                    { title: 'LeviCivita', anchor: 'levi-civita-getindex' },
                    { title: 'PartialDerivative', anchor: 'partial-derivative-getindex' },
                    { title: 'CovariantDerivative', anchor: 'covariant-derivative-getindex' },
                    { title: 'ExteriorDerivative', anchor: 'exterior-derivative-getindex' },
                    { title: 'Basis', anchor: 'basis-getindex' },
                ],
            },
        ]
    },
    {
        title: 'Algebra',
        sections: [
            {
                heading: 'Tensor Operations',
                path: '/reference/tensor-operations',
                items: [
                    { title: '⊗', anchor: 'tensor-product' },
                    { title: '∧', anchor: 'wedge-product' },
                    { title: 'LinearAlgebra.⋅', anchor: 'dot-product' },
                ],
            },
            {
                heading: 'Indexed Arithmetic',
                path: '/reference/indexed-arithmetic',
                items: [
                    { title: 'Base.:+', anchor: 'addition' },
                    { title: 'Base.:-', anchor: 'subtraction' },
                    { title: 'Base.:* (scalar)', anchor: 'multiplication-scalar' },
                    { title: 'Base.:/ (scalar)', anchor: 'division-scalar' },
                    { title: 'Base.:* (KroneckerDelta)', anchor: 'multiplication-kronecker-delta' },
                    { title: 'Base.:* (LeviCivita)', anchor: 'multiplication-levi-civita' },
                    { title: 'Base.:* (contraction)', anchor: 'multiplication-linearalgebra' },
                ],
            },
            {
                heading: 'Symmetry & Duality',
                path: '/reference/symmetry-and-duality',
                items: [
                    { title: 'symmetrize', anchor: 'symmetrize' },
                    { title: 'antisymmetrize', anchor: 'antisymmetrize' },
                    { title: 'dual_basis', anchor: 'dual-basis' },
                ],
            },
        ]
    },
    {
        title: 'Calculus',
        sections: [
            {
                heading: 'Derivatives',
                path: '/reference/derivatives',
                items: [
                    { title: 'PartialDerivative', anchor: 'partial-differentiation' },
                    { title: 'CovariantDerivative', anchor: 'covariant-differentiation' },
                    { title: 'ExteriorDerivative', anchor: 'exterior-differentiation' },
                ],
            },
            {
                heading: 'Hodge Star',
                path: '/reference/hodge-star',
                items: [
                    { title: 'HodgeStar', anchor: 'hodge-star' },
                ],
            },
        ]
    },
    {
        title: 'Geometry',
        sections: [
            {
                heading: 'Metric & Connections',
                path: '/reference/metric-and-connections',
                items: [
                    { title: 'Manifold', anchor: 'manifold' },
                    { title: 'metric', anchor: 'metric' },
                    { title: 'LinearAlgebra.inv', anchor: 'inv' },
                    { title: 'minkowski', anchor: 'minkowski' },
                    { title: 'christoffel', anchor: 'christoffel' },
                    { title: 'levicivita', anchor: 'levi-civita' },
                    { title: 'lie', anchor: 'lie' },
                ],
            },
            {
                heading: 'Curvature',
                path: '/reference/curvature',
                items: [
                    { title: 'riemann', anchor: 'riemann' },
                    { title: 'ricci', anchor: 'ricci' },
                    { title: 'ricci_scalar', anchor: 'ricci-scalar' },
                    { title: 'einstein', anchor: 'einstein' },
                ],
            },
        ]
    },
    {
        title: 'Symbolic',
        sections: [
            {
                heading: 'Simplify & Evaluate',
                path: '/reference/simplify-evaluate',
                items: [
                    { title: 'simplify', anchor: 'simplify' },
                    { title: 'substitute', anchor: 'substitute' },
                    { title: 'evaluate', anchor: 'evaluate' },
                ],
            },
        ]
    },
    {
        title: 'Visualization',
        sections: [
            {
                heading: 'Surfaces & Paths',
                path: '/reference/surfaces-and-paths',
                items: [
                    { title: 'plot_surface!', anchor: 'plot-surface' },
                    { title: 'plot_path!', anchor: 'plot-path' },
                    { title: 'embedding_basis', anchor: 'embedding-basis' },
                ],
            },
            {
                heading: 'Scalar Fields',
                path: '/reference/scalar-fields',
                items: [
                    { title: 'plot_scalar!', anchor: 'plot-scalar' },
                ],
            },
            {
                heading: 'Vector Fields',
                path: '/reference/vector-fields',
                items: [
                    { title: 'plot_vectors! (field)', anchor: 'vectors' },
                    { title: 'plot_vectors! (positions)', anchor: 'vectors-positions' },
                ],
            },
        ]
    },
    {
        title: 'Solver',
        sections: [
            {
                heading: 'Geodesics',
                path: '/reference/geodesics',
                items: [
                    { title: 'Trajectory', anchor: 'trajectory' },
                    { title: 'solve_geodesic', anchor: 'solve-geodesic' },
                ],
            },
            {
                heading: 'Parallel Transport',
                path: '/reference/parallel-transport',
                items: [
                    { title: 'solve_parallel_transport', anchor: 'solve-parallel-transport' },
                ],
            },
        ]
    },
];

// Canonical reference-page target for a symbol/type name, used by <Ref> to link
// mentions in prose to the section that defines them.
export const refLinks = {
    Tensor: '/reference/geometric-objects#tensor',
    Basis: '/reference/geometric-objects#basis',

    KroneckerDelta: '/reference/special-objects#kronecker-delta',
    LeviCivita: '/reference/special-objects#levi-civita-symbol',
    HodgeStar: '/reference/special-objects#hodge-star',

    PartialDerivative: '/reference/differential-operators#partial-derivative',
    CovariantDerivative: '/reference/differential-operators#covariant-derivative',
    ExteriorDerivative: '/reference/differential-operators#exterior-derivative',

    symmetrize: '/reference/symmetry-and-duality#symmetrize',
    antisymmetrize: '/reference/symmetry-and-duality#antisymmetrize',
    dual_basis: '/reference/symmetry-and-duality#dual-basis',

    metric: '/reference/metric-and-connections#metric',
    inv: '/reference/metric-and-connections#inv',
    minkowski: '/reference/metric-and-connections#minkowski',
    christoffel: '/reference/metric-and-connections#christoffel',
    levicivita: '/reference/metric-and-connections#levi-civita',
    lie: '/reference/metric-and-connections#lie',

    riemann: '/reference/curvature#riemann',
    ricci: '/reference/curvature#ricci',
    ricci_scalar: '/reference/curvature#ricci-scalar',
    einstein: '/reference/curvature#einstein',

    simplify: '/reference/simplify-evaluate#simplify',
    substitute: '/reference/simplify-evaluate#substitute',
    evaluate: '/reference/simplify-evaluate#evaluate',

    Manifold: '/reference/metric-and-connections#manifold',
    'plot_surface!': '/reference/surfaces-and-paths#plot-surface',
    'plot_path!': '/reference/surfaces-and-paths#plot-path',
    embedding_basis: '/reference/surfaces-and-paths#embedding-basis',
    'plot_scalar!': '/reference/scalar-fields#plot-scalar',
    'plot_vectors!': '/reference/vector-fields#vectors',

    Trajectory: '/reference/geodesics#trajectory',
    solve_geodesic: '/reference/geodesics#solve-geodesic',

    solve_parallel_transport: '/reference/parallel-transport#solve-parallel-transport',
};

// Section (path -> heading/group) lookup, used to derive per-page <title> and search entries.
export function findSection(pathname) {
    for (const nav of [learnNav, referenceNav]) {
        for (const group of nav) {
            for (const section of group.sections) {
                if (pathname === section.path || pathname.startsWith(section.path + '/')) {
                    return { ...section, group: group.title };
                }
            }
        }
    }
    return null;
}