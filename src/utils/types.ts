/// <reference types="chrome"/>
import { CSSProperties } from 'react';
import { Layout, LayoutItem } from 'react-grid-layout';

export interface GridLayoutItem {
    i: string; // Unique identifier (must match component key)
    x: number; // X position in grid units
    y: number; // Y position in grid units
    w: number; // Width in grid units
    h: number; // Height in grid units
    minW?: number; // Minimum width
    maxW?: number; // Maximum width
    minH?: number; // Minimum height
    maxH?: number; // Maximum height
    static?: boolean; // If true, item cannot be moved/resized
    isDraggable?: boolean;
    isResizable?: boolean;
}

export interface Position {
    x: number;
    y: number;
}

export interface Bookmark {
    id: string;
    url: string;
    name: string;
    icon: string;
    // CHANGED: Now uses grid layout instead of pixel position
    layout?: LayoutItem;
    // @deprecated - Keep for migration, will be removed
    position?: Position;
}

export interface WidgetConfig {
    id: string;
    name: string;
    position: Position;
    icon?: string;
    enabled: boolean;
}

export interface GitHubSyncSettings {
    lastSync: number | null;
    autoSync: boolean;
    publicGist: boolean;
    tokenSaved: boolean;
    gistId: string | undefined;
    storedAt: number;
}

export interface Settings {
    bgColor: string;
    bgUrl?: string;
    githubSync: GitHubSyncSettings;
    bookmarks?: Bookmark[];
    widgetConfigs: Record<string, WidgetConfig>;
    widgetLayouts?: LayoutItem[];
    bookmarkLayouts?: LayoutItem[];
}

export interface SettingsContextType {
    settings: Settings | null;
    setSettings: (s: Settings) => void;
    addBookmark: (s: Bookmark) => Promise<void>;
    updateBookmark: (s: string, bm: Partial<Bookmark>) => Promise<void>;
    removeBookmark: (s: string) => Promise<void>;
    getBookmarkById: (s: string) => Bookmark | undefined;
    updateWidgetLayouts: (layouts: LayoutItem[]) => Promise<void>;
    updateBookmarkLayouts: (layouts: LayoutItem[]) => Promise<void>;
    updateWidgetPosition: (id: string, newPos: Position) => Promise<void>;
    enableDisableWidget: (id: string, enabled: boolean) => Promise<void>;
    updateGithubSettings: (s: Partial<GitHubSyncSettings>) => Promise<void>;
    updateAndPersistSettings: (
        s: Partial<Settings>,
        saveChanges?: boolean,
    ) => Promise<void>;
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

export interface WidgetProps {
    config: WidgetConfig;
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

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface GistResponse {
    url: string;
    id: string;
    files: Record<string, GistFile>;
    public: boolean;
}

export type Task = {
    id: string;
    text: string;
    completed: boolean;
    reminder?: Date;
};
