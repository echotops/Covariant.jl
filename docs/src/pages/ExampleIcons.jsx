const common = {
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export function TorusIcon() {
    return (
        <svg {...common}>
            <ellipse cx="50" cy="52" rx="40" ry="24" />
            <ellipse cx="50" cy="52" rx="16" ry="9.5" />
            <path d="M 10 52 A 40 24 0 0 0 90 52" strokeOpacity="0.4" />
        </svg>
    );
}

export function EllipsoidIcon() {
    return (
        <svg {...common}>
            <ellipse cx="50" cy="50" rx="26" ry="38" />
            <ellipse cx="50" cy="38" rx="26" ry="7" strokeOpacity="0.5" />
            <ellipse cx="50" cy="58" rx="26" ry="9.5" strokeOpacity="0.5" />
            <path d="M 50 12 C 34 28, 34 72, 50 88" strokeOpacity="0.5" />
        </svg>
    );
}

export function HolonomyIcon() {
    return (
        <svg {...common}>
            <circle cx="50" cy="50" r="38" />
            <path d="M 50 18 A 41 41 0 0 1 78 66" />
            <path d="M 78 66 A 41 41 0 0 1 26 73" />
            <path d="M 26 73 A 41 41 0 0 1 50 18" />
            <path d="M 50 18 L 44 24 M 50 18 L 57 23" />
        </svg>
    );
}

export function SchwarzschildIcon() {
    return (
        <svg {...common}>
            <circle cx="50" cy="50" r="12" fill="currentColor" stroke="none" />
            <ellipse cx="50" cy="50" rx="42" ry="14" strokeOpacity="0.7" />
            <ellipse cx="50" cy="50" rx="26" ry="8" strokeOpacity="0.4" />
        </svg>
    );
}

export function RelativityIcon() {
    return (
        <svg {...common}>
            <line x1="50" y1="8" x2="50" y2="92" strokeOpacity="0.5" />
            <line x1="12" y1="50" x2="88" y2="50" strokeOpacity="0.5" />
            <path d="M 50 8 L 88 50 L 50 92 L 12 50 Z" />
        </svg>
    );
}
