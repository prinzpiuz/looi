import { useState, useEffect } from 'react';
import { BOOKMARK_GRID_CONFIG } from './constants';

export const useResponsiveGrid = () => {
    const [gridConfig, setGridConfig] = useState({
        cols: 12,
        rowHeight: BOOKMARK_GRID_CONFIG.rowHeight,
    });

    useEffect(() => {
        const calculateGrid = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const availableWidth =
                viewportWidth - BOOKMARK_GRID_CONFIG.containerPadding[0] * 2;

            const calculatedCols = Math.floor(
                (availableWidth + BOOKMARK_GRID_CONFIG.margin[0]) /
                    (BOOKMARK_GRID_CONFIG.minItemWidth +
                        BOOKMARK_GRID_CONFIG.margin[0]),
            );

            const cols = Math.max(
                BOOKMARK_GRID_CONFIG.minCols,
                Math.min(BOOKMARK_GRID_CONFIG.maxCols, calculatedCols),
            );

            const visibleRows = 4;
            const availableHeight = viewportHeight - 200;
            const calculatedRowHeight = Math.floor(
                (availableHeight -
                    BOOKMARK_GRID_CONFIG.margin[1] * (visibleRows - 1)) /
                    visibleRows,
            );
            const rowHeight = Math.max(80, Math.min(120, calculatedRowHeight));

            setGridConfig({ cols, rowHeight });
        };

        calculateGrid();
        window.addEventListener('resize', calculateGrid);
        return () => window.removeEventListener('resize', calculateGrid);
    }, []);

    return gridConfig;
};
