import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import style from './math.module.css';

export default function Math({ children, display = false }) {
  const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            katex.render(children, ref.current, {
                displayMode: display,
                throwOnError: false,
            });
        }
    }, [children, display]);

    if (display) {
        return (
            <div className={style.mathblock}>
                <span ref={ref} />
            </div>
        );
    }

    return <span ref={ref} />;
}