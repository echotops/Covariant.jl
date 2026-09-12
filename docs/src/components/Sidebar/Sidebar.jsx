import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { learnNav, referenceNav } from '../../data/nav';
import style from './sidebar.module.css';

function Group({ group, openSections, toggle }) {
    return (
        <div className={style.group}>
            <p className={style.label}>{group.title}</p>

            {group.sections.map((item) => (
                <Section
                    key={item.heading}
                    section={item}
                    isOpen={openSections[item.path] ?? false}
                    toggle={() => toggle(item.path)}
                />
            ))}
        </div>
    );
}

function Section({ section, isOpen, toggle }) {
    const ref = useRef(null);

    return (
        <div
            ref={ref}
            className={`${style.section} ${isOpen ? style.show : ''}`}
            style={{'--item-count': section.items.length}}
        >
            <div className={style.header} onClick={toggle}>
                <Link
                    className={style.title}
                    to={section.path}
                    onClick={() => {isOpen && toggle()}}
                >{section.heading}</Link>
                <div className={`${style.toggle} ${isOpen ? style.show : ''}`}>
                    <p>›</p>
                </div>
            </div>
            <div className={style.menu}>
                {section.items.map((item) => (
                    <Link key={item.anchor} className={style.item} to={`${section.path}#${item.anchor}`}>{item.title}</Link>
                ))}
            </div>
        </div>
    );
};

export default function Sidebar({ open = false }) {
    const { pathname } = useLocation();
    const isReference = pathname.startsWith('/reference');
    const nav = isReference ? referenceNav : learnNav;

    const [openSections, setOpenSections] = useState(() => {
        const activeSection = nav
        .flatMap(group => group.sections)
        .find(section => pathname.startsWith(section.path));
        return activeSection ? { [activeSection.path]: true } : {};
    });

    useEffect(() => {
        const activeSection = nav
            .flatMap(group => group.sections)
            .find(section => pathname.startsWith(section.path));
        if (activeSection && !openSections[activeSection.path]) {
            setOpenSections({ [activeSection.path]: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    function toggle(path) {
        setOpenSections(prev => ({ ...prev, [path]: !prev[path] }));
    }

    return (
        <nav className={`${style.sidebar} ${open ? style.open : ''}`}>
            {nav.map((item) => (
                <Group key={item.title} group={item} openSections={openSections} toggle={toggle} />
            ))}
        </nav>
    );
}