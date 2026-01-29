import React, { useEffect, useState } from 'react';
import { toast } from '../../../utils/toastStore';
import '../../../assets/css/pat_input.css';

interface GithubPATInputProps {
    onToken: (token: string) => void;
}

const GithubPATInput: React.FC<GithubPATInputProps> = ({ onToken }) => {
    const [focus, setFocus] = useState(false);
    const [pat, setPat] = useState('');

    const isActive = focus || pat.length > 0;

    useEffect(() => {
        toast.info('Paste your GitHub Personal Access Token (scope: gist)', {
            duration: 8000,
            id: 'pat-info',
        });
    }, []);

    const handleSave = () => {
        if (!/^ghp_/i.test(pat.trim())) {
            toast.error(
                'That does not look like a valid GitHub Personal Access Token.',
            );
            return;
        }
        toast.success('Token Saved Successfully!');
        onToken(pat.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div className="pat-container">
            <div
                className={`pat-input-wrapper ${isActive ? 'active' : ''} ${focus ? 'focused' : ''}`}
            >
                <input
                    id="token-input"
                    type="password"
                    className="pat-input"
                    value={pat}
                    onChange={(e) => setPat(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder=" "
                />
                <label htmlFor="token-input" className="pat-label">
                    GitHub Token
                </label>
            </div>

            <button
                type="button"
                className="pat-button"
                onClick={handleSave}
                disabled={!pat.trim()}
            >
                Save Token
            </button>

            <div className="pat-help">
                <span>Don&apos;t have a token?</span>

                <a
                    href="https://github.com/settings/tokens/new?scopes=gist&description=Looi%20Settings%20Sync"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Create one here
                </a>
            </div>
        </div>
    );
};

export default GithubPATInput;
