/// <reference types="chrome"/>
import { CSSProperties } from "react";

export interface Position {
  x: number;
  y: number;
}

export interface Bookmark {
  id: string;
  url: string;
  name: string;
  position?: Position;
  icon: string;
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
}

export interface Settings {
  bgColor: string;
  bgUrl?: string;
  githubSync: GitHubSyncSettings;
  bookmarks?: Bookmark[];
  widgetConfigs: Record<string, WidgetConfig>;
}

export interface SettingsContextType {
  settings: Settings | null;
  setSettings: (s: Settings) => void;
  addBookmark: (s: Bookmark) => Promise<void>;
  updateBookmark: (s: string, bm: Partial<Bookmark>) => Promise<void>;
  removeBookmark: (s: string) => Promise<void>;
  getBookmarkById: (s: string) => Bookmark | undefined;
  updateWidgetPosition: (id: string, newPos: Position) => Promise<void>;
  enableDisableWidget: (id: string, enabled: boolean) => Promise<void>;
  updateGithubSettings: (s: Partial<GitHubSyncSettings>) => Promise<void>;
  updateAndPersistSettings: (s: Partial<Settings>) => Promise<void>;
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
  mode: "add" | "edit";
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
  sendMessage: (message: any, callback: (response?: any) => void) => void;
  lastError?: { message: string };
}

interface Storage {
  local: {
    set: (items: Record<string, any>) => void;
    get: (key: string) => Promise<Record<string, any>>;
    remove: (key: string) => Promise<void>;
  };
}

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
  type: "GITHUB_DEVICE_FLOW";
  action: "startDeviceFlow";
}

export interface GitHubDeviceFlowTokenMessage {
  type: "GITHUB_DEVICE_FLOW";
  action: "getToken";
  device_code: string;
}

export interface GitHubAPIMessage {
  type: "GITHUB_GIST_API";
  action: "findGist" | "createOrUpdateLooiGist";
  gistId?: string;
  payload: Settings;
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

export interface GitHubAPIResponseMessage {
  type: "GITHUB_GIST_API";
  action: "findGist" | "createOrUpdateLooiGist";
  gistId: string;
}

export type MessageData =
  | GitHubDeviceFlowStartMessage
  | GitHubDeviceFlowTokenMessage
  | GitHubAPIMessage;

export interface GithubResponses {
  success: boolean;
  data?: GithubDeviceCodeResponse | GithubTokenResponse | GithubAPIResponse;
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

export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface GistResponse {
  url: string;
  id: string;
  files: Record<string, GistFile>;
  public: boolean;
}
