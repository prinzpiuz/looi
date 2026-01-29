import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';
import { getSettings, updateSettings } from '../utils/manageSettings';
import {
    Settings,
    Bookmark,
    SettingsContextType,
    GitHubSyncSettings,
    VersionedWidgetData,
} from '../utils/types';
import { LayoutItem } from 'react-grid-layout';

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const settingsRef = useRef<Settings | null>(null);
    const bookmarks = settings?.bookmarks || [];

    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    useEffect(() => {
        const load = async () => {
            const s = await getSettings();
            if (!s.widgetData) {
                s.widgetData = {};
            }
            setSettings(s);
        };
        void load();
    }, []);

    const getFreshSettings = useCallback(async (): Promise<Settings | null> => {
        if (settingsRef.current) {
            return settingsRef.current;
        }
        return await getSettings();
    }, []);

    const updateAndPersistSettings = useCallback(
        async (partialSettings: Partial<Settings>, saveChanges = true) => {
            const currentSettings = await getFreshSettings();
            if (!currentSettings) return;

            const updated = { ...currentSettings, ...partialSettings };
            setSettings(updated);
            settingsRef.current = updated;

            if (saveChanges) {
                await updateSettings(updated, setSettings);
            }
        },
        [getFreshSettings],
    );

    const addBookmark = useCallback(
        async (bookmark: Bookmark) => {
            const current = await getFreshSettings();
            if (!current) return;
            const newList = [...(current.bookmarks || []), bookmark];
            await updateAndPersistSettings({ bookmarks: newList });
        },
        [getFreshSettings, updateAndPersistSettings],
    );

    const updateBookmark = useCallback(
        async (id: string, updatedBookmark: Partial<Bookmark>) => {
            const current = await getFreshSettings();
            if (!current) return;
            const updatedBookmarks = (current.bookmarks || []).map((bm) =>
                bm.id === id ? { ...bm, ...updatedBookmark } : bm,
            );
            await updateAndPersistSettings({ bookmarks: updatedBookmarks });
        },
        [getFreshSettings, updateAndPersistSettings],
    );

    const removeBookmark = useCallback(
        async (id: string) => {
            const current = await getFreshSettings();
            if (!current) return;
            const updatedBookmarks = (current.bookmarks || []).filter(
                (bm) => bm.id !== id,
            );
            const updatedLayouts = (current.gridLayouts || []).filter(
                (l) => l.i !== id,
            );
            await updateAndPersistSettings({
                bookmarks: updatedBookmarks,
                gridLayouts: updatedLayouts,
            });
        },
        [getFreshSettings, updateAndPersistSettings],
    );

    const getBookmarkById = useCallback(
        (id: string): Bookmark | undefined => {
            return bookmarks.find((bm) => bm.id === id);
        },
        [bookmarks],
    );

    const enableDisableWidget = useCallback(
        async (id: string, enabled: boolean) => {
            const current = await getFreshSettings();
            if (!current?.widgetConfigs) return;
            const updatedWidgetConfigs = current.widgetConfigs.map((config) =>
                config.id === id ? { ...config, enabled } : config,
            );
            await updateAndPersistSettings({
                widgetConfigs: updatedWidgetConfigs,
            });
        },
        [getFreshSettings, updateAndPersistSettings],
    );

    const updateGridLayouts = useCallback(
        async (layouts: LayoutItem[]) => {
            await updateAndPersistSettings({ gridLayouts: layouts });
        },
        [updateAndPersistSettings],
    );

    const updateGithubSettings = useCallback(
        async (githubSettings: Partial<GitHubSyncSettings>) => {
            const current = await getFreshSettings();
            if (!current) return;
            const updated = {
                ...current.githubSync,
                ...githubSettings,
            };
            await updateAndPersistSettings({ githubSync: updated });
        },
        [getFreshSettings, updateAndPersistSettings],
    );

    const updateWidgetData = useCallback(
        async (widgetId: string, data: VersionedWidgetData) => {
            const current = await getFreshSettings();
            if (!current) return;

            const updatedWidgetData = {
                ...(current.widgetData || {}),
                [widgetId]: data,
            };

            await updateAndPersistSettings({ widgetData: updatedWidgetData });
        },
        [getFreshSettings, updateAndPersistSettings],
    );

    const getWidgetData = useCallback(
        <T,>(widgetId: string): VersionedWidgetData<T> | undefined => {
            if (!settings?.widgetData) return undefined;
            return settings.widgetData[widgetId] as
                | VersionedWidgetData<T>
                | undefined;
        },
        [settings],
    );

    const clearWidgetData = useCallback(
        async (widgetId: string) => {
            const current = await getFreshSettings();
            if (!current?.widgetData) return;

            const { [widgetId]: _, ...rest } = current.widgetData;
            await updateAndPersistSettings({ widgetData: rest });
        },
        [getFreshSettings, updateAndPersistSettings],
    );

    const clearAllWidgetData = useCallback(async () => {
        await updateAndPersistSettings({ widgetData: {} });
    }, [updateAndPersistSettings]);
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
                updateWidgetData,
                getWidgetData,
                clearWidgetData,
                clearAllWidgetData,
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
