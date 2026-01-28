import { FaTimes } from 'react-icons/fa';
import '../../assets/css/close_settings_icon.css';
import { CloseSettingsIconProps } from '../../utils/types';

const CloseSettingsIcon: React.FC<CloseSettingsIconProps> = ({ onClose }) => {
    return (
        <button
            type="button"
            className="close-settings-btn"
            onClick={onClose}
            aria-label="Close settings"
            title="Close settings"
        >
            <FaTimes />
        </button>
    );
};

export default CloseSettingsIcon;
