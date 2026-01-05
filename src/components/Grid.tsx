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
import { GRID_CONFIG, DEFAULT_BG_COLOR } from '../utils/constants';
import { useResponsiveGrid } from '../utils/gridUtils';
import { debounce } from '../utils/debounce';
import { useSettings } from '../hooks/settingsContext';
import { widgetRegistry } from '../utils/widgetsRegistry';

const gridContainerStyle: React.CSSProperties = {
    width: '100%',
    minWidth: '100%',
    position: 'relative',
    minHeight: '400px',
};

const widgetItemStyle = (bgColor: string): React.CSSProperties => ({
    background: bgColor,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    transition: 'box-shadow 0.2s ease',
});

const Grid: React.FC = () => {
    const { width, containerRef, mounted } = useContainerWidth({
        measureBeforeMount: true,
    });

    const { settings, updateGridLayouts } = useSettings();
    const { cols, rowHeight } = useResponsiveGrid();
    const bookmarks = settings?.bookmarks || [];
    const widgetConfigs = settings?.widgetConfigs || [];
    const bgColor = settings?.bgColor || DEFAULT_BG_COLOR;

    const layout = useMemo((): LayoutItem[] => {
        const savedLayouts: LayoutItem[] = settings?.gridLayouts || [];
        const allItems = [
            ...bookmarks.map((b) => ({ id: b.id })),
            ...widgetConfigs.map((wc) => ({ id: wc.id })),
        ];
        return allItems.map((item, index) => {
            const savedLayout = savedLayouts.find((l) => l.i === item.id);
            if (savedLayout) {
                return {
                    ...savedLayout,
                    x: Math.min(savedLayout.x, cols - savedLayout.w),
                };
            }

            return {
                i: item.id,
                x: index % cols,
                y: Math.floor(index / cols),
                w: 1,
                h: 1,
            };
        });
    }, [bookmarks, settings?.gridLayouts, cols]);

    const { enabledWidgets } = useMemo(() => {
        const widgetConfigs = settings?.widgetConfigs || [];

        const enabled = widgetConfigs
            .filter((config) => config.enabled && widgetRegistry[config.id])
            .map((config) => config.id);
        return { enabledWidgets: enabled };
    }, [settings?.widgetConfigs, settings?.gridLayouts, cols]);

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
        return layout.map((item) => {
            const bookmark = bookmarks.find((b) => b.id === item.i);
            if (!bookmark) return null;

            return (
                <div key={item.i}>
                    <BookmarkItem bookmark={bookmark} bgColor={bgColor} />
                </div>
            );
        });
    }, [layout, bookmarks, bgColor]);

    const widgetChildren = useMemo(() => {
        return enabledWidgets.map((id) => {
            const WidgetComponent = widgetRegistry[id];
            if (!WidgetComponent) return null;

            return (
                <div key={id} style={widgetItemStyle(bgColor)}>
                    <WidgetComponent />
                </div>
            );
        });
    }, [enabledWidgets]);

    const gridItems = [...bookmarksChildren, ...widgetChildren];

    return (
        <div ref={containerRef} style={gridContainerStyle}>
            {mounted && (
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
                        enabled: false,
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
            )}
        </div>
    );
};

export default Grid;
