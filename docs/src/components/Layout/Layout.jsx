import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import style from './layout.module.css';

function ScrollToHash() {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
    }, [hash]);

    return null;
}

export default function LearnLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();
    const section = pathname.startsWith('/reference') ? 'reference' : 'learn';

    useEffect(() => setSidebarOpen(false), [pathname]);

    return (
        <>
            <ScrollToHash />
            <Topbar />
            <button
                className={`${style.sidebarTab} ${sidebarOpen ? style.open : ''}`}
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={sidebarOpen}
            >
                <span className={style.chevron}>&#8250;</span>
            </button>
            <div
                className={`${style.backdrop} ${sidebarOpen ? style.show : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <Sidebar open={sidebarOpen} />
            <div key={section} className={`${style.layout} page-fade-in`}>
                <Outlet />
            </div>
        </>
    );
}
