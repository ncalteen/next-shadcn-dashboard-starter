import { Task } from '../utils/store';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import {
  IconGripVertical,
  IconClockHour4,
  IconChecks,
  IconPlus
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ColumnActions } from './column-action';
import { TaskCard } from './task-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

// Helper function to get column-specific styling and icons
function getColumnConfig(columnId: string) {
  switch (columnId) {
    case 'TODO':
      return {
        icon: IconPlus,
        borderColor: 'border-slate-200 dark:border-slate-700',
        headerColor: 'bg-slate-50 dark:bg-slate-800/50',
        badgeVariant: 'secondary' as const,
        iconColor: 'text-slate-500'
      };
    case 'IN_PROGRESS':
      return {
        icon: IconClockHour4,
        borderColor: 'border-blue-200 dark:border-blue-700',
        headerColor: 'bg-blue-50 dark:bg-blue-900/20',
        badgeVariant: 'default' as const,
        iconColor: 'text-blue-500'
      };
    case 'DONE':
      return {
        icon: IconChecks,
        borderColor: 'border-green-200 dark:border-green-700',
        headerColor: 'bg-green-50 dark:bg-green-900/20',
        badgeVariant: 'secondary' as const,
        iconColor: 'text-green-500'
      };
    default:
      return {
        icon: IconPlus,
        borderColor: 'border-slate-200 dark:border-slate-700',
        headerColor: 'bg-slate-50 dark:bg-slate-800/50',
        badgeVariant: 'secondary' as const,
        iconColor: 'text-slate-500'
      };
  }
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const columnConfig = getColumnConfig(column.id.toString());
  const ColumnIcon = columnConfig.icon;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva(
    'h-[75vh] max-h-[75vh] w-[350px] max-w-full flex flex-col shrink-0 snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary'
        }
      }
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })} ${columnConfig.borderColor} bg-background`}
    >
      <CardHeader
        className={`space-between flex flex-row items-center border-b-2 p-4 text-left font-semibold ${columnConfig.headerColor} ${columnConfig.borderColor}`}
      >
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className='text-primary/50 relative -ml-2 h-auto cursor-grab p-1'
        >
          <span className='sr-only'>{`Move column: ${column.title}`}</span>
          <IconGripVertical />
        </Button>
        <div className='mr-auto flex items-center gap-2'>
          <ColumnIcon className={`h-4 w-4 ${columnConfig.iconColor}`} />
          <span className='font-semibold'>{column.title}</span>
          <Badge variant={columnConfig.badgeVariant} className='ml-1'>
            {tasks.length}
          </Badge>
        </div>
        <ColumnActions id={column.id} title={column.title} />
      </CardHeader>
      <CardContent className='flex grow flex-col gap-4 overflow-x-hidden p-2'>
        <ScrollArea className='h-full'>
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('px-2  pb-4 md:px-0 flex lg:justify-start', {
    variants: {
      dragging: {
        default: '',
        active: 'snap-none'
      }
    }
  });

  return (
    <ScrollArea className='w-full rounded-md whitespace-nowrap'>
      <div
        className={variations({
          dragging: dndContext.active ? 'active' : 'default'
        })}
      >
        <div className='flex flex-row items-start justify-center gap-4'>
          {children}
        </div>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
