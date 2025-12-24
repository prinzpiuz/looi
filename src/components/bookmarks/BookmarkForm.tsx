import { useState, useRef, useEffect } from 'react';
import { FaLink, FaFont, FaImage, FaTimes, FaPlus } from 'react-icons/fa';
import { Bookmark, BookmarkFormProps } from '../../utils/types';
import { useSettings } from '../../hooks/settingsContext';
import { removeProtocol } from '../../utils/utils';

const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    margin: '20px 0',
};

const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: 42,
    top: 13,
    color: 'rgba(240,241,245,0.4)',
    fontWeight: 600,
    pointerEvents: 'none',
    transition: 'all .16s',
};

const inputStyle: React.CSSProperties = {
    width: '80%',
    padding: '16px 16px 16px 42px',
    borderRadius: 11,
    border: 'none',
    outline: 'none',
    fontSize: 15,
    background: 'rgba(248,248,255,0.84)',
    //   color: "#194",
    boxShadow: '0 2px 7px rgba(111,135,246,0.06)',
    transition: 'box-shadow .17s, outline .14s',
    marginTop: 3,
};

const iconStyle = {
    position: 'absolute',
    left: 15,
    top: 18,
    fontSize: 16,
    color: '#8792b0bb',
};

const modalStyle: React.CSSProperties = {
    minWidth: 360,
    maxWidth: 430,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(240,241,245,0.4)',
    borderRadius: 18,
    boxShadow:
        '0 6px 36px rgba(25,44,81,0.18), 0 0.5px 1.6px 0 rgba(82,99,140,0.09)',
    padding: '33px 35px 20px 35px',
    zIndex: 1050,
    transition: 'opacity .28s cubic-bezier(.4,0,.2,1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backdropFilter: 'blur(50px)',
};

const buttonBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: 13,
    marginTop: 28,
    justifyContent: 'flex-end',
};

const actionButtonStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 15,
    border: 0,
    borderRadius: 8,
    padding: '11px 24px',
    cursor: 'pointer',
    boxShadow: '0 2.5px 8px rgba(83,99,190,0.05)',
    transition: 'background .14s, color .14s, box-shadow .13s',
};

const cancelButtonStyle = {
    ...actionButtonStyle,
    background: 'rgba(228,234,254,0.83)',
    color: '#000000',
};

const addButtonStyle = {
    ...actionButtonStyle,
    background: 'linear-gradient(90deg,#2f82e4,#4559f9)',
    color: '#162242',
    marginLeft: 4,
};

const closeIconStyle: React.CSSProperties = {
    position: 'absolute',
    top: 20,
    right: 22,
    fontSize: 22,
    color: '#ffffff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 20,
};

const errorDivStyle: React.CSSProperties = {
    color: '#ffffff',
    padding: '7px 12px',
    fontWeight: 600,
    textAlign: 'center',
};

const AddIconStyle: React.CSSProperties = {
    marginRight: 5,
    fontSize: 15,
    verticalAlign: -2,
};

const headerStyle: React.CSSProperties = {
    margin: 0,
    marginBottom: 18,
    fontWeight: 800,
    fontSize: 21,
    color: '#ffffff',
    letterSpacing: '.07em',
    textAlign: 'center',
};

const getCenteredPosition = (): { x: number; y: number } => {
    const bookmarkWidth = 80;
    const bookmarkHeight = 70;

    // Calculate center of viewport
    const centerX = Math.round((window.innerWidth - bookmarkWidth) / 2);
    const centerY = Math.round((window.innerHeight - bookmarkHeight) / 2);

    // Add small random offset to prevent exact stacking when adding multiple bookmarks
    const offsetX = Math.round((Math.random() - 0.5) * 100);
    const offsetY = Math.round((Math.random() - 0.5) * 100);

    return {
        x: centerX + offsetX,
        y: centerY + offsetY,
    };
};

