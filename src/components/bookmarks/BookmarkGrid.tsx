import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGridLayout, {
    useContainerWidth,
    LayoutItem,
    noCompactor,
} from 'react-grid-layout';

import BookmarkItem from './Bookmark';
import { BOOKMARK_GRID_CONFIG, DEFAULT_BG_COLOR } from '../../utils/constants';
import { useResponsiveGrid } from '../../utils/gridUtils';
import { debounce } from '../../utils/debounce';
import { useSettings } from '../../hooks/settingsContext';

const gridContainerStyle: React.CSSProperties = {
    width: '100%',
    minWidth: '100%',
    position: 'relative',
    minHeight: '200px',
};

const BookmarkGrid: React.FC = () => {
    const { containerRef, mounted } = useContainerWidth();
    const [width, setWidth] = useState(window.innerWidth);
    const { settings, updateBookmarkLayouts } = useSettings();
    const { cols, rowHeight } = useResponsiveGrid();
    const bookmarks = settings?.bookmarks || [];
    const bgColor = settings?.bgColor || DEFAULT_BG_COLOR;

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            } else {
                setWidth(window.innerWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        const resizeObserver = new ResizeObserver(updateWidth);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', updateWidth);
            resizeObserver.disconnect();
        };
    }, [containerRef]);

    const layout = useMemo((): LayoutItem[] => {
        const savedLayouts: LayoutItem[] = settings?.bookmarkLayouts || [];

        return bookmarks.map((bookmark, index) => {
            const savedLayout = savedLayouts.find((l) => l.i === bookmark.id);
            if (savedLayout) {
                return {
                    ...savedLayout,
                    x: Math.min(savedLayout.x, cols - savedLayout.w),
                };
            }

            return {
                i: bookmark.id,
                x: index % cols,
                y: Math.floor(index / cols),
                w: 1,
                h: 1,
            };
        });
    }, [bookmarks, settings?.bookmarkLayouts, cols]);

    const debouncedUpdateLayouts = useMemo(
        () =>
            debounce((...args: unknown[]) => {
                const layout = args[0] as LayoutItem[];
                void updateBookmarkLayouts(layout);
            }, 300),
        [updateBookmarkLayouts],
    );

    const handleLayoutChange = useCallback(
        (layout: readonly LayoutItem[]) => {
            debouncedUpdateLayouts([...layout]);
        },
        [debouncedUpdateLayouts],
    );

    useEffect(() => {
        return () => {
            debouncedUpdateLayouts.cancel();
        };
    }, [debouncedUpdateLayouts]);

    const gridChildren = useMemo(() => {
        return bookmarks.map((bookmark) => (
            <div key={bookmark.id}>
                <BookmarkItem bookmark={bookmark} bgColor={bgColor} />
            </div>
        ));
    }, [bookmarks, bgColor]);

    if (bookmarks.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} style={gridContainerStyle}>
            {mounted && (
                <ReactGridLayout
                    className="bookmark-grid-layout"
                    layout={layout}
                    width={width}
                    gridConfig={{
                        cols: cols,
                        rowHeight: rowHeight,
                        margin: BOOKMARK_GRID_CONFIG.margin,
                        containerPadding: BOOKMARK_GRID_CONFIG.containerPadding,
                    }}
                    dragConfig={{
                        enabled: true,
                    }}
                    resizeConfig={{
                        enabled: false,
                    }}
                    compactor={{
                        ...noCompactor,
                        preventCollision: true,
                    }}
                    onLayoutChange={handleLayoutChange}
                >
                    {gridChildren}
                </ReactGridLayout>
            )}
        </div>
    );
};

export default BookmarkGrid;
