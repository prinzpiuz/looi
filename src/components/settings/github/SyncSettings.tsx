import React, { useEffect, useState } from 'react';
import { FaSyncAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ToggleButton from 'react-toggle-button';
import { useGitHubSync } from '../../../hooks/useGitHubSync';
import { useGistVerifier, VerifyErrors } from '../../../hooks/gistVerifier';
import { updateSettings } from '../../../utils/manageSettings';
import { closeTabAndOpen } from '../../../utils/utils';

const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
};

const labelStyle: React.CSSProperties = {
    color: '#ffffff',
    fontWeight: 500,
    marginTop: 10,
};

const connectButtonStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 15,
    border: 0,
    borderRadius: 8,
    padding: '12px 32px',
    background: 'linear-gradient(90deg,#2f82e4,#4559f9)',
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 2.5px 8px rgba(83,99,190,0.05)',
    transition: 'background .14s, color .14s, box-shadow .13s',
};

const syncSettingsDivStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 180,
    marginTop: -15,
};

const connectedStyle: React.CSSProperties = {
    color: '#ffffff',
};

const lastSyncStyle: React.CSSProperties = {
    marginTop: -6,
    color: '#ffffff',
    fontWeight: 600,
};

const lastSyncdivStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginTop: 15,
};

const optionsDivStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
};

const syncStatusStyle: React.CSSProperties = {
    color: '#ffffff',
    fontWeight: 600,
};

const syncingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
};

const syncAnimation: React.CSSProperties = {
    animation: 'spin 1s linear infinite',
    color: '#ffffff',
};

const gistIdDivStyle: React.CSSProperties = {
    marginTop: 17,
};

const verifyDivStyle: React.CSSProperties = {
    position: 'absolute',
    right: '21%',
    top: '72%',
    transform: 'translateY(-50%)',
};

