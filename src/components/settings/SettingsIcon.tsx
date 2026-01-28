import { forwardRef } from 'react';
import { FaCog } from 'react-icons/fa';
import FloatingButton from '../commons/FAB';

interface SettingsIconProps {
    onClick: () => void;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
}

const SettingsIcon = forwardRef<HTMLButtonElement, SettingsIconProps>(
    ({ onClick }) => {
        return (
            <FloatingButton
                icon={<FaCog size={18} />}
                onClick={onClick}
                label="Settings"
                position="settings"
            />
        );
    },
);

SettingsIcon.displayName = 'SettingsIcon';

export default SettingsIcon;
