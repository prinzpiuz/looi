import { browser } from "./browser_api";
import { Settings } from "./types";

export const loadDefaultSettings: Settings = {
  bgColor: "#000000", // Default background color
  bgUrl: "", // Default background image URL
  syncStatus: false,
  bookmarks: [],
  widgets: [], // Default sync status
};

export const saveSettings = async (settings: Settings) => {
  if (!browser) return {};
  console.log("Saving settings:", settings);
  browser.storage.local.set({ settings: settings });
};

export const updateSettings = async (newSettings: Partial<Settings>) => {
  const currentSettings = await getSettings();
  const updatedSettings: Settings = {
    bgColor:
      newSettings.bgColor ??
      currentSettings.bgColor ??
      loadDefaultSettings.bgColor,
    bgUrl:
      newSettings.bgUrl ?? currentSettings.bgUrl ?? loadDefaultSettings.bgUrl,
    syncStatus:
      newSettings.syncStatus ??
      currentSettings.syncStatus ??
      loadDefaultSettings.syncStatus,
    ...(newSettings.bookmarks !== undefined
      ? { bookmarks: newSettings.bookmarks }
      : currentSettings.bookmarks
        ? { bookmarks: currentSettings.bookmarks }
        : {}),
  };
  await saveSettings(updatedSettings);
  return updatedSettings;
};

export const getSettings = async (): Promise<Settings> => {
  if (!browser) return loadDefaultSettings;
  const stored = await browser.storage.local.get("settings");
  if (stored.settings) {
    return stored.settings as Settings;
  } else {
    await browser.storage.local.set({ settings: loadDefaultSettings });
    return loadDefaultSettings;
  }
};
export const resetSettings = async () => {
  if (!browser) return loadDefaultSettings;
  await browser.storage.local.set({ settings: loadDefaultSettings });
};