const SyncSettings: React.FC<{
    onTokenReset: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onTokenReset }) => {
    const {
        githubSyncSettings,
        status,
        updateSyncSettings,
        resetToken,
        syncNow,
    } = useGitHubSync();
    const { verifyGistId, verifying, valid, error, pulledSettings } =
        useGistVerifier();
    const [localAutoSync, setLocalAutoSync] = useState(
        githubSyncSettings.autoSync,
    );
    const [localPublicGist, setLocalPublicGist] = useState(
        githubSyncSettings.publicGist,
    );

    const [displayLastSync, setDisplayLastSync] = useState('Never');
    const [focus, setFocus] = useState(false);
    const [gistId, setGistId] = useState(githubSyncSettings.gistId || '');
    const [showNote, setShowNote] = useState(true);

    setTimeout(() => {
        setShowNote(false);
    }, 8000);

    const buttonDivStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: showNote ? -10 : 15,
    };

    const inputStyle: React.CSSProperties = {
        width: '60%',
        height: 3,
        border: 'none',
        borderRadius: 5,
        outline: focus ? '2px solid #2189fa' : '1.2px solid #dfdff5',
        background: 'rgba(255,255,255,0.16)',
        boxShadow: focus
            ? '0 2px 10px rgba(33,137,250,0.13)'
            : '0 1.5px 5px rgba(60,90,160,0.04)',
        fontSize: '1rem',
        padding: '24px 38px 8px 35px',
        color: '#1f283b',
        transition: 'box-shadow .14s, outline .12s',
    };

    const inputLabelStyle: React.CSSProperties = {
        position: 'absolute',
        left: 52,
        bottom: 295,
        fontSize: focus || gistId ? 13 : 16,
        color: focus ? '#ffffffff' : '#8d97ad',
        padding: '0 3px',
        pointerEvents: 'none',
        transition: 'all .18s cubic-bezier(.4,0,.2,1)',
        fontWeight: 600,
    };

    const setAutoSync = (value: boolean) => {
        setLocalAutoSync(!value);
        updateSyncSettings({
            autoSync: !value,
        });
    };

    const setPublicGist = (value: boolean) => {
        setLocalPublicGist(!value);
        updateSyncSettings({
            publicGist: !value,
        });
    };

    const handleResetToken = () => {
        void resetToken();
        onTokenReset(false);
    };

    useEffect(() => {
        const formatLastSync = () => {
            if (!githubSyncSettings.lastSync) return 'Never';
            const d = new Date(githubSyncSettings.lastSync);
            const weekday = d.toLocaleString(undefined, { weekday: 'long' });
            const time = d.toLocaleString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: false,
            });
            return `${weekday} ${time}`;
        };

        setDisplayLastSync(formatLastSync());

        const intervalId = setInterval(() => {
            setDisplayLastSync(formatLastSync());
        }, 60000);

        return () => clearInterval(intervalId);
    }, [githubSyncSettings.lastSync]);

    const verifyGistID = () => {
        if (gistId.length >= 8) {
            void verifyGistId(gistId);
            setTimeout(() => {
                if (
                    !verifying &&
                    valid === true &&
                    error === null &&
                    pulledSettings !== null
                ) {
                    pulledSettings.githubSync.gistId = gistId;
                    void updateSettings(pulledSettings);
                    closeTabAndOpen();
                }
                if (!verifying && error === VerifyErrors.TOKEN_EXPIRED) {
                    handleResetToken();
                }
            }, 2000);
        }
    };

    return (
        <div style={syncSettingsDivStyle}>
            <h3 style={connectedStyle}>Connected</h3>

            <div style={optionsDivStyle}>
                <div style={rowStyle}>
                    <label style={labelStyle}>Auto Sync</label>
                    <ToggleButton
                        value={localAutoSync}
                        onToggle={setAutoSync}
                    />
                </div>

                <div style={rowStyle}>
                    <label style={labelStyle}>Public Gist</label>
                    <ToggleButton
                        value={localPublicGist}
                        onToggle={setPublicGist}
                    />
                </div>
            </div>

            <div style={lastSyncdivStyle}>
                <span style={lastSyncStyle}>Last Synced</span>
                <span style={syncStatusStyle}>{displayLastSync}</span>
            </div>
            <div style={gistIdDivStyle}>
                <label htmlFor="gist-input" style={inputLabelStyle}>
                    Gist ID
                </label>
                <input
                    value={gistId}
                    onChange={(e) => setGistId(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={inputStyle}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                />
                <div style={verifyDivStyle}>
                    {verifying && <FaSyncAlt style={syncAnimation} />}
                    {!verifying && valid === true && (
                        <FaCheckCircle color="#00e676" />
                    )}
                    {!verifying && valid === false && (
                        <FaTimesCircle color="#ff5252" />
                    )}
                </div>
                {showNote && (
                    <h5 style={labelStyle}>
                        Note: Paste your Gist ID, if you already have Looi
                        Settings Gist And then click Sync Now.
                        <br />
                        If you dont have one, click Sync Now for creating one.
                    </h5>
                )}
            </div>

            <div style={buttonDivStyle}>
                <button
                    style={connectButtonStyle}
                    onClick={() => void verifyGistID()}
                    disabled={status === 'syncing'}
                >
                    Verify & Pull
                </button>
                <button
                    style={connectButtonStyle}
                    onClick={() => void syncNow()}
                    disabled={status === 'syncing'}
                >
                    {status === 'syncing' ? (
                        <span style={syncingStyle}>
                            Syncing...
                            <FaSyncAlt style={syncAnimation} />
                        </span>
                    ) : (
                        'Sync Now'
                    )}
                </button>
                <button style={connectButtonStyle} onClick={handleResetToken}>
                    Reset Token
                </button>
            </div>

            {status === 'success' && (
                <p style={syncStatusStyle}>Sync successful!</p>
            )}
            {status === 'error' && <p style={syncStatusStyle}>Sync failed.</p>}
        </div>
    );
};

export default SyncSettings;
