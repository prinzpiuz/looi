import { GitHubSyncSettings, Settings, WidgetDataStore } from './types';
import { defaultWidgetConfigs } from './widgetsRegistry';

export const DEFAULT_BG_COLOR = 'rgba(0, 0, 0, 0.6)';

export const DEFAULT_HL_COLOR = '#161616b3';

export const DEFAULT_SCALE_FACTOR = 'scale(1.025)';

export const TOKEN_EXPIRY_TIME = 8 * 60 * 60 * 1000;

export const MIN_GIST_ID_LENGTH = 8;

export const COLOR_PALETTE = [
    '#478559',
    '#51d0de',
    '#8f8d9d',
    '#496393',
    '#c59c7f',
    '#462532',
    '#e1c7cb',
    '#787197',
    '#c1a4e2',
    '#b4aef0',
    '#c0c0c0',
    '#00ab78',
    '#ffc0cb',
    '#c89666',
    '#008080',
    '#a28089',
    '#BFFCC6',
    '#FFF5BA',
    '#FFABAB',
    '#A2E1DB',
    '#D4F0F0',
    '#FFC3A0',
    '#D6B4FC',
    '#E0FEFE',
];

export const DEFAULT_GITHUB_SYNC_SETTINGS: GitHubSyncSettings = {
    lastSync: null,
    autoSync: true,
    publicGist: false,
    tokenSaved: false,
    gistId: undefined,
    storedAt: 0,
    tokenType: 'UAT',
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

export const DEFAULT_WIDGET_DATA: WidgetDataStore = {};

export const LOAD_DEFAULT_SETTINGS: Settings = {
    bgColor: '#000000',
    bgUrl: '',
    githubSync: DEFAULT_GITHUB_SYNC_SETTINGS,
    bookmarks: [],
    widgetConfigs: defaultWidgetConfigs,
    widgetData: DEFAULT_WIDGET_DATA,
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
