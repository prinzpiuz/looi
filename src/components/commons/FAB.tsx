import '../../assets/css/fab.css';

interface FloatingButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
    position?: 'settings' | 'add-bookmark' | 'custom';
    style?: React.CSSProperties;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
    icon,
    onClick,
    label,
    position = 'custom',
    style,
}) => {
    return (
        <button
            type="button"
            className={`floating-btn floating-btn--${position}`}
            onClick={onClick}
            aria-label={label}
            title={label}
            style={style}
        >
            {icon}
        </button>
    );
};

export default FloatingButton;
