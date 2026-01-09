import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from './settingsContext';
import {
    WidgetDataConfig,
    UseWidgetDataReturn,
    VersionedWidgetData,
} from '../utils/types';
import { debounce } from '../utils/debounce';

/**
 * Runs migrations on widget data from oldVersion to targetVersion
 */
const migrateData = <T>(
    data: unknown,
    fromVersion: number,
    toVersion: number,
    migrations: Record<number, (oldData: unknown) => T> | undefined,
    defaultData: T,
) => {
    // If no migrations needed or no migrations defined
    if (fromVersion >= toVersion || !migrations) {
        return data as T;
    }

    let currentData = data;
    let currentVersion = fromVersion;

    // Apply migrations sequentially
    while (currentVersion < toVersion) {
        const nextVersion = currentVersion + 1;
        const migrationFn = migrations[nextVersion];

        if (migrationFn) {
            try {
                currentData = migrationFn(currentData);
                // console.log(
                //   `[WidgetData] Migrated from v${currentVersion} to v${nextVersion}`,
                // );
            } catch (_) {
                /* empty */
                // console.error(
                //   `[WidgetData] Migration to v${nextVersion} failed:`,
                //   error,
                // );
                // Return default data if migration fails
                return defaultData;
            }
        }

        currentVersion = nextVersion;
    }

    return currentData as T;
};

/**
 * Generic hook for managing widget data with versioning and migrations
 *
 * @example
 * const { data, updateData, resetData } = useWidgetData<TodoWidgetData>({
 *   widgetId: 'todo',
 *   version: 1,
 *   defaultData: { tasks: [], showCompleted: true },
 *   migrations: {
 *     // Migration from v1 to v2
 *     2: (oldData) => ({ ...oldData, newField: 'default' }),
 *   },
 * });
 */
export const useWidgetData = <T>(
    config: WidgetDataConfig<T>,
): UseWidgetDataReturn<T> => {
    const { widgetId, version, defaultData, migrations } = config;
    const { settings, updateWidgetData } = useSettings();

    const [localData, setLocalData] = useState<T>(defaultData);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    // Track if initial load is complete
    const initialLoadComplete = useRef(false);

    // Debounced save function
    const debouncedSave = useRef(
        debounce((...args: unknown[]) => {
            const [widgetId, data] = args as [string, VersionedWidgetData<T>];
            void updateWidgetData(widgetId, data);
        }, 500),
    ).current;

    // Load and migrate data on mount
    useEffect(() => {
        if (!settings || initialLoadComplete.current) return;

        const storedWidgetData = settings.widgetData?.[widgetId];

        if (storedWidgetData) {
            const {
                version: storedVersion,
                data: storedData,
                updatedAt,
            } = storedWidgetData;

            // Check if migration is needed
            if (storedVersion < version) {
                const migratedData = migrateData<T>(
                    storedData,
                    storedVersion,
                    version,
                    migrations,
                    defaultData,
                );
                setLocalData(migratedData);
                setLastUpdated(updatedAt);

                // Save migrated data
                const newVersionedData: VersionedWidgetData<T> = {
                    version,
                    data: migratedData,
                    updatedAt: Date.now(),
                };
                void updateWidgetData(widgetId, newVersionedData);
            } else {
                setLocalData(storedData as T);
                setLastUpdated(updatedAt);
            }
        } else {
            // No existing data, use defaults
            setLocalData(defaultData);
        }

        setIsLoading(false);
        initialLoadComplete.current = true;
    }, [
        settings,
        widgetId,
        version,
        defaultData,
        migrations,
        updateWidgetData,
    ]);

    // Update data function
    const updateData = useCallback(
        (updater: Partial<T> | ((prev: T) => T)) => {
            setLocalData((prev) => {
                const newData =
                    typeof updater === 'function'
                        ? (updater as (prev: T) => T)(prev)
                        : { ...prev, ...updater };

                const now = Date.now();
                setLastUpdated(now);

                // Debounced save to storage
                const versionedData: VersionedWidgetData<T> = {
                    version,
                    data: newData,
                    updatedAt: now,
                };
                debouncedSave(widgetId, versionedData);

                return newData;
            });
        },
        [widgetId, version, debouncedSave],
    );

    // Reset to default data
    const resetData = useCallback(() => {
        setLocalData(defaultData);
        setLastUpdated(Date.now());

        const versionedData: VersionedWidgetData<T> = {
            version,
            data: defaultData,
            updatedAt: Date.now(),
        };
        void updateWidgetData(widgetId, versionedData);
    }, [widgetId, version, defaultData, updateWidgetData]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSave.flush();
        };
    }, [debouncedSave]);

    return {
        data: localData,
        isLoading,
        updateData,
        resetData,
        lastUpdated,
    };
};
