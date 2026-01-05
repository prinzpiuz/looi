import { GitHubSyncSettings, Settings } from './types';

export const DEFAULT_BG_COLOR = 'rgba(0, 0, 0, 0.6)';

export const TOKEN_EXPIRY_TIME = 8 * 60 * 60 * 1000;

export const DEFAULT_GITHUB_SYNC_SETTINGS: GitHubSyncSettings = {
    lastSync: null,
    autoSync: true,
    publicGist: false,
    tokenSaved: false,
    gistId: undefined,
    storedAt: 0,
};

export const LOAD_DEFAULT_SETTINGS: Settings = {
    bgColor: '#000000',
    bgUrl: '',
    githubSync: DEFAULT_GITHUB_SYNC_SETTINGS,
    bookmarks: [],
    widgetConfigs: {
        calendar: {
            id: 'calendar',
            name: 'Calendar',
            enabled: true,
        },
        todo: {
            id: 'todo',
            name: 'To-Do List',
            enabled: false,
        },
    },
};

export const GRID_CONFIG = {
    minItemWidth: 90, // Minimum width per bookmark in pixels
    maxItemWidth: 120, // Maximum width per bookmark
    rowHeight: 80,
    margin: [8, 8] as [number, number],
    containerPadding: [10, 10] as [number, number],
    minCols: 4, // Minimum columns
    maxCols: 16, // Maximum columns
};
