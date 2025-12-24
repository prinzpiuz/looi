import { useSettings } from '../../hooks/settingsContext';
import { Bookmark } from '../../utils/types';
import BookmarkDiv from './Bookmark';

const bookmarksContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
};

const Bookmarks: React.FC = () => {
    const { settings } = useSettings();
    const bookmarks: Bookmark[] = settings?.bookmarks || [];
    return (
        <div style={bookmarksContainerStyle}>
            {bookmarks.map((bm: Bookmark, index: number) => {
                return <BookmarkDiv key={bm.id} index={index} bookmark={bm} />;
            })}
        </div>
    );
};

export default Bookmarks;
