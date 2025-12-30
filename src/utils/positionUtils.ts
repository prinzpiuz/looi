import { Position, Bookmark } from './types';

/**
 * Converts pixel position to percentage-based position (0-1 range)
 * The returned Position has x,y values between 0-1
 */
export const toRelativePosition = (
    pixelPos: Position,
    viewportWidth: number = window.innerWidth,
    viewportHeight: number = window.innerHeight,
): Position => {
    return {
        x: Math.max(0, Math.min(1, pixelPos.x / viewportWidth)),
        y: Math.max(0, Math.min(1, pixelPos.y / viewportHeight)),
    };
};

/**
 * Converts percentage-based position (0-1) to pixel position
 */
export const toPixelPosition = (
    relativePos: Position,
    viewportWidth: number = window.innerWidth,
    viewportHeight: number = window.innerHeight,
): Position => {
    return {
        x: Math.round(relativePos.x * viewportWidth),
        y: Math.round(relativePos.y * viewportHeight),
    };
};

/**
 * Checks if position values are in pixel format (> 1)
 */
export const isPixelPosition = (pos: Position | undefined): boolean => {
    if (!pos) return false;
    return pos.x > 1 || pos.y > 1;
};

/**
 * Migrates legacy pixel position to relative position
 */
export const migrateLegacyPosition = (
    pos: Position,
    referenceWidth: number = 1920,
    referenceHeight: number = 1080,
): Position => {
    return {
        x: Math.max(0, Math.min(1, pos.x / referenceWidth)),
        y: Math.max(0, Math.min(1, pos.y / referenceHeight)),
    };
};

/**
 * Bookmark dimensions as percentage of viewport (approximate)
 */
const BOOKMARK_WIDTH_PERCENT = 0.06;
const BOOKMARK_HEIGHT_PERCENT = 0.1;
const PADDING_PERCENT = 0.02;

/**
 * Checks if two positions overlap (with bookmark size consideration)
 */
const positionsOverlap = (pos1: Position, pos2: Position): boolean => {
    const overlapX =
        Math.abs(pos1.x - pos2.x) < BOOKMARK_WIDTH_PERCENT + PADDING_PERCENT;
    const overlapY =
        Math.abs(pos1.y - pos2.y) < BOOKMARK_HEIGHT_PERCENT + PADDING_PERCENT;
    return overlapX && overlapY;
};

/**
 * Checks if a position overlaps with any existing bookmarks
 */
const hasCollision = (
    pos: Position,
    existingPositions: Position[],
): boolean => {
    return existingPositions.some((existing) =>
        positionsOverlap(pos, existing),
    );
};

/**
 * Gets all existing bookmark positions normalized to relative (0-1) format
 */
const getExistingPositions = (bookmarks: Bookmark[]): Position[] => {
    const positions: Position[] = [];

    for (const bm of bookmarks) {
        if (!bm.position) continue;

        // If values are > 1, convert from pixels to relative
        if (isPixelPosition(bm.position)) {
            positions.push(toRelativePosition(bm.position));
        } else {
            // Already in 0-1 format
            positions.push({ x: bm.position.x, y: bm.position.y });
        }
    }

    return positions;
};

/**
 * Finds an available position for a new bookmark that doesn't overlap with existing ones
 */
export const findAvailablePosition = (
    existingBookmarks: Bookmark[],
): Position => {
    const existingPositions = getExistingPositions(existingBookmarks);

    // Define safe bounds
    const minX = 0.05;
    const maxX = 0.95 - BOOKMARK_WIDTH_PERCENT;
    const minY = 0.1;
    const maxY = 0.9 - BOOKMARK_HEIGHT_PERCENT;

    // Start from center
    const centerX = 0.5;
    const centerY = 0.45;

    // If no existing bookmarks, return center
    if (existingPositions.length === 0) {
        return { x: centerX, y: centerY };
    }

    // Grid step size
    const stepX = BOOKMARK_WIDTH_PERCENT + PADDING_PERCENT;
    const stepY = BOOKMARK_HEIGHT_PERCENT + PADDING_PERCENT;

    // Spiral search from center
    for (let radius = 0; radius <= 10; radius++) {
        const positions: Position[] = [];

        if (radius === 0) {
            positions.push({ x: centerX, y: centerY });
        } else {
            // Top and bottom rows
            for (let dx = -radius; dx <= radius; dx++) {
                positions.push({
                    x: centerX + dx * stepX,
                    y: centerY - radius * stepY,
                });
                positions.push({
                    x: centerX + dx * stepX,
                    y: centerY + radius * stepY,
                });
            }
            // Left and right columns
            for (let dy = -radius + 1; dy < radius; dy++) {
                positions.push({
                    x: centerX - radius * stepX,
                    y: centerY + dy * stepY,
                });
                positions.push({
                    x: centerX + radius * stepX,
                    y: centerY + dy * stepY,
                });
            }
        }

        // Check each position
        for (const pos of positions) {
            if (pos.x < minX || pos.x > maxX || pos.y < minY || pos.y > maxY) {
                continue;
            }
            if (!hasCollision(pos, existingPositions)) {
                return { x: pos.x, y: pos.y };
            }
        }
    }

    // Fallback: scan entire grid
    for (let y = minY; y <= maxY; y += stepY) {
        for (let x = minX; x <= maxX; x += stepX) {
            const pos: Position = { x, y };
            if (!hasCollision(pos, existingPositions)) {
                return pos;
            }
        }
    }

    // Ultimate fallback
    return {
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
    };
};

/**
 * Gets a centered relative position with optional random offset
 */
export const getCenteredRelativePosition = (
    addRandomOffset: boolean = true,
): Position => {
    const baseX = 0.5;
    const baseY = 0.5;

    if (!addRandomOffset) {
        return { x: baseX, y: baseY };
    }

    const offsetX = (Math.random() - 0.5) * 0.1;
    const offsetY = (Math.random() - 0.5) * 0.1;

    return {
        x: Math.max(0.05, Math.min(0.95, baseX + offsetX)),
        y: Math.max(0.05, Math.min(0.95, baseY + offsetY)),
    };
};
