import { useState, useEffect, useCallback } from 'react';
import { GRID_CONFIG } from './constants';
import { debounce } from './debounce';
import { GridConfig } from './types';

const VISIBLE_ROWS = 4;
const HEIGHT_OFFSET = 200;
const MIN_ROW_HEIGHT = 80;
const MAX_ROW_HEIGHT = 120;
const RESIZE_DEBOUNCE_DELAY = 100;

export const useResponsiveGrid = (): GridConfig => {
    const [gridConfig, setGridConfig] = useState<GridConfig>({
        cols: 12,
        rowHeight: GRID_CONFIG.rowHeight,
    });

    const calculateCols = (viewportWidth: number): number => {
        const availableWidth =
            viewportWidth - GRID_CONFIG.containerPadding[0] * 2;
        const itemWidthWithMargin =
            GRID_CONFIG.minItemWidth + GRID_CONFIG.margin[0];
        const calculatedCols = Math.floor(
            (availableWidth + GRID_CONFIG.margin[0]) / itemWidthWithMargin,
        );
        return Math.max(
            GRID_CONFIG.minCols,
            Math.min(GRID_CONFIG.maxCols, calculatedCols),
        );
    };

    const calculateRowHeight = (viewportHeight: number): number => {
        const availableHeight = viewportHeight - HEIGHT_OFFSET;
        const totalMargin = GRID_CONFIG.margin[1] * (VISIBLE_ROWS - 1);
        const calculatedRowHeight = Math.floor(
            (availableHeight - totalMargin) / VISIBLE_ROWS,
        );
        return Math.max(
            MIN_ROW_HEIGHT,
            Math.min(MAX_ROW_HEIGHT, calculatedRowHeight),
        );
    };

    const calculateGrid = useCallback(() => {
        if (typeof window === 'undefined') return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (viewportWidth <= 0 || viewportHeight <= 0) return;

        const cols = calculateCols(viewportWidth);
        const rowHeight = calculateRowHeight(viewportHeight);

        setGridConfig({ cols, rowHeight });
    }, []);

    useEffect(() => {
        calculateGrid();

        const debouncedCalculateGrid = debounce(
            calculateGrid,
            RESIZE_DEBOUNCE_DELAY,
        );

        window.addEventListener('resize', debouncedCalculateGrid);
        return () => {
            debouncedCalculateGrid.cancel();
            window.removeEventListener('resize', debouncedCalculateGrid);
        };
    }, [calculateGrid]);

    return gridConfig;
};
