import React, { useEffect, useState, useCallback } from 'react';
import { FaSyncAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ToggleButton from 'react-toggle-button';
import { useGitHubSync } from '../../../hooks/useGitHubSync';
import { useGistVerifier } from '../../../hooks/gistVerifier';
import { useSettings } from '../../../hooks/settingsContext';
import {
    closeTabAndOpen,
    formatLastSync,
    isTokenExpired,
} from '../../../utils/utils';
import '../../../assets/css/sync_settings.css';
import { SyncSettingsProps } from '../../../utils/types';
import { MIN_GIST_ID_LENGTH } from '../../../utils/constants';
import { toast } from '../../../utils/toastStore';

const SyncSettings: React.FC<SyncSettingsProps> = ({ onTokenReset }) => {
    const {
        githubSyncSettings,
        status,
        error: syncError,
        updateSyncSettings,
        resetToken,
        pushToGist,
    } = useGitHubSync();

    const {
        verifyGistId,
        verifying,
        valid,
        error: verifyError,
        pulledSettings,
    } = useGistVerifier();

    const { updateAndPersistSettings } = useSettings();

    const [gistId, setGistId] = useState(githubSyncSettings.gistId || '');
    const [displayLastSync, setDisplayLastSync] = useState('Never');

    useEffect(() => {
        toast.info(
            'Paste your Gist ID if you have one, or click "Sync Now" to create a new one.',
            { duration: 8000, id: 'gist-id-info' },
        );
    }, []);

    useEffect(() => {
        setDisplayLastSync(formatLastSync(githubSyncSettings.lastSync));

        const intervalId = setInterval(() => {
            setDisplayLastSync(formatLastSync(githubSyncSettings.lastSync));
        }, 60000);

        return () => clearInterval(intervalId);
    }, [githubSyncSettings.lastSync]);

    useEffect(() => {
        if (!verifying && valid === true && pulledSettings !== null) {
            const updatedSettings = {
                ...pulledSettings,
                githubSync: {
                    ...pulledSettings.githubSync,
                    gistId: gistId,
                },
            };

            void updateAndPersistSettings(updatedSettings).then(() => {
                toast.success('Settings pulled successfully!');
                setTimeout(() => closeTabAndOpen(), 1000);
            });
        }
    }, [verifying, valid, pulledSettings, gistId, updateAndPersistSettings]);

    useEffect(() => {
        if (!verifying && verifyError) {
            if (verifyError === 'Token Expired') {
                toast.error('Token expired. Please reconnect.');
                void handleResetToken();
            } else {
                toast.error(verifyError);
            }
        }
    }, [verifying, verifyError]);

    useEffect(() => {
        if (status === 'success') {
            toast.success('Sync completed successfully!');
        } else if (status === 'error' && syncError) {
            toast.error(syncError.message);
        }
    }, [status, syncError]);

    const handleAutoSyncToggle = useCallback(
        (currentValue: boolean) => {
            void updateSyncSettings({ autoSync: !currentValue });
            toast.info(
                !currentValue ? 'Auto-sync enabled' : 'Auto-sync disabled',
            );
        },
        [updateSyncSettings],
    );

    const handleResetToken = useCallback(async () => {
        try {
            if (isTokenExpired(githubSyncSettings)) {
                toast.info('Token expired. Resetting token.');
                await resetToken();
                onTokenReset();
                return;
            }

            const confirmed = window.confirm(
                'Are you sure you want to reset your GitHub token?',
            );

            if (confirmed) {
                await resetToken();
                onTokenReset();
                toast.info('Token reset. Please reconnect to GitHub.');
            }
        } catch (_) {
            toast.error('Failed to reset token. Please try again.');
        }
    }, [resetToken, onTokenReset, githubSyncSettings]);

    const handleVerifyAndPull = useCallback(() => {
        if (gistId.length >= MIN_GIST_ID_LENGTH) {
            toast.info('Verifying Gist...', { id: 'verify', persistent: true });
            void verifyGistId(gistId).finally(() => {
                toast.dismiss('verify');
            });
        } else {
            toast.warning(
                `Gist ID must be at least ${MIN_GIST_ID_LENGTH} characters`,
            );
        }
    }, [gistId, verifyGistId]);

    const handleSyncNow = useCallback(() => {
        toast.info('Syncing...', { id: 'sync', persistent: true });
        void pushToGist().finally(() => {
            toast.dismiss('sync');
        });
    }, [pushToGist]);

    const handleGistIdChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setGistId(e.target.value);
        },
        [],
    );

    const isVerifyDisabled =
        verifying || status === 'syncing' || gistId.length < MIN_GIST_ID_LENGTH;
    const isSyncDisabled = status === 'syncing' || verifying;
    const currentError = syncError?.message || verifyError;

    return (
        <div className="sync-settings">
            <h3 className="sync-settings__title">Connected</h3>

            <div className="sync-settings__options">
                <div className="sync-settings__row">
                    <label className="sync-settings__label">Auto Sync</label>
                    <ToggleButton
                        value={githubSyncSettings.autoSync}
                        onToggle={handleAutoSyncToggle}
                    />
                </div>
            </div>

            <div className="sync-settings__last-sync">
                <span className="sync-settings__last-sync-label">
                    Last Synced
                </span>
                <span className="sync-settings__last-sync-value">
                    {displayLastSync}
                </span>
            </div>

            <div className="sync-settings__gist-section">
                <div className="sync-settings__input-wrapper">
                    <input
                        type="text"
                        className="sync-settings__input"
                        value={gistId}
                        onChange={handleGistIdChange}
                        placeholder="Enter Gist ID"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        aria-label="GitHub Gist ID"
                    />
                    <div className="sync-settings__input-status">
                        {verifying && (
                            <FaSyncAlt className="sync-settings__spinner" />
                        )}
                        {!verifying && valid === true && (
                            <FaCheckCircle color="#00e676" />
                        )}
                        {!verifying && valid === false && (
                            <FaTimesCircle color="#ff5252" />
                        )}
                    </div>
                </div>

                {currentError && (
                    <p className="sync-settings__error">{currentError}</p>
                )}
            </div>

            <div className="sync-settings__buttons">
                <button
                    type="button"
                    className="sync-settings__button sync-settings__button--primary"
                    onClick={handleVerifyAndPull}
                    disabled={isVerifyDisabled}
                    aria-busy={verifying}
                >
                    {verifying ? (
                        <>
                            Verifying...
                            <FaSyncAlt className="sync-settings__spinner" />
                        </>
                    ) : (
                        'Verify & Pull'
                    )}
                </button>

                <button
                    type="button"
                    className="sync-settings__button sync-settings__button--primary"
                    onClick={handleSyncNow}
                    disabled={isSyncDisabled}
                    aria-busy={status === 'syncing'}
                >
                    {status === 'syncing' ? (
                        <>
                            Syncing...
                            <FaSyncAlt className="sync-settings__spinner" />
                        </>
                    ) : (
                        'Sync Now'
                    )}
                </button>

                <button
                    type="button"
                    className="sync-settings__button sync-settings__button--danger"
                    onClick={() => void handleResetToken()}
                >
                    Reset Token
                </button>
            </div>

            {status === 'success' && (
                <div className="sync-settings__status sync-settings__status--success">
                    ✓ Sync successful!
                </div>
            )}
            {status === 'error' && !currentError && (
                <div className="sync-settings__status sync-settings__status--error">
                    Sync failed. Please try again.
                </div>
            )}
        </div>
    );
};

export default SyncSettings;
