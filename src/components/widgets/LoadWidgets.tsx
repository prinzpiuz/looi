import { useSettings } from '../../hooks/settingsContext';
import DraggableWidget from './DraggableWidget';

const LoadWidgets: React.FC = () => {
    const { settings } = useSettings();
    const widgetConfigs = settings?.widgetConfigs || {};
    return (
        <>
            {Object.entries(widgetConfigs).map(([id, config]) => {
                if (!config.enabled) return null;
                return <DraggableWidget key={id} id={id} config={config} />;
            })}
        </>
    );
};

export default LoadWidgets;
