import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import style from './topbar.module.css';
import github from '../../assets/github.svg'

const NAV_ITEMS = [
    { label: 'Learn', to: '/learn/getting-started' },
    { label: 'Reference', to: '/reference/geometric-objects' },
    { label: 'Examples', to: null },
];

export default function Topbar() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const menuRef = useRef(null);

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [open]);

    return (
        <header className={style.topbar} ref={menuRef}>
            <Link className={style.logo} to="/home">
                <p>Covariant.jl</p>
            </Link>
            <nav className={style.navbar}>
                {NAV_ITEMS.map((item) => (
                    <Link key={item.label} className={style.navitem} to={item.to}>
                        <p>{item.label}</p>
                    </Link>
                ))}
            </nav>
            <div className={style.vbar}></div>
            <a className={style.external} href='https://github.com/echotops/Covariant.jl' target='_blank'>
                <img src={github} height="25px"></img>
            </a>
            <button
                className={`${style.menuToggle} ${open ? style.open : ''}`}
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={open}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className={`${style.mobileMenu} ${open ? style.show : ''}`}>
                {NAV_ITEMS.map((item) => (
                    <Link key={item.label} className={style.mobileNavitem} to={item.to}>
                        {item.label}
                    </Link>
                ))}
                <a className={style.mobileNavitem} href='https://github.com/echotops/Covariant.jl' target='_blank'>
                    View on GitHub
                </a>
            </nav>
        </header>
    );
}
