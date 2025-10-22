import { useEffect, useState } from 'react';
import SettingsPanel from './settings/SetttingsPanel';
import AddBookmarkButton from './bookmarks/AddBmButton';
import Bookmarks from './bookmarks/Bookmarks';
import BookmarkForm from './bookmarks/BookmarkForm';
import DraggableWidget from './widgets/DraggableWidget';
import { useSettings } from '../hooks/settingsContext';

const NewTabPage: React.FC = () => {
    const { settings } = useSettings();
    const [showBookmarkForm, setShowBookmarkForm] = useState(false);

    const bgColor = settings?.bgColor ?? '#000000';
    const bgUrl = settings?.bgUrl ? `url(${settings.bgUrl})` : undefined;
    const widgetConfigs = settings?.widgetConfigs || {};

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
        <div>
            <SettingsPanel />
            <AddBookmarkButton showBookmarkForm={setShowBookmarkForm} />
            {Object.entries(widgetConfigs).map(([id, config]) => {
                if (!config.enabled) return null;
                return <DraggableWidget key={id} id={id} config={config} />;
            })}
            <Bookmarks />
            <BookmarkForm
                showBookmarkForm={showBookmarkForm}
                onCancel={setShowBookmarkForm}
                mode="add"
            />
        </div>
    );
};

export default NewTabPage;
