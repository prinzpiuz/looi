/// <reference types="chrome"/>
import { CSSProperties } from 'react';
import { LayoutItem } from 'react-grid-layout';
import { gridItemType } from './utils';

export interface Bookmark {
    id: string;
    url: string;
    name: string;
    icon: string;
}

export interface WidgetSize {
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
}

export interface WidgetConfig {
    id: string;
    name: string;
    icon?: string;
    enabled: boolean;
    size: WidgetSize;
    isResizable: boolean;
}

export type TokenType = 'PAT' | 'UAT';

export interface GitHubSyncSettings {
    lastSync: number | null;
    autoSync: boolean;
    publicGist: boolean;
    tokenSaved: boolean;
    gistId: string | undefined;
    storedAt: number;
    tokenType: TokenType;
}

export interface Settings {
    bgColor: string;
    bgUrl?: string;
    githubSync: GitHubSyncSettings;
    bookmarks?: Bookmark[];
    widgetConfigs: WidgetConfig[];
    gridLayouts?: LayoutItem[];
    widgetData: WidgetDataStore;
}

export interface GridConfig {
    cols: number;
    rowHeight: number;
}

export interface GridItem {
    id: string;
    type: gridItemType;
}

export interface SettingsContextType {
    settings: Settings | null;
    setSettings: (s: Settings) => void;
    addBookmark: (s: Bookmark) => Promise<void>;
    updateBookmark: (s: string, bm: Partial<Bookmark>) => Promise<void>;
    removeBookmark: (s: string) => Promise<void>;
    getBookmarkById: (s: string) => Bookmark | undefined;
    updateGridLayouts: (layouts: LayoutItem[]) => Promise<void>;
    enableDisableWidget: (id: string, enabled: boolean) => Promise<void>;
    updateGithubSettings: (s: Partial<GitHubSyncSettings>) => Promise<void>;
    updateAndPersistSettings: (
        s: Partial<Settings>,
        saveChanges?: boolean,
    ) => Promise<void>;
    updateWidgetData: (
        widgetId: string,
        data: VersionedWidgetData,
    ) => Promise<void>;
    getWidgetData: <T>(widgetId: string) => VersionedWidgetData<T> | undefined;
    clearWidgetData: (widgetId: string) => Promise<void>;
    clearAllWidgetData: () => Promise<void>;
}

export interface BookmarkItemProps {
    bookmark: Bookmark;
    bgColor: string;
}

