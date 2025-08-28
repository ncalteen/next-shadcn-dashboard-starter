import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

const defaultCols = [
  {
    id: 'TODO' as const,
    title: 'Todo'
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'In Progress'
  },
  {
    id: 'DONE' as const,
    title: 'Done'
  }
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
};

const initialTasks: Task[] = [
  {
    id: 'task1',
    status: 'TODO',
    title: 'Project initiation and planning',
    description: 'Set up project structure and define initial requirements'
  },
  {
    id: 'task2',
    status: 'TODO',
    title: 'Gather requirements from stakeholders',
    description: 'Meet with stakeholders to understand business needs'
  },
  {
    id: 'task3',
    status: 'TODO',
    title: 'Research technical solutions',
    description: 'Evaluate different technical approaches and tools'
  },
  {
    id: 'task4',
    status: 'IN_PROGRESS',
    title: 'Design system architecture',
    description: 'Create high-level system design and architecture diagrams'
  },
  {
    id: 'task5',
    status: 'IN_PROGRESS',
    title: 'Implement core functionality',
    description: 'Develop the main features and components'
  },
  {
    id: 'task6',
    status: 'IN_PROGRESS',
    title: 'Set up development environment',
    description: 'Configure development tools and CI/CD pipeline'
  },
  {
    id: 'task7',
    status: 'DONE',
    title: 'Create project repository',
    description: 'Initialize Git repository and set up basic project structure'
  },
  {
    id: 'task8',
    status: 'DONE',
    title: 'Define coding standards',
    description: 'Establish code style guidelines and linting rules'
  },
  {
    id: 'task9',
    status: 'DONE',
    title: 'Set up team communication channels',
    description: 'Create Slack workspace and establish communication protocols'
  }
];

export type Actions = {
  addTask: (title: string, description?: string) => void;
  addCol: (title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      columns: defaultCols,
      draggedTask: null,
      addTask: (title: string, description?: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: uuid(), title, description, status: 'TODO' }
          ]
        })),
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title: newName } : col
          )
        })),
      addCol: (title: string) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { title, id: state.columns.length ? title.toUpperCase() : 'TODO' }
          ]
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id)
        })),
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
      setCols: (newCols: Column[]) => set({ columns: newCols })
    }),
    { name: 'task-store', skipHydration: true }
  )
);
