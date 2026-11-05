import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './home.module.css';
import Topbar from '../components/Topbar/Topbar';
import CodeBlock from '../components/Code/CodeBlock';
import Math from '../components/Math/Math';
import vectorfield from '../assets/learn/vectorfield.png';
import geodesic from '../assets/learn/geodesic.png';
import banner from '../assets/banner.jpg';

const SCOPE = [
    {
        title: 'Tensor algebra',
        formula: 'A^{i}{}_{j}\\, B^{j}{}_{k} = C^{i}{}_{k}',
        body: 'Index notation with automatic summation, plus tensor products, contraction, and symmetrization.',
        to: '/learn/tensor-algebra',
    },
    {
        title: 'Calculus',
        formula: '\\nabla_i X^j = \\partial_i X^j + \\Gamma^j_{ik} X^k',
        body: 'Covariant derivatives, Christoffel symbols, the Lie bracket, and the Riemann, Ricci, and Einstein tensors.',
        to: '/learn/differential-geometry',
    },
    {
        title: 'Differential forms',
        formula: '\\alpha \\wedge \\beta = (-1)^{pq}\\, \\beta \\wedge \\alpha',
        body: 'Wedge products, exterior derivatives, and the Hodge star on differential forms of any degree.',
        to: '/learn/differential-forms',
    },
];

const CALCULATION = [
    {
        title: 'Index notation',
        body: 'Repeated indices are summed automatically, the way they would be on paper.',
        code: `A = Tensor([2 -3; -4 -1], :co, :contra)
B = Tensor([-1 1; 2 2], :co, :contra)
A[:i][:j] * B[:j][:k]`,
        result: `(1, 1)-Tensor:
[-6 -4; 2 -8]
    (:contra, :co)
    (:i,), (:k,)`,
        link: 'Read about contraction',
        to: '/learn/tensor-algebra#contraction',
    },
    {
        title: 'Exact results',
        body: 'Symbolic components keep derivatives and curvature exact.',
        code: `@variables u v
∂ = PartialDerivative((u, v))
X = Tensor([u * v, v^2 - 1])
∂[:i] * X[:j]`,
        result: `(1, 1)-Tensor:
Num[v u; 0 2v]
    (:contra, :co)
    (:j,), (:i,)`,
        link: 'Read about symbolic results',
        to: '/learn/symbolic',
    },
];

const VISUALS = [
    { img: vectorfield, title: 'Vector fields', body: 'Tangent vector fields evaluated over a basis' },
    { img: geodesic, title: 'Geodesics', body: 'Paths and geodesics traced along a manifold' },
];

export default function Home() {
    const heroRef = useRef(null);
    const [scrolled, setScrolled] = useState(() => window.scrollY > 40);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.title = 'Covariant.jl';
    }, []);

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.hero} ref={heroRef}>
                    <img className={style.heroBg} src={banner} alt="" />
                    <div className={style.heroFade}></div>
                    <div className={style.wrap}>
                        <div className={style.heroText}>
                            <h1 className={style.title}>Covariant.jl</h1>
                            <p className={style.subtitle}>Differential geometry, how you'd write it on paper</p>
                            <div className={style.menu}>
                                <Link className={`${style.btn} ${style.btnPrimary}`} to='/learn/getting-started'>
                                    Get Started <span>&#8594;</span>
                                </Link>
                                <a className={`${style.btn} ${style.btnSecondary}`} href='https://github.com/echotops/Covariant.jl' target='_blank'>
                                    View on GitHub <span>&#8599;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <button type='button' className={style.scrollPrompt} data-hidden={scrolled || undefined}
                        onClick={() => window.scrollTo({ top: heroRef.current.offsetHeight, behavior: 'smooth' })}>
                        <span>Explore</span>
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                            <path d='M3 6l5 5 5-5' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                    </button>
                </div>

                <div className={style.section}>
                    <div className={style.wrap}>
                        <p className={style.sectionTitle}>From tensor algebra to curvature</p>
                        <div className={style.scopeGrid}>
                            {SCOPE.map((s) => (
                                <Link className={`${style.card} ${style.scopeCard}`} to={s.to} key={s.title}>
                                    <p className={style.cardTitle}>{s.title}</p>
                                    <div className={style.formula}>
                                        <Math display>{s.formula}</Math>
                                    </div>
                                    <p className={style.cardBody}>{s.body}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={style.section}>
                    <div className={style.wrap}>
                        <p className={style.sectionTitle}>Indices in, exact results out</p>
                        <div className={style.calcGrid}>
                            {CALCULATION.map((c) => (
                                <div className={`${style.card} ${style.calcCard}`} key={c.title}>
                                    <p className={style.cardTitle}>{c.title}</p>
                                    <div className={style.codeSlot}>
                                        <CodeBlock lang="julia" code={c.code} result={c.result} />
                                    </div>
                                    <p className={style.cardBody}>{c.body}</p>
                                    <Link className={style.calcLink} to={c.to}>{c.link} &#8594;</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={style.section}>
                    <div className={style.wrap}>
                        <p className={style.sectionTitle}>See the geometry, not just the components</p>
                        <div className={style.visualGrid}>
                            {VISUALS.map((v) => (
                                <Link className={style.card} to='/learn/visualization' key={v.title}>
                                    <img className={style.cardImg} src={v.img} alt={v.title} />
                                    <div className={style.cardCaption}>
                                        <div>
                                            <p className={style.cardTitle}>{v.title}</p>
                                            <p className={style.cardBody}>{v.body}</p>
                                        </div>
                                        <span className={style.cardArrow}>&#8594;</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
