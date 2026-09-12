import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-julia';

export default function CodeInline({ code, lang = 'julia' }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) Prism.highlightElement(ref.current);
    }, [code]);

    return (
        <code ref={ref} className={`language-${lang}`}>{code}</code>
    );
}