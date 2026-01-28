import { useState, useId } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import '../../assets/css/foldable_section.css';
import { FoldableSectionProps } from '../../utils/types';

const FoldableSection: React.FC<FoldableSectionProps> = ({
    title,
    icon,
    children,
    defaultOpen = false,
    extraClassName = '',
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentId = useId();

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="foldable-section">
            <button
                type="button"
                className="foldable-section__header"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                {icon && (
                    <span className="foldable-section__icon" aria-hidden="true">
                        {icon}
                    </span>
                )}
                <span className="foldable-section__title">{title}</span>
                <span
                    className={`foldable-section__chevron ${isOpen ? 'foldable-section__chevron--open' : ''}`}
                    aria-hidden="true"
                >
                    <FaChevronDown />
                </span>
            </button>

            <div
                id={contentId}
                className={`foldable-section__content-wrapper ${isOpen ? 'foldable-section__content-wrapper--open' : ''}`}
                role="region"
                aria-labelledby={`${contentId}-header`}
            >
                <div className="foldable-section__content-inner">
                    <div
                        className={`foldable-section__content ${extraClassName}`}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoldableSection;
