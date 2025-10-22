import { useRef, useState } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { widgetRegistry } from '../../utils/widgetsRegistry';
import { WidgetConfig } from '../../utils/types';
import { useSettings } from '../../hooks/settingsContext';

const DraggableWidget: React.FC<{
    id: string;
    config: WidgetConfig;
}> = ({ id, config }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const { updateWidgetPosition } = useSettings();
    const [position, setPosition] = useState(
        config.position || { x: 50, y: 50 },
    );
    const WidgetComponent = widgetRegistry[id];
    if (!WidgetComponent) return null;

    return (
        <Draggable
            nodeRef={nodeRef}
            key={id}
            position={position}
            onStop={(_, data: DraggableData) => {
                const newPos = { x: data.x, y: data.y };
                setPosition(newPos);
                void updateWidgetPosition(id, newPos);
            }}
        >
            <div ref={nodeRef} style={{ position: 'absolute' }}>
                <WidgetComponent />
            </div>
        </Draggable>
    );
};

export default DraggableWidget;
