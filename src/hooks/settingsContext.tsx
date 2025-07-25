import React, { createContext, useContext, useState, useEffect } from "react";
import { getSettings, updateSettings } from "../utils/manage_settings";
import { Settings, Bookmark, SettingsContextType } from "../utils/types";



const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const load = async () => {
      const s = await getSettings();
      setSettings(s);
    };
    load();
  }, []);

  const updateAndPersistSettings = async (partialSettings: Partial<Settings>) => {
    if (!settings) return;
    const updated = { ...settings, ...partialSettings };
    setSettings(updated);
    await updateSettings(updated);
  };

  const addBookmark = async (bookmark:Bookmark) => {
    const newList = [...bookmarks, bookmark];
    setBookmarks(newList);
    await updateAndPersistSettings({ bookmarks: newList });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings, addBookmark, updateAndPersistSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
