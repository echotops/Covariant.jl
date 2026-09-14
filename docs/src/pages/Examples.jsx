import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar/Topbar';
import style from './examples.module.css';
import { examples } from '../data/examples';
import { TorusIcon, EllipsoidIcon, HolonomyIcon, SchwarzschildIcon, RelativityIcon } from './ExampleIcons';

const ICONS = {
    'torus-geodesics': TorusIcon,
    'ellipsoid-curvature': EllipsoidIcon,
    'sphere-holonomy': HolonomyIcon,
    schwarzschild: SchwarzschildIcon,
    'special-relativity': RelativityIcon,
};

export default function Examples() {
    useEffect(() => {
        document.title = 'Examples — Covariant.jl';
    }, []);

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.wrap}>
                    <p className={style.title}>Examples</p>
                    <p className={style.subtitle}>
                        Complete, worked problems that put several pieces of Covariant.jl together —
                        for how the library gets used, see the Learn and Reference pages instead.
                    </p>
                    <div className={style.grid}>
                        {examples.map((ex) => {
                            const Icon = ICONS[ex.slug];
                            return (
                                <Link className={style.card} to={`/examples/${ex.slug}`} key={ex.slug}>
                                    <div className={style.cardIcon}>
                                        {Icon && <Icon />}
                                    </div>
                                    <div className={style.cardText}>
                                        <p className={style.cardTitle}>{ex.title}</p>
                                        <p className={style.cardDesc}>{ex.description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
