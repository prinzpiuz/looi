import { ext } from './browserApi';
import { createOrUpdateLooiGist } from './github';
import { Settings, GitHubSyncSettings } from './types';

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

export const saveSettings = (
  settings: Settings,
  setSettings?: React.Dispatch<React.SetStateAction<Settings | null>>,
) => {
  ext?.storage.local.set({ settings: settings });
  if (settings.githubSync.tokenSaved && settings.githubSync.autoSync) {
    void createOrUpdateLooiGist(settings.githubSync.gistId, settings).then((data) => {
      ext?.storage.local.set({ settings: data.settings });
      setSettings?.(data.settings);
    });
  }
};

export const updateSettings = async (
  newSettings: Partial<Settings>,
  setSettings?: React.Dispatch<React.SetStateAction<Settings | null>>,
) => {
  const currentSettings = await getSettings();
  const updatedSettings: Settings = {
    bgColor: newSettings.bgColor ?? currentSettings.bgColor ?? loadDefaultSettings.bgColor,
    bgUrl: newSettings.bgUrl ?? currentSettings.bgUrl ?? loadDefaultSettings.bgUrl,
    githubSync:
      newSettings.githubSync ?? currentSettings.githubSync ?? loadDefaultSettings.githubSync,
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
