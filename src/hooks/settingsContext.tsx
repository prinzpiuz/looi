import React, { createContext, useContext, useState, useEffect } from "react";
import { getSettings, updateSettings } from "../utils/manage_settings";
import { Settings, Bookmark, SettingsContextType } from "../utils/types";

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const bookmarks = settings?.bookmarks || [];

  useEffect(() => {
    const load = async () => {
      const s = await getSettings();
      setSettings(s);
    };
    load();
  }, []);

  const updateAndPersistSettings = async (
    partialSettings: Partial<Settings>,
  ) => {
    if (!settings) return;
    const updated = { ...settings, ...partialSettings };
    setSettings(updated);
    await updateSettings(updated);
  };

  const addBookmark = async (bookmark: Bookmark) => {
    const newList = [...bookmarks, bookmark];
    await updateAndPersistSettings({ bookmarks: newList });
  };

  const updateBookmark = async (
    id: string,
    updatedBookmark: Partial<Bookmark>,
  ) => {
    const updatedBookmarks = bookmarks.map((bm) =>
      bm.id === id ? { ...bm, ...updatedBookmark } : bm,
    );
    await updateAndPersistSettings({ bookmarks: updatedBookmarks });
  };

  const removeBookmark = async (id: string) => {
    const updatedBookmarks = bookmarks.filter((bm) => bm.id !== id);
    await updateAndPersistSettings({ bookmarks: updatedBookmarks });
  };

  const getBookmarkById = (id: string): Bookmark | undefined => {
    return bookmarks.find((bm) => bm.id === id);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        addBookmark,
        updateBookmark,
        removeBookmark,
        getBookmarkById,
        updateAndPersistSettings,
      }}
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
