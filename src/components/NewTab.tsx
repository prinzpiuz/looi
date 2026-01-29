import { useEffect, useState } from 'react';
import SettingsPanel from './settings/SetttingsPanel';
import Grid from './Grid';
import BookmarkForm from './bookmarks/BookmarkForm';
import { DEFAULT_BG_COLOR } from '../utils/constants';
import { useSettings } from '../hooks/settingsContext';
import ToastContainer from './toast/ToastContainer';
import FloatingButton from './commons/FAB';
import { MdOutlineBookmarkAdd } from 'react-icons/md';

const fixedButtonsContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'none',
};

const buttonWrapperStyle: React.CSSProperties = {
    pointerEvents: 'auto',
};

const NewTabPage: React.FC = () => {
    const { settings } = useSettings();
    const [showBookmarkForm, setShowBookmarkForm] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const bgColor = settings?.bgColor ?? DEFAULT_BG_COLOR;
    const bgUrl = settings?.bgUrl ? `url(${settings.bgUrl})` : undefined;

    useEffect(() => {
        document.documentElement.style.setProperty('--app-bg-color', bgColor);
        document.documentElement.style.setProperty(
            '--app-bg-image',
            bgUrl || '',
        );

        const handleKeydown = (event: KeyboardEvent) => {
            const isCtrlOrCmd = event.ctrlKey || event.metaKey;
            const isB = event.key.toLowerCase() === 'b';

            if (isCtrlOrCmd && isB) {
                event.preventDefault();
                setShowBookmarkForm(true);
            }

            if (event.key === 'Escape') {
                setShowBookmarkForm(false);
            }
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [bgColor, bgUrl, setShowBookmarkForm]);

    return (
        <div style={{ width: '100%' }}>
            <div style={fixedButtonsContainerStyle}>
                <div style={buttonWrapperStyle}>
                    <SettingsPanel
                        isOpen={isSettingsOpen}
                        onOpen={() => setIsSettingsOpen(true)}
                        onClose={() => setIsSettingsOpen(false)}
                    />
                    <FloatingButton
                        icon={<MdOutlineBookmarkAdd size={18} />}
                        onClick={() => setShowBookmarkForm(true)}
                        label="Add bookmark"
                        position="add-bookmark"
                    />
                </div>
            </div>
            <Grid />
            <BookmarkForm
                showBookmarkForm={showBookmarkForm}
                onCancel={setShowBookmarkForm}
                mode="add"
            />
            <ToastContainer />
        </div>
    );
};

export default NewTabPage;
