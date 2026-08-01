import { useEffect } from 'react';
import { PopUpMenuProps } from '../../utils/types';
import { useSettings } from '../../hooks/settingsContext';
import '../../assets/css/popupMenu.css';

const PopUpMenu: React.FC<PopUpMenuProps> = ({
    id,
    wrapperRef,
    menuOpen,
    setMenuOpen,
    onEdit,
}) => {
    const { removeBookmark } = useSettings();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuOpen &&
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen, wrapperRef, setMenuOpen]);

    const handleEdit = () => {
        onEdit?.(true);
        setMenuOpen(false);
    };

    const handleRemove = () => {
        void removeBookmark(id);
        setMenuOpen(false);
    };

    return (
        <div className="popup-menu" role="menu" aria-label="Bookmark options">
            <button
                type="button"
                role="menuitem"
                className="popup-menu__item"
                onClick={handleEdit}
            >
                Edit
            </button>
            <button
                type="button"
                role="menuitem"
                className="popup-menu__item popup-menu__item--danger"
                onClick={handleRemove}
            >
                Remove
            </button>
        </div>
    );
};

export default PopUpMenu;
