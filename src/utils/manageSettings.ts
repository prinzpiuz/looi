import { ext } from './browserApi';
import { LOAD_DEFAULT_SETTINGS } from './constants';
import { createOrUpdateLooiGist } from './github';
import { Settings, GitHubSyncSettings } from './types';
import { isAPIResponse } from './utils';

/**
 * Checks if GitHub sync should be performed based on settings.
 */
const shouldPerformGitHubSync = (githubSync: GitHubSyncSettings): boolean => {
    return (
        githubSync.tokenSaved &&
        githubSync.autoSync &&
        githubSync.lastSync !== null
    );
};

/**
 * Handles the asynchronous GitHub sync operation.
 */
const performGitHubSync = async (
    gistId: string | undefined,
    settings: Settings,
    setSettings?: React.Dispatch<React.SetStateAction<Settings | null>>,
): Promise<void> => {
    try {
        const data = await createOrUpdateLooiGist(gistId, settings);
        if (!isAPIResponse(data)) {
            /* empty */
        } else {
            ext?.storage.local.set({ settings: data.settings });
            setSettings?.(data.settings);
        }
    } catch (_) {
        /* empty */
    }
};

export const saveSettings = (
    settings: Settings,
    setSettings?: React.Dispatch<React.SetStateAction<Settings | null>>,
) => {
    ext?.storage.local.set({ settings: settings });
    if (shouldPerformGitHubSync(settings.githubSync)) {
        void performGitHubSync(
            settings.githubSync.gistId,
            settings,
            setSettings,
        );
    }
};

export const updateSettings = async (
    newSettings: Partial<Settings>,
    setSettings?: React.Dispatch<React.SetStateAction<Settings | null>>,
) => {
    const currentSettings = await getSettings();
    const updatedSettings: Settings = {
        bgColor:
            newSettings.bgColor ??
            currentSettings.bgColor ??
            LOAD_DEFAULT_SETTINGS.bgColor,
        bgUrl:
            newSettings.bgUrl ??
            currentSettings.bgUrl ??
            LOAD_DEFAULT_SETTINGS.bgUrl,
        githubSync:
            newSettings.githubSync ??
            currentSettings.githubSync ??
            LOAD_DEFAULT_SETTINGS.githubSync,
        ...(newSettings.bookmarks !== undefined
            ? { bookmarks: newSettings.bookmarks }
            : currentSettings.bookmarks
              ? { bookmarks: currentSettings.bookmarks }
              : {}),
        widgetConfigs:
            newSettings.widgetConfigs ??
            currentSettings.widgetConfigs ??
            LOAD_DEFAULT_SETTINGS.widgetConfigs,
        ...newSettings,
    };
    saveSettings(updatedSettings, setSettings);
    return updatedSettings;
};

export const getSettings = async (): Promise<Settings> => {
    if (!ext) return LOAD_DEFAULT_SETTINGS;
    const stored = await ext.storage.local.get('settings');
    if (stored.settings) {
        return stored.settings as Settings;
    } else {
        ext.storage.local.set({ settings: LOAD_DEFAULT_SETTINGS });
        return LOAD_DEFAULT_SETTINGS;
    }
};
export const resetSettings = () => {
    if (!ext) return LOAD_DEFAULT_SETTINGS;
    ext.storage.local.set({ settings: LOAD_DEFAULT_SETTINGS });
};
