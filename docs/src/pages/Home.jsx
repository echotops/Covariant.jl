import { Link } from 'react-router-dom';
import style from './home.module.css';
import github from '../assets/github.svg';
import Topbar from '../components/Topbar/Topbar';
import CodeBlock from '../components/Code/CodeBlock';
import CodeInline from '../components/Code/CodeInline';
import Math from '../components/Math/Math';
import surface from '../assets/learn/surface.png';
import vectorfield from '../assets/learn/vectorfield.png';
import scalarfield from '../assets/learn/scalarfield.png';
import geodesic from '../assets/learn/geodesic.png';
import banner from '../assets/banner.jpg';

const FEATURES = [
    {
        symbol: '\\otimes',
        title: 'Algebra',
        body: 'Contraction, scaling, the tensor and wedge products, dot products, and symmetrization, all indexed with Einstein notation.',
    },
    {
        symbol: '\\nabla',
        title: 'Geometry',
        body: 'The metric, connection coefficients, and Lie bracket, plus the Ricci scalar and the Riemann, Ricci, and Einstein tensors.',
    },
    {
        symbol: '\\partial',
        title: 'Calculus',
        body: 'Partial, covariant, and exterior derivatives, and the Hodge star, for tensor and differential form calculus.',
    },
    {
        symbol: 'x^\\mu',
        title: 'Symbolic',
        body: 'Symbolic tensor components via Symbolics.jl, for exact derivatives and geometric quantities.',
    },
];

const VISUALS = [
    { img: surface, title: 'Surfaces', body: '2-dimensional manifolds embedded in 3 dimensions' },
    { img: vectorfield, title: 'Vector fields', body: 'Tangent vector fields evaluated over a basis' },
    { img: scalarfield, title: 'Scalar fields', body: 'Curvature and other scalar quantities over a surface' },
    { img: geodesic, title: 'Geodesics', body: 'Paths and geodesics traced along a manifold' },
];

export default function Home() {
    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.hero}>
                    <img className={style.heroBg} src={banner} alt="" />
                    <div className={style.heroFade}></div>
                    <div className={style.wrap}>
                        <div className={style.heroText}>
                            <p className={style.eyebrow}>Tensor algebra &middot; differential geometry &middot; Julia</p>
                            <p className={style.title}>Differential geometry, written the way you'd write it on paper</p>
                            <p className={style.subtitle}>
                                Covariant.jl is a tensor and differential geometry library that stays
                                true to mathematical notation and the Einstein summation convention.
                            </p>
                            <div className={style.menu}>
                                <Link className={`${style.item} ${style.highlight}`} to='/learn/getting-started'>
                                    <p>Get Started</p>
                                    <p className={style.icon}>&#8594;</p>
                                </Link>
                                <a className={style.item} href='https://github.com/echotops/Covariant.jl' target='_blank'>
                                    <p>View on GitHub</p>
                                    <img className={style.icon} src={github}></img>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.section}>
                    <div className={style.wrap}>
                        <p className={style.sectionLabel}>Features</p>
                        <p className={style.sectionTitle}>Everything a tensor calculation needs</p>
                        <div className={style.featureGrid}>
                            {FEATURES.map((f) => (
                                <div className={style.featureCard} key={f.title}>
                                    <div className={style.featureIcon}>
                                        <Math>{f.symbol}</Math>
                                    </div>
                                    <p className={style.featureTitle}>{f.title}</p>
                                    <p className={style.featureBody}>{f.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`${style.section} ${style.dark}`}>
                    <div className={style.wrap}>
                        <div className={style.showcase}>
                            <div className={style.showcaseText}>
                                <p className={style.sectionLabel}>Einstein notation</p>
                                <p className={style.sectionTitle}>Indices in, indices out</p>
                                <p className={style.showcaseBody}>
                                    Tensors are indexed directly with <CodeInline code=":i" />, <CodeInline code=":j" /> style
                                    symbols. When the same index appears on both sides of a contraction,
                                    like <CodeInline code=":j" /> below, it's summed over automatically,
                                    the same way it would be on paper. Indices that don't repeat, like
                                    <CodeInline code=":i" /> and <CodeInline code=":k" />, pass straight
                                    through as the free indices of the result.
                                </p>
                                <Link className={style.showcaseLink} to='/learn/tensor-algebra#contraction'>
                                    Read about contraction <span>&#8594;</span>
                                </Link>
                            </div>
                            <div className={style.showcaseCode}>
                                <CodeBlock lang="julia" inset={-60}
                                    code={`A = Tensor([[2, -3], [-4, -1]]')
B = Tensor([[-1, 1], [2, 2]]')
A[:i][:j] * B[:j][:k]  # j contracts, i and k remain`}
                                    result={`(1, 1)-Tensor:
[-6 -4; 2 -8]
    (:contra, :co)
    (:i,), (:k,)`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.section}>
                    <div className={style.wrap}>
                        <p className={style.sectionLabel}>Visualization</p>
                        <p className={style.sectionTitle}>See the geometry, not just the components</p>
                        <div className={style.visualGrid}>
                            {VISUALS.map((v) => (
                                <Link className={style.visualCard} to='/learn/visualization' key={v.title}>
                                    <img className={style.visualImg} src={v.img} alt={v.title} />
                                    <div className={style.visualCaption}>
                                        <div>
                                            <p className={style.visualTitle}>{v.title}</p>
                                            <p className={style.visualBody}>{v.body}</p>
                                        </div>
                                        <span className={style.visualArrow}>&#8594;</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`${style.section} ${style.dark}`}>
                    <div className={style.wrap}>
                        <div className={style.cta}>
                            <p className={style.ctaTitle}>Ready to start computing?</p>
                            <p className={style.ctaBody}>
                                Install Covariant.jl and be contracting tensors in a couple of lines.
                            </p>
                            <div className={`${style.menu} ${style.center}`}>
                                <Link className={`${style.item} ${style.highlight}`} to='/learn/getting-started'>
                                    <p>Get Started</p>
                                    <p className={style.icon}>&#8594;</p>
                                </Link>
                                <a className={style.item} href='https://github.com/echotops/Covariant.jl' target='_blank'>
                                    <p>View on GitHub</p>
                                    <img className={style.icon} src={github}></img>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
