import { useCallback, useRef, useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { BookmarkDivProps, Position } from '../../utils/types';
import { useSettings } from '../../hooks/settingsContext';
import PopUpMenu from './PopUpMenu';
import BookmarkForm from './BookmarkForm';
import {
    gridToPixel,
    pixelToGrid,
    getCellOccupant,
} from '../../utils/gridUtils';

const bookmarkStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80px',
    minHeight: '70px',
    borderRadius: '15px',
    backdropFilter: 'blur(7px)',
    padding: '18px 8px 12px 8px',
    transition:
        'transform 0.12s cubic-bezier(.4,0,.2,1), box-shadow 0.12s cubic-bezier(.4,0,.2,1)',
};

const linkStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: '#f1f1f1',
    fontWeight: 600,
    fontSize: '0.83rem',
    textDecoration: 'none',
    margin: '5px 0 0 0',
    textAlign: 'center',
    width: '100%',
    transition: 'color 0.1s ease',
};

const bookmarkNameStyle: React.CSSProperties = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    lineHeight: '1.3',
    maxWidth: '100%',
    textAlign: 'center',
};

const swapTargetStyle: React.CSSProperties = {
    border: '2px solid #4dabf7',
    boxShadow: '0 0 12px 2px rgba(77, 171, 247, 0.5)',
};

const draggingStyle: React.CSSProperties = {
    opacity: 0.8,
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
};

const draggableStyle: React.CSSProperties = {
    width: 'auto !important',
    display: 'inline-block',
    pointerEvents: 'auto',
};

const moreIconStyle: React.CSSProperties = {
    color: '#a5adc6',
    fontSize: '1.13rem',
    marginTop: '10px',
    cursor: 'pointer',
    transition: 'color 0.2s',
};

const imageStyle: React.CSSProperties = {
    borderRadius: '50px',
    background: 'rgba(255,255,255,0.08)',
    boxShadow: '0 1.5px 7px 0 rgba(0,0,0,0.08)',
};

const getDraggableStyle = (isMenuOpen: boolean): React.CSSProperties => ({
    ...draggableStyle,
    position: 'relative' as const,
    zIndex: isMenuOpen ? 1000 : 1,
});

const BookmarkDiv: React.FC<BookmarkDivProps> = ({
    bookmark,
    index,
    isBeingDragged,
    isSwapTarget,
    onDragStart,
    onDragMove,
    onDragEnd,
}) => {
    const nodeRef = useRef(null);
    const { settings, updateBookmark } = useSettings();

    // Store grid position and convert to pixels for rendering
    const gridPosition = bookmark.position || { x: 0, y: 0 };
    const [pixelPosition, setPixelPosition] = useState<Position>(() =>
        gridToPixel(gridPosition),
    );

    const originalGridPosRef = useRef<Position>(gridPosition);

    const [menuOpen, setMenuOpen] = useState(false);
    const [showBookmarkForm, setShowBookmarkForm] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setMenuOpen((open) => !open);

    const handleStart = useCallback(() => {
        originalGridPosRef.current = bookmark.position || { x: 0, y: 0 };
        onDragStart(bookmark.id);
    }, [bookmark.position, bookmark.id, onDragStart]);

    const handleDrag = useCallback(
        (_: DraggableEvent, data: DraggableData) => {
            const currentPixelPos: Position = { x: data.x, y: data.y };
            const currentGridPos = pixelToGrid(currentPixelPos);
            onDragMove(currentGridPos, bookmark.id);
        },
        [bookmark.id, onDragMove],
    );

    const handleStop = useCallback(
        (_: DraggableEvent, data: DraggableData) => {
            const dropPixelPos: Position = { x: data.x, y: data.y };
            const newGridPos = pixelToGrid(dropPixelPos);
            const currentBookmarks = settings?.bookmarks || [];

            // Check if target cell is occupied
            const occupantId = getCellOccupant(
                newGridPos,
                currentBookmarks,
                bookmark.id,
            );

            if (occupantId) {
                void updateBookmark(bookmark.id, {
                    position: bookmark.position,
                });
                onDragEnd();
                return;
            }

            const newPixelPos = gridToPixel(newGridPos);
            setPixelPosition(newPixelPos);

            void updateBookmark(bookmark.id, {
                position: newGridPos,
            });

            onDragEnd();
        },
        [bookmark.id, settings?.bookmarks, updateBookmark],
    );

    const currentGridPos = bookmark.position || { x: 0, y: 0 };
    const expectedPixelPos = gridToPixel(currentGridPos);
    if (
        pixelPosition.x !== expectedPixelPos.x ||
        pixelPosition.y !== expectedPixelPos.y
    ) {
        setPixelPosition(expectedPixelPos);
    }

    const bookmarkBackgroundColor = settings?.bgColor;

    const bookmarkDivStyle: React.CSSProperties = {
        ...bookmarkStyle,
        backgroundColor: bookmarkBackgroundColor,
        ...(isSwapTarget ? swapTargetStyle : {}),
        ...(isBeingDragged ? draggingStyle : {}),
    };

    return (
        <div>
            <Draggable
                key={bookmark.id}
                nodeRef={nodeRef}
                position={pixelPosition}
                onStart={handleStart}
                onStop={handleStop}
                onDrag={handleDrag}
                bounds="#root"
            >
                <div
                    ref={nodeRef}
                    tabIndex={index}
                    style={getDraggableStyle(menuOpen)}
                >
                    <div
                        style={bookmarkDivStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.025)';
                            e.currentTarget.style.backgroundColor =
                                'rgba(22, 22, 22, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor =
                                bookmarkBackgroundColor || '';
                        }}
                    >
                        <a
                            href={bookmark.url}
                            target="_self"
                            rel="noopener noreferrer"
                            style={linkStyle}
                            title={bookmark.name}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = '#0078c9ff')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color = '#a5adc6')
                            }
                        >
                            <img
                                src={bookmark.icon}
                                alt={bookmark.url}
                                width={44}
                                height={44}
                                style={imageStyle}
                            />
                            <span style={bookmarkNameStyle}>
                                {bookmark.name}
                            </span>
                        </a>
                        <div ref={wrapperRef}>
                            <div
                                style={moreIconStyle}
                                role="button"
                                aria-haspopup="true"
                                tabIndex={0}
                                onFocus={(e) =>
                                    (e.currentTarget.style.color = '#ffe57f')
                                }
                                onBlur={(e) =>
                                    (e.currentTarget.style.color = '#a5adc6')
                                }
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = '#ffa726')
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = '#a5adc6')
                                }
                                aria-expanded={menuOpen}
                                onClick={toggleMenu}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleMenu();
                                    }
                                }}
                            >
                                <FaEllipsis />
                            </div>
                            {menuOpen && (
                                <PopUpMenu
                                    id={bookmark.id}
                                    wrapperRef={wrapperRef}
                                    menuOpen={menuOpen}
                                    setMenuOpen={setMenuOpen}
                                    onEdit={setShowBookmarkForm}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Draggable>
            {showBookmarkForm && (
                <BookmarkForm
                    showBookmarkForm={showBookmarkForm}
                    onCancel={setShowBookmarkForm}
                    mode="edit"
                    initialData={bookmark}
                    bookmarkId={bookmark.id}
                />
            )}
        </div>
    );
};

export default BookmarkDiv;
