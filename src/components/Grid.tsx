import '../assets/css/grid_layout.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useCallback, useEffect, useMemo } from 'react';
import ReactGridLayout, {
    useContainerWidth,
    LayoutItem,
    noCompactor,
} from 'react-grid-layout';

import BookmarkItem from './bookmarks/Bookmark';
import {
    GRID_CONFIG,
    DEFAULT_BG_COLOR,
    BOOKMARK_SIZE,
} from '../utils/constants';
import { useResponsiveGrid } from '../utils/gridUtils';
import { debounce } from '../utils/debounce';
import { useSettings } from '../hooks/settingsContext';
import {
    defaultWidgetConfigs,
    getWidgetSize,
    widgetRegistry,
} from '../utils/widgetsRegistry';
import { GridItem } from '../utils/types';
import { gridItemType } from '../utils/utils';

const gridContainerStyle: React.CSSProperties = {
    width: '100%',
    minWidth: '100%',
    position: 'relative',
    minHeight: '400px',
};

const widgetItemStyle = (bgColor: string): React.CSSProperties => ({
    background: bgColor,
});

const Grid: React.FC = () => {
    const { width, containerRef, mounted } = useContainerWidth({
        initialWidth: window.innerWidth,
    });

    const { settings, updateGridLayouts } = useSettings();
    const { cols, rowHeight } = useResponsiveGrid();
    const bookmarks = settings?.bookmarks || [];
    const widgetConfigs = settings?.widgetConfigs || [];
    const bgColor = settings?.bgColor || DEFAULT_BG_COLOR;

    const enabledWidgetConfigs = useMemo(
        () => widgetConfigs.filter((config) => config.enabled),
        [widgetConfigs],
    );

    const layout = useMemo((): LayoutItem[] => {
        const savedLayouts: LayoutItem[] = settings?.gridLayouts || [];
        const allItems: GridItem[] = [
            ...bookmarks.map((b) => ({
                id: b.id,
                type: gridItemType.BOOKMARK,
            })),
            ...enabledWidgetConfigs.map((config) => ({
                id: config.id,
                type: gridItemType.WIDGET,
            })),
        ];

        let currentX = 0;
        let currentY = 0;
        let rowMaxHeight = 0;

        return allItems.map((item) => {
            const savedLayout = savedLayouts.find((l) => l.i === item.id);
            let size;
            let isResizable = false;

            if (item.type === gridItemType.BOOKMARK) {
                size = BOOKMARK_SIZE;
                isResizable = false;
            } else {
                const widgetConfig = enabledWidgetConfigs.find(
                    (c) => c.id === item.id,
                );
                // Get size from widget config or use default from registry
                size = getWidgetSize(item.id, widgetConfig?.size);
                isResizable =
                    widgetConfig?.isResizable ||
                    defaultWidgetConfigs.find((c) => c.id === item.id)
                        ?.isResizable ||
                    false;
            }

            // If saved layout exists, use it with bounds checking
            if (savedLayout) {
                return {
                    ...savedLayout,
                    x: Math.min(
                        savedLayout.x,
                        Math.max(0, cols - savedLayout.w),
                    ),
                    w: Math.min(savedLayout.w, cols),
                    // Preserve resize constraints
                    minW: size.minW,
                    maxW: size.maxW,
                    minH: size.minH,
                    maxH: size.maxH,
                    isResizable,
                };
            }

            // Calculate position for new items
            if (currentX + size.w > cols) {
                currentX = 0;
                currentY += rowMaxHeight;
                rowMaxHeight = 0;
            }

            const newItem: LayoutItem = {
                i: item.id,
                x: currentX,
                y: currentY,
                w: size.w,
                h: size.h,
                minW: size.minW,
                maxW: size.maxW,
                minH: size.minH,
                maxH: size.maxH,
                isResizable,
            };

            currentX += size.w;
            rowMaxHeight = Math.max(rowMaxHeight, size.h);

            return newItem;
        });
    }, [bookmarks, enabledWidgetConfigs, settings?.gridLayouts, cols]);

    const debouncedUpdateLayouts = useMemo(
        () =>
            debounce((...args: unknown[]) => {
                const layout = args[0] as LayoutItem[];
                void updateGridLayouts(layout);
            }, 300),
        [updateGridLayouts],
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
        return enabledWidgetConfigs.map((config) => {
            const WidgetComponent = widgetRegistry[config.id];
            if (!WidgetComponent) return null;

            return (
                <div key={config.id} style={widgetItemStyle(bgColor)}>
                    <WidgetComponent />
                </div>
            );
        });
    }, [enabledWidgetConfigs, bgColor]);

    const gridItems = [...bookmarksChildren, ...widgetChildren].filter(Boolean);

    if (gridItems.length === 0) {
        return null;
    }

    if (!mounted || width === 0) {
        return <div ref={containerRef} style={gridContainerStyle} />;
    }

    return (
        <div ref={containerRef} style={gridContainerStyle}>
            <ReactGridLayout
                className="grid-layout"
                layout={layout}
                width={width}
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
                    enabled: true,
                }}
                compactor={{
                    ...noCompactor,
                    preventCollision: true,
                }}
                onDragStop={handleLayoutChange}
                onResizeStop={handleLayoutChange}
            >
                {gridItems}
            </ReactGridLayout>
        </div>
    );
};

export default Grid;
