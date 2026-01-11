import { useState, useCallback, useEffect, useRef } from 'react';
import {
    GitHubSyncSettings,
    SyncStatus,
    Settings,
    UseGitHubSyncReturn,
    SyncError,
} from '../utils/types';
import {
    getToken,
    removeToken,
    createOrUpdateLooiGist,
    findGist,
} from '../utils/github';
import { DEFAULT_GITHUB_SYNC_SETTINGS } from '../utils/constants';
import { useSettings } from './settingsContext';
import { isAPIResponse, isTokenExpired } from '../utils/utils';

export const useGitHubSync = (): UseGitHubSyncReturn => {
    const { settings, updateGithubSettings, updateAndPersistSettings } =
        useSettings();

    const githubSyncSettings =
        settings?.githubSync || DEFAULT_GITHUB_SYNC_SETTINGS;

    const [status, setStatus] = useState<SyncStatus>('idle');
    const [error, setError] = useState<SyncError | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isTokenLoading, setIsTokenLoading] = useState(true);

    const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (statusTimeoutRef.current) {
                clearTimeout(statusTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const loadToken = async () => {
            setIsTokenLoading(true);
            try {
                const storedToken = await getToken();
                if (isMountedRef.current) {
                    setToken(storedToken || null);
                }
            } catch (_) {
                if (isMountedRef.current) {
                    setToken(null);
                }
            } finally {
                if (isMountedRef.current) {
                    setIsTokenLoading(false);
                }
            }
        };
        void loadToken();
    }, []);

    const setStatusWithReset = useCallback(
        (newStatus: SyncStatus, resetDelay?: number) => {
            if (!isMountedRef.current) return;

            if (statusTimeoutRef.current) {
                clearTimeout(statusTimeoutRef.current);
                statusTimeoutRef.current = null;
            }

            setStatus(newStatus);

            if (
                resetDelay &&
                (newStatus === 'success' || newStatus === 'error')
            ) {
                statusTimeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        setStatus('idle');
                    }
                }, resetDelay);
            }
        },
        [],
    );

    const updateSyncSettings = useCallback(
        async (patch: Partial<GitHubSyncSettings>) => {
            await updateGithubSettings(patch);
        },
        [updateGithubSettings],
    );

    const resetToken = useCallback(async () => {
        await removeToken();
        setToken(null);
        await updateGithubSettings(DEFAULT_GITHUB_SYNC_SETTINGS);
    }, [updateGithubSettings]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const validateToken = useCallback((): boolean => {
        if (!token) {
            setError({
                message: 'No GitHub token found',
                code: 'TOKEN_EXPIRED',
            });
            return false;
        }

        if (
            githubSyncSettings.storedAt &&
            isTokenExpired(githubSyncSettings.storedAt)
        ) {
            setError({
                message: 'GitHub token has expired',
                code: 'TOKEN_EXPIRED',
            });
            return false;
        }

        return true;
    }, [token, githubSyncSettings.storedAt]);

    const pullFromGist = useCallback(async (): Promise<Settings | null> => {
        if (!validateToken()) return null;

        const gistId = githubSyncSettings.gistId;
        if (!gistId) {
            setError({
                message: 'No Gist ID configured',
                code: 'GIST_NOT_FOUND',
            });
            return null;
        }

        setStatusWithReset('syncing');
        setError(null);

        try {
            const response = await findGist(gistId);

            if (!isAPIResponse(response)) {
                setError({
                    message: 'Token expired or unauthorized',
                    code: 'TOKEN_EXPIRED',
                });
                setStatusWithReset('error', 3000);
                return null;
            }

            if (!response.settings) {
                setError({
                    message: 'No settings found in Gist',
                    code: 'GIST_NOT_FOUND',
                });
                setStatusWithReset('error', 3000);
                return null;
            }

            await updateAndPersistSettings(response.settings);
            await updateSyncSettings({ lastSync: Date.now() });

            setStatusWithReset('success', 2000);
            return response.settings;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to pull from Gist';
            setError({ message, code: 'NETWORK_ERROR' });
            setStatusWithReset('error', 3000);
            return null;
        }
    }, [
        validateToken,
        githubSyncSettings.gistId,
        setStatusWithReset,
        updateAndPersistSettings,
        updateSyncSettings,
    ]);

    const pushToGist = useCallback(async (): Promise<void> => {
        if (!validateToken()) return;
        if (!settings) {
            setError({ message: 'No settings to sync', code: 'UNKNOWN' });
            return;
        }

        setStatusWithReset('syncing');
        setError(null);

        try {
            const response = await createOrUpdateLooiGist(
                githubSyncSettings.gistId,
                settings,
            );

            if (!isAPIResponse(response)) {
                setError({
                    message: 'Token expired or unauthorized',
                    code: 'TOKEN_EXPIRED',
                });
                setStatusWithReset('error', 3000);
                return;
            }

            if (response.settings && !githubSyncSettings.gistId) {
                await updateSyncSettings({
                    gistId: response.gistId,
                    lastSync: Date.now(),
                });
            } else {
                await updateSyncSettings({ lastSync: Date.now() });
            }

            setStatusWithReset('success', 2000);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Failed to push to Gist';
            setError({ message, code: 'NETWORK_ERROR' });
            setStatusWithReset('error', 3000);
        }
    }, [
        validateToken,
        settings,
        githubSyncSettings.gistId,
        setStatusWithReset,
        updateSyncSettings,
    ]);

    const syncNow = useCallback(async (): Promise<void> => {
        await pushToGist();
    }, [pushToGist]);

    return {
        // State
        githubSyncSettings,
        token,
        status,
        error,
        isTokenLoading,
        isSyncing: status === 'syncing',

        // Actions
        updateSyncSettings,
        resetToken,
        syncNow,
        pullFromGist,
        pushToGist,
        clearError,
    };
};
