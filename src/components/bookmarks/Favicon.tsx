import { useState, useEffect } from 'react';
import { getDomain, resolveFavicon } from '../../utils/favicon';
import '../../assets/css/favicon.css';

interface FaviconProps {
    url: string;
    name: string;
    customIcon?: string;
    size?: number;
}

const AVATAR_COLORS = [
    '#478559',
    '#496393',
    '#787197',
    '#c89666',
    '#008080',
    '#a28089',
    '#51d0de',
    '#8f8d9d',
];

const LetterAvatar: React.FC<{ label: string; size: number }> = ({
    label,
    size,
}) => {
    const letter = (label.trim()[0] || '?').toUpperCase();
    const color = AVATAR_COLORS[letter.charCodeAt(0) % AVATAR_COLORS.length];

    return (
        <div
            className="favicon favicon--letter"
            style={{
                width: size,
                height: size,
                background: color,
                fontSize: size * 0.5,
            }}
            aria-hidden="true"
        >
            {letter}
        </div>
    );
};

const Favicon: React.FC<FaviconProps> = ({
    url,
    name,
    customIcon,
    size = 32,
}) => {
    const domain = getDomain(url);
    const [src, setSrc] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>(
        'loading',
    );

    useEffect(() => {
        let active = true;
        setStatus('loading');
        setSrc(null);

        resolveFavicon(domain, customIcon)
            .then((result) => {
                if (!active) return;
                if (result) {
                    setSrc(result);
                    setStatus('loaded');
                } else {
                    setStatus('failed');
                }
            })
            .catch(() => {
                if (active) setStatus('failed');
            });

        return () => {
            active = false;
        };
    }, [domain, customIcon]);

    if (status === 'failed') {
        return <LetterAvatar label={name || domain} size={size} />;
    }

    if (status === 'loading' || !src) {
        return (
            <div
                className="favicon favicon--loading"
                style={{ width: size, height: size }}
                aria-hidden="true"
            />
        );
    }

    return (
        <img
            className="favicon"
            src={src}
            alt=""
            width={size}
            height={size}
            // Safety net: if the cached data URL is somehow broken
            onError={() => setStatus('failed')}
        />
    );
};

export default Favicon;
