import { useState, useEffect } from 'react';
import { GRID_CONFIG } from './constants';

export const useResponsiveGrid = () => {
    const [gridConfig, setGridConfig] = useState({
        cols: 12,
        rowHeight: GRID_CONFIG.rowHeight,
    });

    useEffect(() => {
        const calculateGrid = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const availableWidth =
                viewportWidth - GRID_CONFIG.containerPadding[0] * 2;

            const calculatedCols = Math.floor(
                (availableWidth + GRID_CONFIG.margin[0]) /
                    (GRID_CONFIG.minItemWidth + GRID_CONFIG.margin[0]),
            );

            const cols = Math.max(
                GRID_CONFIG.minCols,
                Math.min(GRID_CONFIG.maxCols, calculatedCols),
            );

            const visibleRows = 4;
            const availableHeight = viewportHeight - 200;
            const calculatedRowHeight = Math.floor(
                (availableHeight - GRID_CONFIG.margin[1] * (visibleRows - 1)) /
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
