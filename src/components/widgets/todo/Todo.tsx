import { useEffect, useRef, useState } from 'react';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import {
    FaTasks,
    FaChevronDown,
    FaChevronUp,
    FaPlus,
    FaMinus,
    FaEye,
    FaEyeSlash,
    FaTrash,
} from 'react-icons/fa';
import '../../../assets/css/todo.css';
import { useTodoData } from './useTodoData';

const TodoWidget: React.FC = () => {
    const {
        visibleTasks,
        showCompleted,
        isLoading,
        completedCount,
        totalCount,
        addTask,
        removeTask,
        toggleTask,
        reorderTasks,
        toggleShowCompleted,
        clearCompleted,
    } = useTodoData();

    const [newTaskText, setNewTaskText] = useState('');
    const [expanded, setExpanded] = useState(true);
    const listRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddTask = () => {
        if (!newTaskText.trim()) return;
        addTask(newTaskText);
        setNewTaskText('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    // Drag and drop setup
    useEffect(() => {
        const container = listRef.current;
        if (!container) return;

        const disposables = Array.from(container.children).map((child) => {
            const el = child as HTMLElement;
            const taskId = el.dataset.id;
            if (!taskId) return [];

            const cleanupDraggable: CleanupFn = (
                draggable as (options: {
                    element: HTMLElement;
                    getInitialData: () => { taskId: string };
                }) => CleanupFn
            )({
                element: el,
                getInitialData: () => ({ taskId }),
            });

            const cleanupDrop: CleanupFn = dropTargetForElements({
                element: el,
                getData: () => ({ taskId }),
                onDrop: ({ source }) => {
                    const sourceTaskId = source.data.taskId as string;
                    if (!sourceTaskId || !taskId || sourceTaskId === taskId)
                        return;

                    const fromIndex = visibleTasks.findIndex(
                        (t) => t.id === sourceTaskId,
                    );
                    const toIndex = visibleTasks.findIndex(
                        (t) => t.id === taskId,
                    );

                    if (fromIndex !== -1 && toIndex !== -1) {
                        reorderTasks(fromIndex, toIndex);
                    }
                },
            });

            return [cleanupDraggable, cleanupDrop];
        });

        return () => {
            disposables.flat().forEach((cleanup) => cleanup());
        };
    }, [visibleTasks, reorderTasks]);

    // Keyboard shortcut to toggle expanded
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'c') {
                setExpanded((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (isLoading) {
        return (
            <div className="todo-widget">
                <div className="todo-header">
                    <FaTasks className="todo-icon" />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className={`todo-widget ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className="todo-header">
                <FaTasks className="todo-icon" />
                <span>To-Do</span>
                {totalCount > 0 && (
                    <span className="todo-count">
                        {completedCount}/{totalCount}
                    </span>
                )}
                <div
                    className="todo-expand-btn"
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    {expanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>

            {expanded && (
                <>
                    <div className="todo-input">
                        <input
                            className="task-input"
                            ref={inputRef}
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add Task"
                        />
                        <div className="add-btn" onClick={handleAddTask}>
                            <FaPlus />
                        </div>
                    </div>

                    <div className="todo-controls">
                        <button
                            className="todo-control-btn"
                            onClick={toggleShowCompleted}
                            title={
                                showCompleted
                                    ? 'Hide completed'
                                    : 'Show completed'
                            }
                        >
                            {showCompleted ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        {completedCount > 0 && (
                            <button
                                className="todo-control-btn"
                                onClick={clearCompleted}
                                title="Clear completed"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>

                    <ul ref={listRef} className="todo-list">
                        {visibleTasks.map((task) => (
                            <li
                                key={task.id}
                                data-id={task.id}
                                className={`task-item ${task.completed ? 'completed' : ''}`}
                            >
                                <span
                                    className="task-text"
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {task.text}
                                </span>

                                <div
                                    className="delete-btn"
                                    onClick={() => removeTask(task.id)}
                                >
                                    <FaMinus />
                                </div>
                            </li>
                        ))}
                    </ul>

                    {visibleTasks.length === 0 && (
                        <div className="todo-empty">
                            {totalCount === 0
                                ? 'No tasks yet. Add one above!'
                                : 'All tasks completed! 🎉'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TodoWidget;
