
export interface Bookmark {
    url: string;
    name: string;
    position?: React.CSSProperties;
    icon: string;
}

export interface Widget {
    name: string;
    position: React.CSSProperties;
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
