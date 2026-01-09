import { useCallback } from 'react';
import { useWidgetData } from '../../../hooks/useWidgetData';
import { Task, TodoWidgetData } from '../../../utils/types';
import { todoDataConfig } from './todoConfig';

/**
 * Custom hook for Todo widget data management
 * Provides type-safe access to todo-specific operations
 */
export const useTodoData = () => {
    const { data, isLoading, updateData, resetData, lastUpdated } =
        useWidgetData<TodoWidgetData>(todoDataConfig);

    // Add a new task
    const addTask = useCallback(
        (text: string) => {
            if (!text.trim()) return;

            const newTask: Task = {
                id: crypto.randomUUID(),
                text: text.trim(),
                completed: false,
                createdAt: Date.now(),
            };

            updateData((prev) => ({
                ...prev,
                tasks: [...prev.tasks, newTask],
            }));
        },
        [updateData],
    );

    // Remove a task
    const removeTask = useCallback(
        (id: string) => {
            updateData((prev) => ({
                ...prev,
                tasks: prev.tasks.filter((task) => task.id !== id),
            }));
        },
        [updateData],
    );

    // Toggle task completion
    const toggleTask = useCallback(
        (id: string) => {
            updateData((prev) => ({
                ...prev,
                tasks: prev.tasks.map((task) =>
                    task.id === id
                        ? {
                              ...task,
                              completed: !task.completed,
                              completedAt: !task.completed
                                  ? Date.now()
                                  : undefined,
                          }
                        : task,
                ),
            }));
        },
        [updateData],
    );

    // Reorder tasks (for drag and drop)
    const reorderTasks = useCallback(
        (fromIndex: number, toIndex: number) => {
            updateData((prev) => {
                const reordered = [...prev.tasks];
                const [moved] = reordered.splice(fromIndex, 1);
                reordered.splice(toIndex, 0, moved);
                return { ...prev, tasks: reordered };
            });
        },
        [updateData],
    );

    // Toggle show completed tasks
    const toggleShowCompleted = useCallback(() => {
        updateData((prev) => ({
            ...prev,
            showCompleted: !prev.showCompleted,
        }));
    }, [updateData]);

    // Clear completed tasks
    const clearCompleted = useCallback(() => {
        updateData((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((task) => !task.completed),
        }));
    }, [updateData]);

    // Get filtered tasks based on showCompleted
    const visibleTasks = data.showCompleted
        ? data.tasks
        : data.tasks.filter((task) => !task.completed);

    const completedCount = data.tasks.filter((task) => task.completed).length;
    const totalCount = data.tasks.length;

    return {
        // Data
        tasks: data.tasks,
        visibleTasks,
        showCompleted: data.showCompleted,
        isLoading,
        lastUpdated,

        // Stats
        completedCount,
        totalCount,

        // Actions
        addTask,
        removeTask,
        toggleTask,
        reorderTasks,
        toggleShowCompleted,
        clearCompleted,
        resetData,
    };
};
