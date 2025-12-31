import { Bookmark, Position } from '../../utils/types';

const BOOKMARK_WIDTH = 96; // 80px + 8px left + 8px right padding ✓
const BOOKMARK_HEIGHT = 140; // Actual height is ~137px, rounded up
const COLLISION_PADDING = 10; // Gap between bookmarks

/**
 * Check if two rectangles overlap using AABB collision
 */
export const rectanglesOverlap = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number,
    height: number,
): boolean => {
    return (
        x1 < x2 + width &&
        x1 + width > x2 &&
        y1 < y2 + height &&
        y1 + height > y2
    );
};

/**
 * Check if a position collides with any other bookmark
 */
export const checkCollisionWithBookmarks = (
    newPos: Position,
    currentBookmarkId: string,
    allBookmarks: Bookmark[],
): boolean => {
    const width = BOOKMARK_WIDTH + COLLISION_PADDING;
    const height = BOOKMARK_HEIGHT + COLLISION_PADDING;

    for (const bm of allBookmarks) {
        // Skip self
        if (bm.id === currentBookmarkId) continue;
        // Skip bookmarks without position
        if (!bm.position) continue;

        if (
            rectanglesOverlap(
                newPos.x,
                newPos.y,
                bm.position.x,
                bm.position.y,
                width,
                height,
            )
        ) {
            return true; // Collision detected
        }
    }

    return false; // No collision
};

/**
 * Check position if collision occurs returning original position
 */
export const findValidPosition = (
    targetPos: Position,
    originalPos: Position,
    currentBookmarkId: string,
    allBookmarks: Bookmark[],
): Position => {
    // First check if target position is valid
    if (
        !checkCollisionWithBookmarks(targetPos, currentBookmarkId, allBookmarks)
    ) {
        return targetPos;
    } else {
        return originalPos;
    }

    //   const stepX = BOOKMARK_WIDTH + COLLISION_PADDING;
    //   const stepY = BOOKMARK_HEIGHT + COLLISION_PADDING;

    //   // Try positions in expanding squares around the target
    //   for (let radius = 1; radius <= 8; radius++) {
    //     // Generate all positions at this radius
    //     const candidates: Position[] = [];

    //     for (let dx = -radius; dx <= radius; dx++) {
    //       for (let dy = -radius; dy <= radius; dy++) {
    //         // Only perimeter positions
    //         if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
    //           candidates.push({
    //             x: targetPos.x + dx * stepX,
    //             y: targetPos.y + dy * stepY,
    //           });
    //         }
    //       }
    //     }

    //     // Sort by distance to target (prefer closer positions)
    //     candidates.sort((a, b) => {
    //       const distA = Math.hypot(a.x - targetPos.x, a.y - targetPos.y);
    //       const distB = Math.hypot(b.x - targetPos.x, b.y - targetPos.y);
    //       return distA - distB;
    //     });

    //     // Find first valid position within viewport
    //     for (const pos of candidates) {
    //       // Check viewport bounds with margin
    //       if (
    //         pos.x < 10 ||
    //         pos.y < 10 ||
    //         pos.x > window.innerWidth - BOOKMARK_WIDTH - 10 ||
    //         pos.y > window.innerHeight - BOOKMARK_HEIGHT - 10
    //       ) {
    //         continue;
    //       }

    //       if (!checkCollisionWithBookmarks(pos, currentBookmarkId, allBookmarks)) {
    //         return pos;
    //       }
    //     }
    //   }

    //   // No valid position found - return to original position
    //   return originalPos;
};

// /**
//  * Find an available position for a new bookmark
//  */
// export const findAvailablePosition = (
//   existingBookmarks: Bookmark[],
// ): Position => {
//   return findNearestValidPosition(
//     { x: 20, y: 20 },
//     { x: 20, y: 20 },
//     "",
//     existingBookmarks,
//   );
// };
