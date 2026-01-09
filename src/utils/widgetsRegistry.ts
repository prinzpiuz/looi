import { FaCalendarAlt, FaTasks } from 'react-icons/fa';
import { IconProps, WidgetConfig, WidgetSize } from './types';
import CalendarWidget from '../components/widgets/calendar/Calendar';
import TodoWidget from '../components/widgets/todo/Todo';

export enum widgetType {
    CALENDAR = 'calendar',
    TODO = 'todo',
}

export const widgetIcons: Record<string, IconProps> = {
    [widgetType.CALENDAR]: FaCalendarAlt,
    [widgetType.TODO]: FaTasks,
};

export const widgetRegistry: Record<string, React.FC> = {
    [widgetType.CALENDAR]: CalendarWidget,
    [widgetType.TODO]: TodoWidget,
    // add more
};

export const getWidgetSize = (
    widgetId: string,
    customSize?: WidgetSize,
): WidgetSize => {
    if (customSize) {
        return customSize;
    }
    return (
        widgetDefaultSizes[widgetId] || {
            w: 2,
            h: 2,
            minW: 1,
            maxW: 6,
            minH: 1,
            maxH: 6,
        }
    );
};

export const widgetDefaultSizes: Record<string, WidgetSize> = {
    [widgetType.CALENDAR]: {
        w: 4,
        h: 3,
        minW: 4,
        maxW: 4,
        minH: 3,
        maxH: 3,
    },
    [widgetType.TODO]: {
        w: 4,
        h: 1,
        minW: 4,
        maxW: 4,
        minH: 1,
        maxH: 1,
    },
};

export const defaultWidgetConfigs: WidgetConfig[] = [
    {
        id: widgetType.CALENDAR,
        name: 'Calendar',
        enabled: true,
        size: getWidgetSize(widgetType.CALENDAR),
        isResizable: false,
    },
    {
        id: widgetType.TODO,
        name: 'To-Do List',
        enabled: false,
        size: getWidgetSize(widgetType.TODO),
        isResizable: false,
    },
];
