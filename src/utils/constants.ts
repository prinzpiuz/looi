import { GitHubSyncSettings, Settings } from './types';
import { defaultWidgetConfigs } from './widgetsRegistry';

export const DEFAULT_BG_COLOR = 'rgba(0, 0, 0, 0.6)';

export const DEFAULT_HL_COLOR = '#161616b3';

export const DEFAULT_SCALE_FACTOR = 'scale(1.025)';

export const TOKEN_EXPIRY_TIME = 8 * 60 * 60 * 1000;

export const DEFAULT_GITHUB_SYNC_SETTINGS: GitHubSyncSettings = {
    lastSync: null,
    autoSync: true,
    publicGist: false,
    tokenSaved: false,
    gistId: undefined,
    storedAt: 0,
};

export const BOOKMARK_SIZE = {
    w: 1,
    h: 1,
    minW: 1,
    maxW: 1,
    minH: 1,
    maxH: 1,
    isResizable: false,
};

export const LOAD_DEFAULT_SETTINGS: Settings = {
    bgColor: '#000000',
    bgUrl: '',
    githubSync: DEFAULT_GITHUB_SYNC_SETTINGS,
    bookmarks: [],
    widgetConfigs: defaultWidgetConfigs,
};

export const GRID_CONFIG = {
    minItemWidth: 90,
    maxItemWidth: 120,
    rowHeight: 80,
    margin: [8, 8] as [number, number],
    containerPadding: [10, 10] as [number, number],
    minCols: 4,
    maxCols: 16,
};
