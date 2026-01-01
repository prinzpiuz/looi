import { Position, Bookmark, Grid } from './types';

export const CELL_WIDTH = 96;
export const CELL_HEIGHT = 140;

/**
 * Calculate grid dimensions based on viewport size
 */
export const getGridDimensions = (): Grid => {
    const cols = Math.floor(window.innerWidth / CELL_WIDTH);
    const rows = Math.floor(window.innerHeight / CELL_HEIGHT);
    return { cols: Math.max(1, cols), rows: Math.max(1, rows) };
};

/**
 * Convert grid coordinates (col, row) to pixel position
 */
export const gridToPixel = (gridPos: Position): Position => {
    return {
        x: gridPos.x * CELL_WIDTH,
        y: gridPos.y * CELL_HEIGHT,
    };
};

/**
 * Convert pixel position to grid coordinates (col, row)
 */
export const pixelToGrid = (pixelPos: Position): Position => {
    const { cols, rows } = getGridDimensions();
    return {
        x: Math.max(0, Math.min(cols - 1, Math.floor(pixelPos.x / CELL_WIDTH))),
        y: Math.max(
            0,
            Math.min(rows - 1, Math.floor(pixelPos.y / CELL_HEIGHT)),
        ),
    };
};

/**
 * Check if a grid cell is occupied by any bookmark
 * Returns the bookmark ID if occupied, null if empty
 */
export const getCellOccupant = (
    gridPos: Position,
    bookmarks: Bookmark[],
    excludeId?: string,
): string | null => {
    for (const bm of bookmarks) {
        if (bm.id === excludeId) continue;
        if (!bm.position) continue;
        if (bm.position.x === gridPos.x && bm.position.y === gridPos.y) {
            return bm.id;
        }
    }
    return null;
};

/**
 * Find the first empty cell from top-left
 */
export const findFirstEmptyCell = (bookmarks: Bookmark[]): Position => {
    const { cols, rows } = getGridDimensions();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const gridPos: Position = { x: col, y: row };
            if (!getCellOccupant(gridPos, bookmarks)) {
                return gridPos;
            }
        }
    }

    // Fallback: return (0, 0) if grid is completely full
    return { x: 0, y: 0 };
};

/**
 * Check if a grid position is within current viewport bounds
 */
export const isWithinGrid = (gridPos: Position): boolean => {
    const { cols, rows } = getGridDimensions();
    return (
        gridPos.x >= 0 && gridPos.x < cols && gridPos.y >= 0 && gridPos.y < rows
    );
};

/**
 * Reflow bookmarks to fit within current viewport grid
 * Returns updated bookmarks array if any changes were made
 */
export const reflowBookmarks = (bookmarks: Bookmark[]): Bookmark[] => {
    const { cols, rows } = getGridDimensions();
    const occupiedCells = new Set<string>();
    const updatedBookmarks: Bookmark[] = [];

    for (const bm of bookmarks) {
        let gridPos = bm.position || { x: 0, y: 0 };

        // Check if current position is outside grid
        if (gridPos.x >= cols || gridPos.y >= rows) {
            // Find new position
            gridPos = findFirstEmptyCellWithOccupied(cols, rows, occupiedCells);
        }

        // Mark cell as occupied
        occupiedCells.add(`${gridPos.x},${gridPos.y}`);

        updatedBookmarks.push({
            ...bm,
            position: gridPos,
        });
    }

    return updatedBookmarks;
};

/**
 * Helper: Find first empty cell considering already assigned cells
 */
const findFirstEmptyCellWithOccupied = (
    cols: number,
    rows: number,
    occupiedCells: Set<string>,
): Position => {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const key = `${col},${row}`;
            if (!occupiedCells.has(key)) {
                return { x: col, y: row };
            }
        }
    }
    return { x: 0, y: 0 };
};