const BookmarkForm: React.FC<BookmarkFormProps> = ({
    onCancel,
    showBookmarkForm,
    mode,
    initialData = {},
    bookmarkId,
}) => {
    const isEdit = mode === 'edit';
    const { addBookmark, updateBookmark } = useSettings();
    const [url, setUrl] = useState(initialData.url || '');
    const [name, setName] = useState(initialData.name || '');
    const [icon, setIcon] = useState(initialData.icon || '');
    const [error, setError] = useState<string | null>(null);

    const firstInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setUrl(initialData.url || '');
        setName(initialData.name || '');
        setIcon(initialData.icon || '');
        if (showBookmarkForm && firstInput.current) {
            firstInput.current.focus();
        }
    }, [initialData.url, initialData.name, initialData.icon, showBookmarkForm]);

    const handleCancel = () => {
        onCancel(false);
        setUrl(initialData.url || '');
        setName(initialData.name || '');
        setIcon(initialData.icon || '');
        setError(null);
    };

    const handleSubmit = () => {
        if (
            !url ||
            (!url.startsWith('http') &&
                !url.match(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/))
        ) {
            setError('Enter a valid URL');
            return;
        }
        const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
        const finalIcon =
            icon || `https://icon.horse/icon/${removeProtocol(url)}`;

        if (isEdit && bookmarkId) {
            void updateBookmark(bookmarkId, {
                url: normalizedUrl,
                name: name || url,
                icon: finalIcon,
            });
        } else {
            const bookmark: Bookmark = {
                id: crypto.randomUUID(),
                url: normalizedUrl,
                name: name || url,
                icon: finalIcon,
                position: getCenteredPosition(),
            };
            void addBookmark(bookmark);
        }
        handleCancel();
    };

    const nameLabelStyle: React.CSSProperties = {
        ...labelStyle,
        top: name ? 3 : 13,
        fontSize: name ? 12 : 14,
        color: name ? '#1d2a49' : '#92a0c3',
    };

    const urlLabelStyle: React.CSSProperties = {
        ...labelStyle,
        top: url ? 3 : 13,
        fontSize: url ? 12 : 14,
        color: url ? '#1d2a49' : '#92a0c3',
    };

    const iconabelStyle: React.CSSProperties = {
        ...labelStyle,
        top: icon ? 3 : 13,
        fontSize: icon ? 12 : 14,
        color: icon ? '#1d2a49' : '#92a0c3',
    };

    const allInputStyle: React.CSSProperties = {
        ...inputStyle,
        border:
            error && !name ? '1.5px solid #b10707ff' : '1.3px solid #ebeef7',
    };

    if (!showBookmarkForm) return null;

    return (
        <div style={modalStyle}>
            <button
                type="button"
                aria-label="Close"
                style={closeIconStyle}
                onClick={handleCancel}
            >
                <FaTimes />
            </button>
            <h2 style={headerStyle}>Add Bookmark</h2>
            <div style={inputWrapperStyle}>
                <FaFont style={iconStyle} />
                <input
                    ref={firstInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={allInputStyle}
                    placeholder=" "
                    autoComplete="off"
                />
                <label style={nameLabelStyle}>Name</label>
            </div>
            <div style={inputWrapperStyle}>
                <FaLink style={iconStyle} />
                <input
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError(null);
                    }}
                    style={allInputStyle}
                    placeholder=" "
                    autoComplete="off"
                    inputMode="url"
                />
                <label style={urlLabelStyle}>URL</label>
            </div>
            <div style={inputWrapperStyle}>
                <FaImage style={iconStyle} />
                <input
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    style={inputStyle}
                    placeholder=" "
                    autoComplete="off"
                    inputMode="url"
                />
                <label style={iconabelStyle}>Icon URL (optional)</label>
            </div>

            {error && <div style={errorDivStyle}>{error}</div>}

            <div style={buttonBarStyle}>
                <button
                    type="button"
                    style={cancelButtonStyle}
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    style={addButtonStyle}
                    onClick={handleSubmit}
                    disabled={!url}
                >
                    <FaPlus style={AddIconStyle} />
                    {isEdit ? 'Update' : 'Add'}
                </button>
            </div>
        </div>
    );
};

export default BookmarkForm;
