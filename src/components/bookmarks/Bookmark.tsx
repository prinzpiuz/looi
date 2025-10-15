import { useRef, useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Bookmark } from '../../utils/types';
import { useSettings } from '../../hooks/settingsContext';
import PopUpMenu from './PopUpMenu';
import BookmarkForm from './BookmarkForm';

const bookmarkStyle: React.CSSProperties = {
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
    gap: '8px',
    color: '#f1f1f1',
    fontWeight: 600,
    fontSize: '0.83rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    margin: '5px 0 0 0',
    textAlign: 'center',
    maxWidth: '80px',
    transition: 'color 0.1s ease',
};

const draggableStyle: React.CSSProperties = {
    width: 'auto !important',
    display: 'inline-block',
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

const BookmarkDiv: React.FC<{
    bookmark: Bookmark;
    index: number;
}> = ({ bookmark, index }) => {
    const nodeRef = useRef(null);
    const { settings, updateBookmark } = useSettings();
    const [position, setPosition] = useState(
        bookmark.position || { x: 0, y: 0 },
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [showBookmarkForm, setShowBookmarkForm] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setMenuOpen((open) => !open);

    const handleStop = (_: DraggableEvent, data: DraggableData) => {
        setPosition({ x: data.x, y: data.y });
        void updateBookmark(bookmark.id, {
            position: {
                x: data.x,
                y: data.y,
            },
        });
    };

    const bookmarkBackgroundColor = settings?.bgColor;

    const bookmarkDivStyle: React.CSSProperties = {
        ...bookmarkStyle,
        ...bookmark.position,
        backgroundColor: bookmarkBackgroundColor,
    };

    return (
        <div>
            <Draggable
                key={bookmark.id}
                nodeRef={nodeRef}
                position={position}
                onStop={handleStop}
                bounds="#root"
            >
                <div ref={nodeRef} tabIndex={index} style={draggableStyle}>
                    <div
                        style={bookmarkDivStyle}
                        onMouseEnter={(e) => {
                            ((e.currentTarget.style.transform = 'scale(1.025)'),
                                (e.currentTarget.style.backgroundColor =
                                    'rgba(22, 22, 22, 0.7)'));
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
                            {bookmark.name}
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
