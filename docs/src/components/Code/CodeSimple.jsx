import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-julia';
import style from './code.module.css';

export default function CodeSimple({ code, lang = 'julia' }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) Prism.highlightElement(ref.current);
    }, [code]);

    return (
        <div className={style.codeblock} data-block="code-block">
            <pre><code ref={ref} className={`language-${lang}`}>{code}</code></pre>
        </div>
    );
}