export interface SettingsButtonProps {
    openSettingsPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddBookmarkButtonProps {
    showBookmarkForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BookmarkFormProps {
    bookmarkId?: string;
    initialData?: Partial<Bookmark>;
    mode: 'add' | 'edit';
    onCancel: React.Dispatch<React.SetStateAction<boolean>>;
    showBookmarkForm: boolean;
}

export interface FoldableSectionProps {
    title: React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export type IconProps = React.FC<{ style?: CSSProperties }>;

export interface ColorResult {
    hex: string;
    rgb: { r: number; g: number; b: number };
}

export interface PopUpMenuProps {
    wrapperRef: React.RefObject<HTMLDivElement | null>;
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
    onEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Runtime {
    sendMessage: (
        message: unknown,
        callback: (response?: unknown) => void,
    ) => void;
    lastError?: { message: string };
}

interface Storage {
    local: {
        set: (items: Record<string, unknown>) => void;
        get: (key: string) => Promise<Record<string, unknown>>;
        remove: (key: string) => Promise<void>;
    };
}

export type BrowserType =
    | 'chrome'
    | 'firefox'
    | 'edge'
    | 'safari'
    | 'opera'
    | 'unknown';

export interface BrowserAPI {
    runtime: Runtime;
    storage: Storage;
}

// Cast window to an extended type that optionally has browser and chrome
export const typedWindow = window as typeof window & {
    browser?: BrowserAPI;
    chrome?: BrowserAPI;
};

export interface GithubDeviceCodeResponse {
    device_code: string;
    user_code: string;
    verification_uri: string;
    expires_in: number;
    interval: number;
}

export interface GithubTokenResponse {
    access_token?: string;
    token_type?: string;
    scope?: string;
    error?: string;
    error_description?: string;
    error_uri?: string;
}

export interface GitHubDeviceFlowStartMessage {
    type: 'GITHUB_DEVICE_FLOW';
    action: 'startDeviceFlow';
}

export interface GitHubDeviceFlowTokenMessage {
    type: 'GITHUB_DEVICE_FLOW';
    action: 'getToken';
    device_code: string;
}

export interface GitHubAPIMessage {
    type: 'GITHUB_GIST_API';
    action: 'findGist' | 'createOrUpdateLooiGist';
    gistId?: string;
    payload?: Settings;
}

export interface GistFile {
    filename: string;
    type: string;
    language: string;
    raw_url: string;
    size: number;
    truncated: boolean;
    content?: string;
    encoding: string;
}

export interface GithubAPIResponse {
    gistId: string;
    url: string;
    public: boolean;
    settings: Settings;
}

export interface GithubUnAuthorizedResponse {
    statusCode: number;
    ok: boolean;
}

export interface GitHubAPIResponseMessage {
    type: 'GITHUB_GIST_API';
    action: 'findGist' | 'createOrUpdateLooiGist';
    gistId: string;
}

export type MessageData =
    | GitHubDeviceFlowStartMessage
    | GitHubDeviceFlowTokenMessage
    | GitHubAPIMessage;

export interface GithubResponses {
    success: boolean;
    data?:
        | GithubDeviceCodeResponse
        | GithubTokenResponse
        | GithubAPIResponse
        | GithubUnAuthorizedResponse;
    error?: string;
}

export interface BackgroundResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface DeviceFlowAuthProps {
    onTokenReceived: (token: string) => void;
}

export interface SyncError {
    message: string;
    code?: 'TOKEN_EXPIRED' | 'NETWORK_ERROR' | 'GIST_NOT_FOUND' | 'UNKNOWN';
}

export interface UseGitHubSyncReturn {
    // State
    githubSyncSettings: GitHubSyncSettings;
    token: string | null;
    status: SyncStatus;
    error: SyncError | null;
    isTokenLoading: boolean;
    isSyncing: boolean;

    // Actions
    updateSyncSettings: (patch: Partial<GitHubSyncSettings>) => Promise<void>;
    resetToken: () => Promise<void>;
    syncNow: () => Promise<void>;
    pullFromGist: () => Promise<Settings | null>;
    pushToGist: () => Promise<void>;
    clearError: () => void;
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface GistResponse {
    url: string;
    id: string;
    files: Record<string, GistFile>;
    public: boolean;
}

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt?: number;
    completedAt?: number;
}

export interface TodoWidgetData {
    tasks: Task[];
    showCompleted: boolean;
}

export interface VersionedWidgetData<T = unknown> {
    version: number;
    data: T;
    updatedAt: number;
}

export type WidgetDataStore = {
    [widgetId: string]: VersionedWidgetData;
};

export type MigrationFn<T = unknown> = (oldData: unknown) => T;

export interface WidgetDataConfig<T> {
    widgetId: string;
    version: number;
    defaultData: T;
    migrations?: Record<number, MigrationFn<T>>;
}

export interface UseWidgetDataReturn<T> {
    data: T;
    isLoading: boolean;
    updateData: (updater: Partial<T> | ((prev: T) => T)) => void;
    resetData: () => void;
    lastUpdated: number | null;
}

export interface SyncSettingsProps {
    onTokenReset: () => void;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
    /** Duration in milliseconds. Set to 0 or use `persistent: true` for no auto-dismiss */
    duration?: number;
    /** If true, toast won't auto-dismiss */
    persistent?: boolean;
    /** Custom ID (useful for preventing duplicates) */
    id?: string;
}

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
    persistent: boolean;
    createdAt: number;
}

export type ToastListener = (toasts: Toast[]) => void;
