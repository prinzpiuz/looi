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

export interface Settings {
  bgColor: string;
  bgUrl?: string;
  syncStatus?: boolean;
  bookmarks?: Bookmark[];
  widgetConfigs: Record<string, WidgetConfig>;
}

export interface SettingsContextType {
  settings: Settings | null;
  setSettings: (s: Settings) => void;
  addBookmark: (s: Bookmark) => void;
  updateBookmark: (s: string, bm: Partial<Bookmark>) => void;
  removeBookmark: (s: string) => void;
  getBookmarkById: (s: string) => Bookmark | undefined;
  updateWidgetPosition: (id: string, newPos: Position) => void;
  updateAndPersistSettings: (s: Partial<Settings>) => void;
}

export interface SettingsButtonProps {
  openSettingsPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddBookmarkButtonProps {
  showBookmarkForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CancelBookmarkButtonProps {
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
