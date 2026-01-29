import { useState, useCallback, useEffect, useRef } from 'react';
import { FaLink, FaTimes } from 'react-icons/fa';
import { useSettings } from '../../../hooks/settingsContext';
import { debounce } from '../../../utils/debounce';
import '../../../assets/css/bg_image_input.css';
import { toast } from '../../../utils/toastStore';

const BgImageInput: React.FC = () => {
    const { settings, updateAndPersistSettings } = useSettings();
    const [inputValue, setInputValue] = useState(settings?.bgUrl ?? '');

    useEffect(() => {
        if (settings?.bgUrl !== undefined) {
            setInputValue(settings.bgUrl);
        }
    }, [settings?.bgUrl]);

    const debouncedSave = useRef(
        debounce((...args: unknown[]) => {
            const url = args[0] as string;
            void updateAndPersistSettings({ bgUrl: url });
        }, 500),
    ).current;

    useEffect(() => {
        return () => {
            debouncedSave.cancel();
        };
    }, [debouncedSave]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newUrl = e.target.value;
            setInputValue(newUrl);

            if (newUrl) {
                debouncedSave(newUrl);
            } else {
                debouncedSave(newUrl);
            }
        },
        [debouncedSave],
    );
    const handleClear = useCallback(() => {
        setInputValue('');
        debouncedSave.cancel();
        void updateAndPersistSettings({ bgUrl: '' });
    }, [updateAndPersistSettings, debouncedSave]);

    const handleImageLoad = useCallback(() => {}, []);

    const handleImageError = useCallback(() => {
        toast.error('Failed to load background image. Please check the URL.', {
            id: 'bg-image-error',
        });
    }, []);

    return (
        <div className="bg-image-input">
            <div className="bg-image-input__input-wrapper">
                <FaLink className="bg-image-input__icon" aria-hidden="true" />
                <input
                    id="bg-url-input"
                    type="url"
                    className="bg-image-input__input"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                />
                {inputValue && (
                    <button
                        type="button"
                        className="bg-image-input__clear"
                        onClick={handleClear}
                        aria-label="Clear image URL"
                        title="Clear"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {inputValue && (
                <img
                    src={inputValue}
                    alt="Background preview"
                    className="bg-image-input__preview-image"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            )}
        </div>
    );
};

export default BgImageInput;
