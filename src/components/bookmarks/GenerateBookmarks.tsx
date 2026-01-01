import { useEffect, useCallback, useState } from 'react';
import { useSettings } from '../../hooks/settingsContext';
import { Bookmark, DragState, Position } from '../../utils/types';
import BookmarkDiv from './Bookmark';
import {
    reflowBookmarks,
    getGridDimensions,
    getCellOccupant,
} from '../../utils/gridUtils';

const BookmarksContainerStyle: React.CSSProperties = {
    display: 'flex',
};

const GenerateBookmarks: React.FC = () => {
    const { settings, updateAndPersistSettings } = useSettings();
    const bookmarks: Bookmark[] = settings?.bookmarks || [];
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggingId: null,
        hoverGridPos: null,
        hoveredBookmarkId: null,
    });

    // Called when drag starts
    const onDragStart = useCallback((bookmarkId: string) => {
        setDragState({
            isDragging: true,
            draggingId: bookmarkId,
            hoverGridPos: null,
            hoveredBookmarkId: null,
        });
    }, []);

    const onDragMove = useCallback(
        (gridPos: Position, draggingId: string) => {
            const hoveredId = getCellOccupant(gridPos, bookmarks, draggingId);
            setDragState((prev) => ({
                ...prev,
                hoverGridPos: gridPos,
                hoveredBookmarkId: hoveredId,
            }));
        },
        [bookmarks],
    );

    // Called when drag ends
    const onDragEnd = useCallback(() => {
        setDragState({
            isDragging: false,
            draggingId: null,
            hoverGridPos: null,
            hoveredBookmarkId: null,
        });
    }, []);

    // Handle viewport resize - reflow bookmarks if needed
    const handleResize = useCallback(() => {
        if (!settings?.bookmarks?.length) return;

        const { cols, rows } = getGridDimensions();

        // Check if any bookmark is outside the current grid
        const needsReflow = settings.bookmarks.some((bm) => {
            if (!bm.position) return false;
            return bm.position.x >= cols || bm.position.y >= rows;
        });

        if (needsReflow) {
            const reflowedBookmarks = reflowBookmarks(settings.bookmarks);
            void updateAndPersistSettings({ bookmarks: reflowedBookmarks });
        }
    }, [settings?.bookmarks, updateAndPersistSettings]);

    useEffect(() => {
        // Debounced resize handler
        let timeoutId: ReturnType<typeof setTimeout>;

        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 250);
        };

        window.addEventListener('resize', debouncedResize);

        // Initial check on mount
        handleResize();

        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [handleResize]);

    return (
        <div id="bookmarks-container" style={BookmarksContainerStyle}>
            {bookmarks.map((bm: Bookmark, index: number) => {
                const isBeingDragged = dragState.draggingId === bm.id;
                const isHovered = dragState.hoveredBookmarkId === bm.id;

                return (
                    <BookmarkDiv
                        key={bm.id}
                        index={index}
                        bookmark={bm}
                        isBeingDragged={isBeingDragged}
                        isSwapTarget={isHovered}
                        onDragStart={onDragStart}
                        onDragMove={onDragMove}
                        onDragEnd={onDragEnd}
                    />
                );
            })}
        </div>
    );
};

export default GenerateBookmarks;
