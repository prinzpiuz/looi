import { useState, useCallback, useEffect } from "react";
import { GitHubSyncSettings, SyncStatus } from "../utils/types";
import { getToken, removeToken } from "../utils/github";
import { useSettings } from "./settingsContext";
import { defaultGithubSettings } from "../utils/manageSettings";

export const useGitHubSync = () => {
  const { settings, updateGithubSettings } = useSettings();

  const [githubSyncSettings, setGithubSyncSettings] =
    useState<GitHubSyncSettings>(settings?.githubSync || defaultGithubSettings);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [token, setToken] = useState<string | null>(null);

  // Load settings from storage
  useEffect(() => {
    const loadToken = async () => {
      const s = await getToken();
      setToken(s);
    };
    void loadToken();
  }, []);

  // Save to storage
  const saveSettings = useCallback((newSettings: GitHubSyncSettings) => {
    setGithubSyncSettings(newSettings);
    void updateGithubSettings(newSettings);
  }, []);

  const updateSyncSettings = useCallback(
    (patch: Partial<GitHubSyncSettings>) => {
      saveSettings({ ...githubSyncSettings, ...patch });
    },
    [githubSyncSettings, saveSettings],
  );

  const resetToken = useCallback(() => {
    void removeToken();
    saveSettings(defaultGithubSettings);
  }, [saveSettings]);

  const syncNow = useCallback(async () => {
    setStatus("syncing");
    try {
      // TODO: call GitHub API with `settings.token`
      // simulate delay
      await new Promise((res) => setTimeout(res, 1500));
      updateSyncSettings({ lastSync: Date.now() });
      setStatus("success");
    } catch (e) {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }, [token, updateSyncSettings]);

  return {
    githubSyncSettings,
    token,
    status,
    saveSettings,
    updateSyncSettings,
    resetToken,
    syncNow,
  };
};
