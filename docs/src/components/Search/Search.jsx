import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { learnNav, referenceNav } from '../../data/nav';
import { examples } from '../../data/examples';
import style from './search.module.css';

function buildIndex() {
    const entries = [];
    for (const [navLabel, nav] of [['Learn', learnNav], ['Reference', referenceNav]]) {
        for (const group of nav) {
            for (const section of group.sections) {
                entries.push({
                    title: section.heading,
                    subtitle: `${navLabel} · ${group.title}`,
                    path: section.path,
                });
                for (const item of section.items) {
                    entries.push({
                        title: item.title,
                        subtitle: `${navLabel} · ${section.heading}`,
                        path: `${section.path}#${item.anchor}`,
                    });
                }
            }
        }
    }
    for (const ex of examples) {
        entries.push({
            title: ex.title,
            subtitle: `Examples · ${ex.tags[0] ?? ''}`,
            path: `/examples/${ex.slug}`,
        });
    }
    return entries;
}

const INDEX = buildIndex();

function score(entry, query) {
    const t = entry.title.toLowerCase();
    if (t === query) return 100;
    if (t.startsWith(query)) return 80;
    if (t.includes(query)) return 60;
    if (entry.subtitle.toLowerCase().includes(query)) return 20;
    return 0;
}

export default function Search() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const resultRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        function onKey(e) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((o) => !o);
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        }
        function onOpenEvent() { setOpen(true); }
        window.addEventListener('keydown', onKey);
        window.addEventListener('open-search', onOpenEvent);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('open-search', onOpenEvent);
        };
    }, []);

    useEffect(() => {
        if (open) {
            setQuery('');
            setActive(0);
            const id = setTimeout(() => inputRef.current?.focus(), 10);
            return () => clearTimeout(id);
        }
    }, [open]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return INDEX.slice(0, 8);
        return INDEX
            .map((e) => ({ ...e, score: score(e, q) }))
            .filter((e) => e.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
    }, [query]);

    useEffect(() => setActive(0), [query]);

    useEffect(() => {
        resultRefs.current[active]?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    function go(path) {
        navigate(path);
        setOpen(false);
    }

    function onKeyDown(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[active]) go(results[active].path);
        }
    }

    if (!open) return null;

    return (
        <div className={style.overlay} onMouseDown={() => setOpen(false)}>
            <div className={style.palette} onMouseDown={(e) => e.stopPropagation()}>
                <input
                    ref={inputRef}
                    className={style.input}
                    placeholder="Search the docs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                />
                <div className={style.results}>
                    {results.length === 0 && (
                        <p className={style.empty}>No results for &ldquo;{query}&rdquo;</p>
                    )}
                    {results.map((r, i) => (
                        <div
                            key={r.path}
                            ref={(el) => (resultRefs.current[i] = el)}
                            className={`${style.result} ${i === active ? style.active : ''}`}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => go(r.path)}
                        >
                            <p className={style.resultTitle}>{r.title}</p>
                            <p className={style.resultSubtitle}>{r.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
