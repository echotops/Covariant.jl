import style from './pagenav.module.css';
import { Link, useLocation } from 'react-router-dom';
import { learnNav, referenceNav } from '../../data/nav';

export default function PageNav({ prev = null, next = null }) {
    const isReference = useLocation().pathname.startsWith('/reference');
    const nav = isReference ? referenceNav : learnNav;
    let prev_path = null;
    let next_path = null;

    for (const category of nav) {
        for (const page of category.sections) {
            if (page.heading == prev) {
                prev_path = page.path;
            }
            if (page.heading == next) {
                next_path = page.path;
            }
        }
    }

    return (
        <div className={style.pagenav}>
            {prev !== null && (
                <Link className={`${style.button}`} to={prev_path}>
                    <p className={style.title}>{prev}</p>
                    <p className={style.subtitle}>‹ Previous</p>
                </Link>
            )}
            {next !== null && (
                <Link className={`${style.button} ${style.right}`} to={next_path}>
                    <p className={style.title}>{next}</p>
                    <p className={style.subtitle}>Next ›</p>
                </Link>
            )}
        </div>
    );
}