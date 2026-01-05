import { FaEllipsis } from 'react-icons/fa6';
import BookmarkForm from './BookmarkForm';
import PopUpMenu from './PopUpMenu';
import { BookmarkItemProps } from '../../utils/types';
import { useState, useRef, forwardRef } from 'react';

const bookmarkStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '15px',
    backdropFilter: 'blur(7px)',
    padding: '12px 8px',
    transition:
        'transform 0.12s cubic-bezier(.4,0,.2,1), box-shadow 0.12s cubic-bezier(.4,0,.2,1)',
    cursor: 'grab',
};

const linkStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    color: '#f1f1f1',
    fontWeight: 600,
    fontSize: '0.78rem',
    textDecoration: 'none',
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
    lineHeight: '1.2',
    maxWidth: '100%',
    textAlign: 'center',
};

const moreIconStyle: React.CSSProperties = {
    color: '#a5adc6',
    fontSize: '0.9rem',
    marginTop: '6px',
    cursor: 'pointer',
    transition: 'color 0.2s',
};

const imageStyle: React.CSSProperties = {
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    boxShadow: '0 1.5px 7px 0 rgba(0,0,0,0.08)',
};

const itemStyle = (bgColor: string): React.CSSProperties => ({
    ...bookmarkStyle,
    backgroundColor: bgColor,
    position: 'relative' as const,
});

const BookmarkItem: React.FC<BookmarkItemProps> = ({
    bookmark,
    bgColor,
    key,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showBookmarkForm, setShowBookmarkForm] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleMenu = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuOpen((open) => !open);
    };

    return (
        <>
            <div
                style={itemStyle(bgColor)}
                className="bookmarks"
                key={key}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.025)';
                    e.currentTarget.style.backgroundColor =
                        'rgba(22, 22, 22, 0.7)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = bgColor;
                }}
            >
                <a
                    href={bookmark.url}
                    target="_self"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    title={bookmark.name}
                    onClick={(e) => e.stopPropagation()} // Allow link clicks
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
                        width={36}
                        height={36}
                        style={imageStyle}
                    />
                    <span style={bookmarkNameStyle}>{bookmark.name}</span>
                </a>
                <div ref={wrapperRef}>
                    <div
                        style={moreIconStyle}
                        role="button"
                        aria-haspopup="true"
                        tabIndex={0}
                        aria-expanded={menuOpen}
                        onClick={toggleMenu}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleMenu(e);
                            }
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = '#ffa726')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = '#a5adc6')
                        }
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
            {showBookmarkForm && (
                <BookmarkForm
                    showBookmarkForm={showBookmarkForm}
                    onCancel={setShowBookmarkForm}
                    mode="edit"
                    initialData={bookmark}
                    bookmarkId={bookmark.id}
                />
            )}
        </>
    );
};

export default BookmarkItem;
