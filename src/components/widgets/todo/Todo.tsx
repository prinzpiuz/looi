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
} from 'react-icons/fa';
import '../../../assets/css/todo.css';
import { Task } from '../../../utils/types';

const TodoWidget: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [expanded, setExpanded] = useState(true);
    const listRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const addTask = () => {
        if (!newTask.trim()) return;
        const task: Task = {
            id: crypto.randomUUID(),
            text: newTask,
            completed: false,
        };
        setTasks((prev) => [...prev, task]);
        setNewTask('');
        inputRef.current?.focus();
    };

    const removeTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const toggleComplete = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task,
            ),
        );
    };

    useEffect(() => {
        const container = listRef.current;
        if (!container) return;

        // register all items as draggable + droppable
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
                    const sourceTaskId = source.data.taskId;
                    if (!sourceTaskId || !taskId || sourceTaskId === taskId)
                        return;

                    setTasks((prev) => {
                        const fromIndex = prev.findIndex(
                            (t) => t.id === sourceTaskId,
                        );
                        const toIndex = prev.findIndex((t) => t.id === taskId);
                        const reordered = [...prev];
                        const [moved] = reordered.splice(fromIndex, 1);
                        reordered.splice(toIndex, 0, moved);
                        return reordered;
                    });
                },
            });

            return [cleanupDraggable, cleanupDrop];
        });

        return () => {
            disposables.flat().forEach((cleanup) => cleanup());
        };
    }, [tasks]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'c') {
                setExpanded((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className={`todo-widget ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className="todo-header">
                <FaTasks className="todo-icon" />
                To-Do
                <div onClick={() => setExpanded((prev) => !prev)}>
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
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add Task"
                        />

                        <div onClick={addTask}>
                            <FaPlus />
                        </div>
                    </div>

                    <ul ref={listRef} className="todo-list">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                data-id={task.id}
                                className={`task-item ${task.completed ? 'completed' : ''}`}
                            >
                                <span
                                    className="task-text"
                                    onClick={() => toggleComplete(task.id)}
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
                </>
            )}
        </div>
    );
};

export default TodoWidget;
