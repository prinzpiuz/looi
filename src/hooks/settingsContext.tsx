import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../utils/manageSettings';
import {
    Settings,
    Bookmark,
    SettingsContextType,
    GitHubSyncSettings,
} from '../utils/types';
import { LayoutItem } from 'react-grid-layout';

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const bookmarks = settings?.bookmarks || [];
    const widgetConfigs = settings?.widgetConfigs || [];

    useEffect(() => {
        const load = async () => {
            const s = await getSettings();
            setSettings(s);
        };
        void load();
    }, []);

    const updateAndPersistSettings = async (
        partialSettings: Partial<Settings>,
        saveChanges = true,
    ) => {
        if (!settings) return;
        const updated = { ...settings, ...partialSettings };
        setSettings(updated);
        if (saveChanges) {
            await updateSettings(updated, setSettings);
        }
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
        const updatedLayouts = (settings?.gridLayouts || []).filter(
            (l) => l.i !== id,
        );
        await updateAndPersistSettings({
            bookmarks: updatedBookmarks,
            gridLayouts: updatedLayouts,
        });
    };

    const getBookmarkById = (id: string): Bookmark | undefined => {
        return bookmarks.find((bm) => bm.id === id);
    };

    const enableDisableWidget = async (id: string, enabled: boolean) => {
        if (!widgetConfigs) return;
        const updatedWidgetConfigs = widgetConfigs.map((config) =>
            config.id === id ? { ...config, enabled } : config,
        );
        await updateAndPersistSettings({ widgetConfigs: updatedWidgetConfigs });
    };

    const updateGridLayouts = async (layouts: LayoutItem[]) => {
        await updateAndPersistSettings({ gridLayouts: layouts });
    };

    const updateGithubSettings = async (
        githubSettings: Partial<GitHubSyncSettings>,
    ) => {
        if (!settings) return;
        const updated = {
            ...settings.githubSync,
            ...githubSettings,
        };
        await updateAndPersistSettings({ githubSync: updated });
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
                updateGridLayouts,
                enableDisableWidget,
                updateGithubSettings,
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
        throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
