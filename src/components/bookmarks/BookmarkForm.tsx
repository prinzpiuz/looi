import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaLink, FaFont, FaImage, FaTimes, FaPlus } from 'react-icons/fa';
import { Bookmark, BookmarkFormProps } from '../../utils/types';
import { useSettings } from '../../hooks/settingsContext';
import { getDomain, prefetchFavicon } from '../../utils/favicon';
import '../../assets/css/bookmarkForm.css';

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

    // Escape to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showBookmarkForm) {
                handleCancel();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showBookmarkForm]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
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
        const finalIcon = icon.trim();

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
            };
            void addBookmark(bookmark);
        }

        // Prefetch on both add and edit (URL may have changed)
        prefetchFavicon(getDomain(normalizedUrl), finalIcon || undefined);

        handleCancel();
    };

    if (!showBookmarkForm) return null;

    const modalContent = (
        <div
            className="bookmark-form__overlay"
            onClick={handleOverlayClick}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div
                className="bookmark-form"
                role="dialog"
                aria-modal="true"
                aria-label={isEdit ? 'Edit Bookmark' : 'Add Bookmark'}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="bookmark-form__close"
                    aria-label="Close"
                    onClick={handleCancel}
                >
                    <FaTimes />
                </button>

                <h2 className="bookmark-form__header">
                    {isEdit ? 'Edit Bookmark' : 'Add Bookmark'}
                </h2>

                {/* Name */}
                <div className="bookmark-form__field">
                    <FaFont className="bookmark-form__field-icon" />
                    <input
                        id="bm-name"
                        ref={firstInput}
                        className="bookmark-form__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=" "
                        autoComplete="off"
                    />
                    <label htmlFor="bm-name" className="bookmark-form__label">
                        Name
                    </label>
                </div>

                {/* URL */}
                <div className="bookmark-form__field">
                    <FaLink className="bookmark-form__field-icon" />
                    <input
                        id="bm-url"
                        className={`bookmark-form__input ${error ? 'bookmark-form__input--error' : ''}`}
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder=" "
                        autoComplete="off"
                        inputMode="url"
                    />
                    <label htmlFor="bm-url" className="bookmark-form__label">
                        URL
                    </label>
                </div>

                {/* Icon (optional) */}
                <div className="bookmark-form__field">
                    <FaImage className="bookmark-form__field-icon" />
                    <input
                        id="bm-icon"
                        className="bookmark-form__input"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder=" "
                        autoComplete="off"
                        inputMode="url"
                    />
                    <label htmlFor="bm-icon" className="bookmark-form__label">
                        Icon URL (optional)
                    </label>
                </div>

                {error && <div className="bookmark-form__error">{error}</div>}

                <div className="bookmark-form__actions">
                    <button
                        type="button"
                        className="bookmark-form__button bookmark-form__button--cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bookmark-form__button bookmark-form__button--submit"
                        onClick={handleSubmit}
                        disabled={!url}
                    >
                        <FaPlus />
                        {isEdit ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default BookmarkForm;
