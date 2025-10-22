import { widgetIcons } from '../../../utils/widgetsRegistry';
import { useSettings } from '../../../hooks/settingsContext';
import { capitalize } from '../../../utils/utils';

const widgetsDivStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
};

const singleWidgetStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const widgetIconStyle: React.CSSProperties = {
    color: '#789ef7',
    fontSize: 19,
    marginRight: 10,
    marginLeft: 5,
};

const widgetNameStyle: React.CSSProperties = {
    flex: 1,
    color: '#ffffff',
    fontWeight: 600,
};

const widgetAddButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg,#2f82e4,#4559f9)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    padding: '4px 16px',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    marginLeft: 6,
    width: 80,
};

const AddWidget: React.FC = () => {
    const { settings, enableDisableWidget } = useSettings();
    const widgetConfigs = settings?.widgetConfigs || {};

    return (
        <div style={widgetsDivStyle}>
            {Object.entries(widgetConfigs).map(([id, config]) => {
                if (!widgetIcons[id]) return null;
                const WidgetIcon = widgetIcons[id];
                const buttonText = config.enabled ? 'Remove' : 'Add';
                return (
                    <div key={id} style={singleWidgetStyle}>
                        <WidgetIcon style={widgetIconStyle} />
                        <span style={widgetNameStyle}>{capitalize(id)}</span>
                        <button
                            style={widgetAddButtonStyle}
                            onClick={() => {
                                void enableDisableWidget(id, !config.enabled);
                            }}
                        >
                            {buttonText}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AddWidget;
