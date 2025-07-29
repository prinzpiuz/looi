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

export interface Widget {
  name: string;
  position: Position;
  icon?: string;
  component: React.FC;
  isEnabled: boolean;
}

export interface Settings {
  bgColor: string;
  bgUrl?: string;
  syncStatus?: boolean;
  bookmarks?: Bookmark[];
  widgets?: Widget[];
}

export interface SettingsContextType {
  settings: Settings | null;
  setSettings: (s: Settings) => void;
  addBookmark: (s: Bookmark) => void;
  updateBookmark: (s: string, bm: Partial<Bookmark>) => void;
  removeBookmark: (s: string) => void;
  getBookmarkById: (s: string) => Bookmark | undefined;
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
