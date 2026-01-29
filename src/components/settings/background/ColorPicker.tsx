import { useCallback } from 'react';
import { CirclePicker } from 'react-color';
import { useSettings } from '../../../hooks/settingsContext';
import { COLOR_PALETTE } from '../../../utils/constants';
import '../../../assets/css/color_picker.css';
import { ColorResult } from '../../../utils/types';

const ColorPicker: React.FC = () => {
    const { settings, updateAndPersistSettings } = useSettings();
    const currentColor = settings?.bgColor ?? '#000000';

    const handlePaletteChange = useCallback(
        (color: ColorResult) => {
            if (!settings) return;
            void updateAndPersistSettings({ bgColor: color.hex });
        },
        [settings, updateAndPersistSettings],
    );

    const handleCustomColorChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!settings) return;
            void updateAndPersistSettings({ bgColor: e.target.value }, false);
        },
        [settings, updateAndPersistSettings],
    );

    const handleCustomColorComplete = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!settings) return;
            void updateAndPersistSettings({ bgColor: e.target.value });
        },
        [settings, updateAndPersistSettings],
    );

    return (
        <div className="color-picker">
            <div className="color-picker__section">
                <div className="color-picker__palette">
                    <CirclePicker
                        color={currentColor}
                        colors={COLOR_PALETTE}
                        onChange={handlePaletteChange}
                        width="200px"
                        circleSize={24}
                        circleSpacing={10}
                    />
                </div>
            </div>

            <div className="color-picker__section color-picker__section--custom">
                <div className="color-picker__custom">
                    <div className="color-picker__input-wrapper">
                        <input
                            id="custom-color-input"
                            type="color"
                            className="color-picker__input"
                            value={currentColor}
                            onChange={handleCustomColorChange}
                            onBlur={handleCustomColorComplete}
                        />
                        <div
                            className="color-picker__preview"
                            style={{ backgroundColor: currentColor }}
                        />
                    </div>
                    <div className="color-picker__current">
                        <span className="color-picker__current-value">
                            {currentColor}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
