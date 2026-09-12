import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-julia';
import style from './code.module.css';

export default function CodeBlock({ code, inset = 0, result = null, img = null, lang = 'julia' }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) Prism.highlightElement(ref.current);
    }, [code]);

    const copy = () => {
        navigator.clipboard.writeText(code).then(() => {
            const btn = ref.current.closest('[data-block="code-block"]').querySelector('[data-block="code-copy"]');
            const orig = btn.textContent;
            btn.textContent = 'copied';
            btn.style.color = 'var(--accent)';
            setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1500);
        });
    };

    return (
        <div className={style.codeblock} style={{ marginLeft: inset + 60 }} data-block="code-block">
            <div className={style.codeheader}>
                <span className={style.codelang}>{lang}</span>
                <span className={style.codecopy} onClick={copy} data-block="code-copy">copy</span>
            </div>
            <pre><code ref={ref} className={`language-${lang}`}>{code}</code></pre>
            <div className={`${style.result} ${result === null ? style.hide : ''}`}>{result}</div>
            <div className={`${style.imgblock} ${img === null ? style.hide : ''}`}>
                <img className={style.img} src={img} alt="Logo" />
            </div>
        </div>
    );
}