import { useEffect, useRef, useCallback } from 'react';
import { FaPalette, FaGithub, FaListUl, FaTimes } from 'react-icons/fa';
import ColorPanel from './background/ColorPicker';
import BgImageURL from './background/BgImageInput';
import FoldableSection from './FoldableSection';
import AddWidget from './widgets/AddWidgets';
import LogoAndVersion from './versionAndLogo/versionAndLogo';
import GitHubSync from './github/GithubSync';
import '../../assets/css/settings_panel.css';
import SettingsIcon from './SettingsIcon';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

const SECTION_ICON_COLOR = '#ffffff';

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    onOpen,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        },
        [isOpen, onClose],
    );

    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            const target = e.target as Node;
            if (!isOpen) return;
            if (panelRef.current?.contains(target)) return;
            if (triggerRef.current?.contains(target)) return;

            onClose();
        },
        [isOpen, onClose],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleKeyDown, handleClickOutside]);

    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            panelRef.current?.focus();
        } else {
            previousFocusRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <SettingsIcon
                ref={triggerRef}
                onClick={onOpen}
                aria-expanded={isOpen}
                aria-controls="settings-panel"
            />

            <div
                className={`settings-overlay ${isOpen ? 'open' : ''}`}
                aria-hidden="true"
            />

            <div
                ref={panelRef}
                id="settings-panel"
                className={`settings-panel ${isOpen ? 'open' : ''}`}
                role="dialog"
                aria-label="Settings"
                aria-modal="true"
                tabIndex={-1}
            >
                <div className="settings-panel__header">
                    <h2 className="settings-panel__title">Settings</h2>
                    <button
                        type="button"
                        className="settings-panel__close"
                        onClick={onClose}
                        aria-label="Close settings"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>
                <div className="settings-panel__content">
                    <FoldableSection
                        icon={<FaPalette color={SECTION_ICON_COLOR} />}
                        title="Background"
                        extraClassName="foldable-section__content-flex"
                        defaultOpen
                    >
                        <ColorPanel />
                        <BgImageURL />
                    </FoldableSection>

                    <FoldableSection
                        icon={<FaListUl color={SECTION_ICON_COLOR} />}
                        title="Widgets"
                    >
                        <AddWidget />
                    </FoldableSection>

                    <FoldableSection
                        icon={<FaGithub color={SECTION_ICON_COLOR} />}
                        title="GitHub Sync"
                    >
                        <GitHubSync />
                    </FoldableSection>
                </div>

                <div className="settings-panel__footer">
                    <LogoAndVersion />
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;
