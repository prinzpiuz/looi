import { useEffect } from 'react';
import { useSettings } from '../../hooks/settingsContext';
import { PopUpMenuProps } from '../../utils/types';

const popupMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '120%', // slightly below the icon
  right: 0,
  background: 'rgba(28, 28, 28, 0.95)',
  borderRadius: 8,
  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  zIndex: 100,
  minWidth: 110,
  padding: '6px 0',
};

const menuItemStyle: React.CSSProperties = {
  padding: '8px 16px',
  cursor: 'pointer',
  color: '#f0f0f0',
  fontSize: 14,
  userSelect: 'none',
};

const menuItemHoverStyle: React.CSSProperties = {
  backgroundColor: '#433f4f',
};

const PopUpMenu: React.FC<PopUpMenuProps> = ({ id, wrapperRef, menuOpen, setMenuOpen, onEdit }) => {
  const { removeBookmark } = useSettings();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleRemove = () => {
    void removeBookmark(id);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit?.(true);
    setMenuOpen(false);
  };

  return (
    <div style={popupMenuStyle} role="menu" aria-label="Bookmark options">
      <div
        style={menuItemStyle}
        onClick={handleEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleEdit();
        }}
        tabIndex={0}
        role="menuitem"
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor ?? '433f4f')
        }
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Edit
      </div>
      <div
        style={menuItemStyle}
        onClick={handleRemove}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleRemove();
        }}
        tabIndex={0}
        role="menuitem"
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor ?? '433f4f')
        }
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Remove
      </div>
    </div>
  );
};

export default PopUpMenu;
