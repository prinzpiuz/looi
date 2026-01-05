import '../../assets/css/grid_layout.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGridLayout, {
    useContainerWidth,
    LayoutItem,
    noCompactor,
} from 'react-grid-layout';

import BookmarkItem from './Bookmark';
import { GRID_CONFIG, DEFAULT_BG_COLOR } from '../../utils/constants';
import { useResponsiveGrid } from '../../utils/gridUtils';
import { debounce } from '../../utils/debounce';
import { useSettings } from '../../hooks/settingsContext';
import { widgetRegistry } from '../../utils/widgetsRegistry';

const gridContainerStyle: React.CSSProperties = {
    width: '100%',
    minWidth: '100%',
    position: 'relative',
    minHeight: '400px',
};

const widgetItemStyle: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    transition: 'box-shadow 0.2s ease',
};

const widgetItemHoverStyle: React.CSSProperties = {
    boxShadow: '0 8px 32px rgba(43, 196, 13, 0.25)',
};

const BookmarkGrid: React.FC = () => {
    const { containerRef, mounted } = useContainerWidth({
        measureBeforeMount: true,
    });
    const [gridContainerWidth, setgridContainerWidth] = useState(
        window.innerWidth,
    );
    const { settings, updateBookmarkLayouts } = useSettings();
    const { cols, rowHeight } = useResponsiveGrid();
    const bookmarks = settings?.bookmarks || [];
    const bgColor = settings?.bgColor || DEFAULT_BG_COLOR;

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setgridContainerWidth(containerRef.current.offsetWidth);
            } else {
                setgridContainerWidth(window.innerWidth);
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

    const { enabledWidgets } = useMemo(() => {
        const widgetConfigs = settings?.widgetConfigs || {};

        const enabled = Object.entries(widgetConfigs)
            .filter(([id, config]) => config.enabled && widgetRegistry[id])
            .map(([id]) => id);

        return { enabledWidgets: enabled };
    }, [settings?.widgetConfigs, settings?.bookmarkLayouts, cols]);

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

    const bookmarksChildren = useMemo(() => {
        return bookmarks.map((bookmark) => (
            <div key={bookmark.id}>
                <BookmarkItem bookmark={bookmark} bgColor={bgColor} />
            </div>
        ));
    }, [bookmarks, bgColor]);

    const widgetChildren = useMemo(() => {
        return enabledWidgets.map((id) => {
            const WidgetComponent = widgetRegistry[id];
            if (!WidgetComponent) return null;

            return (
                <div
                    key={id}
                    style={widgetItemStyle}
                    onMouseEnter={(e) => {
                        Object.assign(
                            e.currentTarget.style,
                            widgetItemHoverStyle,
                        );
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                            widgetItemStyle.boxShadow || '';
                    }}
                >
                    <WidgetComponent />
                </div>
            );
        });
    }, [enabledWidgets]);

    const gridChildren = [...bookmarksChildren, ...widgetChildren];

    return (
        <div ref={containerRef} style={gridContainerStyle}>
            {mounted && (
                <ReactGridLayout
                    className="grid-layout"
                    layout={layout}
                    width={gridContainerWidth}
                    gridConfig={{
                        cols: cols,
                        rowHeight: rowHeight,
                        margin: GRID_CONFIG.margin,
                        containerPadding: GRID_CONFIG.containerPadding,
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
