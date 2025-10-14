import { ext } from './browserApi';
import { createOrUpdateLooiGist } from './github';
import { Settings, GitHubSyncSettings } from './types';
import { isAPIResponse } from './utils';

export const defaultGithubSettings: GitHubSyncSettings = {
  lastSync: null,
  autoSync: true,
  publicGist: false,
  tokenSaved: false,
  gistId: undefined,
};

export const loadDefaultSettings: Settings = {
  bgColor: '#000000',
  bgUrl: '',
  githubSync: defaultGithubSettings,
  bookmarks: [],
  widgetConfigs: {
    calendar: {
      id: 'calendar',
      name: 'Calendar',
      enabled: true,
      position: { x: 100, y: 200 },
    },
    todo: {
      id: 'todo',
      name: 'To-Do List',
      enabled: false,
      position: { x: 300, y: 150 },
    },
  },
};

/**
 * Checks if GitHub sync should be performed based on settings.
 */
const shouldPerformGitHubSync = (githubSync: GitHubSyncSettings): boolean => {
  return (
    githubSync.tokenSaved && githubSync.autoSync && githubSync.lastSync !== null
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
    console.log('Performing GitHub sync...');
    console.log(settings);
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
    void performGitHubSync(settings.githubSync.gistId, settings, setSettings);
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
      loadDefaultSettings.bgColor,
    bgUrl:
      newSettings.bgUrl ?? currentSettings.bgUrl ?? loadDefaultSettings.bgUrl,
    githubSync:
      newSettings.githubSync ??
      currentSettings.githubSync ??
      loadDefaultSettings.githubSync,
    ...(newSettings.bookmarks !== undefined
      ? { bookmarks: newSettings.bookmarks }
      : currentSettings.bookmarks
        ? { bookmarks: currentSettings.bookmarks }
        : {}),
    widgetConfigs:
      newSettings.widgetConfigs ??
      currentSettings.widgetConfigs ??
      loadDefaultSettings.widgetConfigs,
    ...newSettings,
  };
  saveSettings(updatedSettings, setSettings);
  return updatedSettings;
};

export const getSettings = async (): Promise<Settings> => {
  if (!ext) return loadDefaultSettings;
  const stored = await ext.storage.local.get('settings');
  if (stored.settings) {
    return stored.settings as Settings;
  } else {
    ext.storage.local.set({ settings: loadDefaultSettings });
    return loadDefaultSettings;
  }
};
export const resetSettings = () => {
  if (!ext) return loadDefaultSettings;
  ext.storage.local.set({ settings: loadDefaultSettings });
};
