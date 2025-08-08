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
  addBookmark: (s: Bookmark) => Promise<void>;
  updateBookmark: (s: string, bm: Partial<Bookmark>) => Promise<void>;
  removeBookmark: (s: string) => Promise<void>;
  getBookmarkById: (s: string) => Bookmark | undefined;
  updateWidgetPosition: (id: string, newPos: Position) => Promise<void>;
  enableDisableWidget: (id: string, enabled: boolean) => Promise<void>;
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
