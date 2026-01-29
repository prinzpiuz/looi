import { WidgetDataConfig, TodoWidgetData } from '../../../utils/types';

export const TODO_DATA_VERSION = 1;

export const DEFAULT_TODO_DATA: TodoWidgetData = {
    tasks: [],
    showCompleted: true,
};

// Widget data configuration
export const todoDataConfig: WidgetDataConfig<TodoWidgetData> = {
    widgetId: 'todo',
    version: TODO_DATA_VERSION,
    defaultData: DEFAULT_TODO_DATA,
    migrations: {
        // Example migration from v1 to v2 (for future use)
        // 2: (oldData: unknown) => {
        //     const old = oldData as { tasks: Task[] };
        //     return {
        //         ...old,
        //         showCompleted: true,  // New field with default
        //         tasks: old.tasks.map(task => ({
        //             ...task,
        //             createdAt: task.createdAt || Date.now(),  // Add missing field
        //         })),
        //     };
        // },
    },
};
