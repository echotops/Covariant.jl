import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Topbar from '../../components/Topbar/Topbar';
import { examples } from '../../data/examples';
import style from '../examples.module.css';

export default function ExampleDetail() {
    const { slug } = useParams();
    const example = examples.find((ex) => ex.slug === slug);

    useEffect(() => {
        if (example) document.title = `${example.title} — Covariant.jl`;
    }, [example]);

    if (!example) return <Navigate to="/examples" replace />;

    return (
        <>
            <Topbar />
            <div className={`${style.page} page-fade-in`}>
                <div className={style.wrap}>
                    <p className={style.title}>{example.title}</p>
                    <p className={style.subtitle}>{example.description}</p>
                    <p className="learn-body" style={{ margin: '0 0 20px' }}>
                        This walkthrough hasn't been written yet — check back soon.
                    </p>
                    <Link to="/examples" className={style.backLink}>← Back to Examples</Link>
                </div>
            </div>
        </>
    );
}
