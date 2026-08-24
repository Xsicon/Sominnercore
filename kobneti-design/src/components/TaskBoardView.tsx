import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  GitPullRequest,
  GitMerge,
  ExternalLink,
  ChevronDown,
  Layers,
  Calendar,
  Tag,
  User,
  X,
  Check,
  Flame,
  Bug,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
  MoveRight,
  MoreHorizontal,
  Kanban,
  List,
  AlertCircle,
} from 'lucide-react';

export type TaskType = 'Bug' | 'Feature' | 'Chore';
export type ColumnId = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface TaskItem {
  id: string;
  key: string;
  title: string;
  type: TaskType;
  points: number;
  product: string;
  columnId: ColumnId;
  assignee?: {
    name: string;
    initials: string;
    avatar?: string;
  };
  pr?: {
    number: string;
    status: 'linked' | 'merged';
    url?: string;
  };
  description?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

interface TaskBoardViewProps {
  viewMode?: 'board' | 'list';
  onNewTask?: () => void;
}

const INITIAL_TASKS: TaskItem[] = [
  // COLUMN 1: Backlog (12)
  {
    id: 't-eng-45',
    key: 'ENG-45',
    title: 'Refactor payment gateway',
    type: 'Bug',
    points: 5,
    product: 'Salguri',
    columnId: 'backlog',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Clean up legacy retry loop in Salguri payment gateway adapter and introduce circuit breaker.',
    priority: 'High',
  },
  {
    id: 't-eng-46',
    key: 'ENG-46',
    title: 'Update API documentation',
    type: 'Chore',
    points: 3,
    product: 'GaarX',
    columnId: 'backlog',
    assignee: {
      name: 'Leila H.',
      initials: 'LH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Synchronize OpenAPI schema 3.1 with recent telemetry endpoints in GaarX fleet microservice.',
    priority: 'Low',
  },
  {
    id: 't-eng-47',
    key: 'ENG-47',
    title: 'User role permissions refactor',
    type: 'Bug',
    points: 8,
    product: 'Dhaxal',
    columnId: 'backlog',
    description: 'Resolve token validation race condition on inherited executor roles in Dhaxal platform.',
    priority: 'High',
  },
  {
    id: 't-eng-48',
    key: 'ENG-48',
    title: 'Mobile app UI improvements',
    type: 'Feature',
    points: 13,
    product: 'MuuqWear',
    columnId: 'backlog',
    assignee: {
      name: 'Mike C.',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Redesign product catalogue carousel with micro-interactions and smooth checkout animations.',
    priority: 'Medium',
  },
  {
    id: 't-eng-49',
    key: 'ENG-49',
    title: 'Database migration script',
    type: 'Chore',
    points: 3,
    product: 'SomPay',
    columnId: 'backlog',
    assignee: {
      name: 'Sarah K.',
      initials: 'SK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Write zero-downtime column migration script for merchant invoice indexing tables.',
    priority: 'Medium',
  },
  {
    id: 't-eng-50',
    key: 'ENG-50',
    title: 'Webhook retry backoff logic',
    type: 'Bug',
    points: 5,
    product: 'Ilays',
    columnId: 'backlog',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Implement exponential backoff with jitter on dropped webhook triggers.',
    priority: 'Medium',
  },
  {
    id: 't-eng-51',
    key: 'ENG-51',
    title: 'Multi-currency settlement support',
    type: 'Feature',
    points: 8,
    product: 'Salguri',
    columnId: 'backlog',
    description: 'Support automatic FX conversions on checkout payouts.',
    priority: 'High',
  },
  {
    id: 't-eng-52',
    key: 'ENG-52',
    title: 'Audit logging ingestion pipeline',
    type: 'Chore',
    points: 5,
    product: 'Dhaxal',
    assignee: {
      name: 'Sarah K.',
      initials: 'SK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    columnId: 'backlog',
    priority: 'Low',
  },
  {
    id: 't-eng-53',
    key: 'ENG-53',
    title: 'Redis session store cluster config',
    type: 'Chore',
    points: 3,
    product: 'GaarX',
    columnId: 'backlog',
    priority: 'Medium',
  },
  {
    id: 't-eng-54',
    key: 'ENG-54',
    title: 'Dark mode theme persistence bug',
    type: 'Bug',
    points: 2,
    product: 'MuuqWear',
    columnId: 'backlog',
    assignee: {
      name: 'Mike C.',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    priority: 'Low',
  },
  {
    id: 't-eng-55',
    key: 'ENG-55',
    title: 'Export transactions to CSV',
    type: 'Feature',
    points: 3,
    product: 'SomPay',
    columnId: 'backlog',
    priority: 'Medium',
  },
  {
    id: 't-eng-56',
    key: 'ENG-56',
    title: 'Grafana telemetry alert triggers',
    type: 'Chore',
    points: 2,
    product: 'Ilays',
    columnId: 'backlog',
    priority: 'Low',
  },

  // COLUMN 2: To Do (8)
  {
    id: 't-eng-40',
    key: 'ENG-40',
    title: 'Checkout timeout fix',
    type: 'Bug',
    points: 5,
    product: 'MuuqWear',
    columnId: 'todo',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Fix race condition during payment handshake on slow cellular networks.',
    priority: 'High',
  },
  {
    id: 't-eng-41',
    key: 'ENG-41',
    title: 'API rate limiting',
    type: 'Feature',
    points: 8,
    product: 'GaarX',
    columnId: 'todo',
    assignee: {
      name: 'Leila H.',
      initials: 'LH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Introduce Token Bucket rate-limiter middleware across public endpoints.',
    priority: 'High',
  },
  {
    id: 't-eng-42',
    key: 'ENG-42',
    title: '3DS verification handler',
    type: 'Bug',
    points: 3,
    product: 'Salguri',
    columnId: 'todo',
    description: 'Add missing iframe callback interceptor for European cards.',
    priority: 'High',
  },
  {
    id: 't-eng-43',
    key: 'ENG-43',
    title: 'Invoice PDF generator',
    type: 'Feature',
    points: 5,
    product: 'SomPay',
    columnId: 'todo',
    assignee: {
      name: 'Mike C.',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Generate customizable vectorized PDF invoices with VAT breakdown.',
    priority: 'Medium',
  },
  {
    id: 't-eng-44',
    key: 'ENG-44',
    title: 'Password complexity enforcement',
    type: 'Feature',
    points: 3,
    product: 'Dhaxal',
    columnId: 'todo',
    assignee: {
      name: 'Sarah K.',
      initials: 'SK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
  },
  {
    id: 't-eng-57',
    key: 'ENG-57',
    title: 'Clean up stale S3 bucket artifacts',
    type: 'Chore',
    points: 2,
    product: 'Ilays',
    columnId: 'todo',
    priority: 'Low',
  },
  {
    id: 't-eng-58',
    key: 'ENG-58',
    title: 'Elasticsearch query caching',
    type: 'Feature',
    points: 5,
    product: 'GaarX',
    columnId: 'todo',
    assignee: {
      name: 'Leila H.',
      initials: 'LH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    priority: 'Medium',
  },
  {
    id: 't-eng-59',
    key: 'ENG-59',
    title: 'SMS verification gateway fallback',
    type: 'Bug',
    points: 3,
    product: 'SomPay',
    columnId: 'todo',
    priority: 'High',
  },

  // COLUMN 3: In Progress (5)
  {
    id: 't-eng-35',
    key: 'ENG-35',
    title: 'Payment gateway integration',
    type: 'Feature',
    points: 8,
    product: 'Salguri',
    columnId: 'in-progress',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #142',
      status: 'linked',
      url: 'https://github.com/kobneti/salguri/pull/142',
    },
    description: 'Implement new asynchronous direct debit integration with automatic retry queue.',
    priority: 'High',
  },
  {
    id: 't-eng-36',
    key: 'ENG-36',
    title: 'User authentication refactor',
    type: 'Bug',
    points: 5,
    product: 'GaarX',
    columnId: 'in-progress',
    assignee: {
      name: 'Leila H.',
      initials: 'LH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #189',
      status: 'linked',
      url: 'https://github.com/kobneti/gaarx/pull/189',
    },
    description: 'Fix expired refresh token refresh loop causing premature user sign-outs.',
    priority: 'High',
  },
  {
    id: 't-eng-37',
    key: 'ENG-37',
    title: 'Dashboard performance',
    type: 'Bug',
    points: 3,
    product: 'Ilays',
    columnId: 'in-progress',
    assignee: {
      name: 'Sarah K.',
      initials: 'SK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Memoize heavy chart rendering pipeline to resolve UI lag on data updates.',
    priority: 'Medium',
  },
  {
    id: 't-eng-38',
    key: 'ENG-38',
    title: 'Email notification system',
    type: 'Feature',
    points: 5,
    product: 'MuuqWear',
    columnId: 'in-progress',
    assignee: {
      name: 'Mike C.',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Transactional email queue with SendGrid and MJML templating.',
    priority: 'Medium',
  },
  {
    id: 't-eng-39',
    key: 'ENG-39',
    title: 'GraphQL schema federation',
    type: 'Feature',
    points: 8,
    product: 'Dhaxal',
    columnId: 'in-progress',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #103',
      status: 'linked',
      url: 'https://github.com/kobneti/dhaxal/pull/103',
    },
    priority: 'High',
  },

  // COLUMN 4: Review (4)
  {
    id: 't-eng-30',
    key: 'ENG-30',
    title: '3DS verification fix',
    type: 'Bug',
    points: 3,
    product: 'Salguri',
    columnId: 'review',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #138',
      status: 'merged',
      url: 'https://github.com/kobneti/salguri/pull/138',
    },
    description: 'Resolve missing status callback on 3DS frictionless flow in Salguri checkout.',
    priority: 'High',
  },
  {
    id: 't-eng-31',
    key: 'ENG-31',
    title: 'API documentation update',
    type: 'Chore',
    points: 2,
    product: 'GaarX',
    columnId: 'review',
    assignee: {
      name: 'Leila H.',
      initials: 'LH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    description: 'Complete documentation for v2 fleet webhook payloads.',
    priority: 'Low',
  },
  {
    id: 't-eng-32',
    key: 'ENG-32',
    title: 'Password reset flow',
    type: 'Bug',
    points: 5,
    product: 'Dhaxal',
    columnId: 'review',
    assignee: {
      name: 'Sarah K.',
      initials: 'SK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #94',
      status: 'linked',
      url: 'https://github.com/kobneti/dhaxal/pull/94',
    },
    description: 'Add anti-bruteforce timing protection on password token verification.',
    priority: 'High',
  },
  {
    id: 't-eng-33',
    key: 'ENG-33',
    title: 'Mobile checkout',
    type: 'Feature',
    points: 8,
    product: 'MuuqWear',
    columnId: 'review',
    assignee: {
      name: 'Mike C.',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #204',
      status: 'linked',
      url: 'https://github.com/kobneti/muuqwear/pull/204',
    },
    description: 'One-click checkout screen for Android and iOS mobile web clients.',
    priority: 'High',
  },

  // COLUMN 5: Done (7)
  {
    id: 't-eng-25',
    key: 'ENG-25',
    title: 'User profile update',
    type: 'Feature',
    points: 3,
    product: 'SomPay',
    columnId: 'done',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #129',
      status: 'merged',
      url: 'https://github.com/kobneti/sompay/pull/129',
    },
    description: 'Allow merchants to customize business avatar, trading name, and tax numbers.',
    priority: 'Medium',
  },
  {
    id: 't-eng-26',
    key: 'ENG-26',
    title: 'Order history API',
    type: 'Feature',
    points: 5,
    product: 'GaarX',
    columnId: 'done',
    assignee: {
      name: 'Leila H.',
      initials: 'LH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #176',
      status: 'merged',
      url: 'https://github.com/kobneti/gaarx/pull/176',
    },
    description: 'Paginated order history endpoint with date range and product filtering.',
    priority: 'High',
  },
  {
    id: 't-eng-27',
    key: 'ENG-27',
    title: 'CORS configuration',
    type: 'Bug',
    points: 2,
    product: 'Ilays',
    columnId: 'done',
    assignee: {
      name: 'Sarah K.',
      initials: 'SK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #88',
      status: 'merged',
      url: 'https://github.com/kobneti/ilays/pull/88',
    },
    description: 'Whitelist staging environment origins on Ilays production edge proxy.',
    priority: 'Medium',
  },
  {
    id: 't-eng-28',
    key: 'ENG-28',
    title: 'Email template update',
    type: 'Chore',
    points: 1,
    product: 'MuuqWear',
    columnId: 'done',
    assignee: {
      name: 'Mike C.',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #198',
      status: 'merged',
      url: 'https://github.com/kobneti/muuqwear/pull/198',
    },
    description: 'Update seasonal footer copyright and unsubscribe links in order receipts.',
    priority: 'Low',
  },
  {
    id: 't-eng-29',
    key: 'ENG-29',
    title: 'Session timeout warning modal',
    type: 'Feature',
    points: 3,
    product: 'Dhaxal',
    columnId: 'done',
    assignee: {
      name: 'Adeel D.',
      initials: 'AD',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #91',
      status: 'merged',
    },
    priority: 'Low',
  },
  {
    id: 't-eng-24',
    key: 'ENG-24',
    title: 'Stripe webhook signature validation',
    type: 'Bug',
    points: 5,
    product: 'Salguri',
    columnId: 'done',
    assignee: {
      name: 'Leila H.',
      initials: 'LH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #132',
      status: 'merged',
    },
    priority: 'High',
  },
  {
    id: 't-eng-23',
    key: 'ENG-23',
    title: 'Upgrade Node 20 LTS runtime',
    type: 'Chore',
    points: 2,
    product: 'SomPay',
    columnId: 'done',
    assignee: {
      name: 'Sarah K.',
      initials: 'SK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    pr: {
      number: 'PR #120',
      status: 'merged',
    },
    priority: 'Low',
  },
];

const COLUMNS: { id: ColumnId; label: string; countBadge: number }[] = [
  { id: 'backlog', label: 'Backlog', countBadge: 12 },
  { id: 'todo', label: 'To Do', countBadge: 8 },
  { id: 'in-progress', label: 'In Progress', countBadge: 5 },
  { id: 'review', label: 'Review', countBadge: 4 },
  { id: 'done', label: 'Done', countBadge: 7 },
];

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  viewMode = 'board',
  onNewTask,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedSprint, setSelectedSprint] = useState('Sprint 23');
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');

  // Drag & Drop State
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<ColumnId | null>(null);

  // Modal State: Inspector / Editor
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // Modal State: Create Task
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>('Feature');
  const [newTaskPoints, setNewTaskPoints] = useState(3);
  const [newTaskProduct, setNewTaskProduct] = useState('Salguri');
  const [newTaskColumn, setNewTaskColumn] = useState<ColumnId>('backlog');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Adeel D.');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter tasks based on Search, Product, Sprint
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignee?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.product.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProduct =
      selectedProduct === 'All Products' || task.product === selectedProduct;

    return matchesSearch && matchesProduct;
  });

  // Calculate dynamic column stats
  const getTasksForColumn = (colId: ColumnId) => {
    return filteredTasks.filter((t) => t.columnId === colId);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggingTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: ColumnId) => {
    e.preventDefault();
    setDragOverColumnId(colId);
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = (e: React.DragEvent, targetColId: ColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    setDragOverColumnId(null);
    setDraggingTaskId(null);

    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.columnId === targetColId) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: targetColId } : t))
    );

    const colName = COLUMNS.find((c) => c.id === targetColId)?.label || targetColId;
    showToast(`Moved ${task.key} to ${colName}`);
  };

  // Create Task Handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const nextNumber = 60 + Math.floor(Math.random() * 20);
    const taskKey = `ENG-${nextNumber}`;

    const createdTask: TaskItem = {
      id: `t-eng-${Date.now()}`,
      key: taskKey,
      title: newTaskTitle,
      type: newTaskType,
      points: Number(newTaskPoints) || 3,
      product: newTaskProduct,
      columnId: newTaskColumn,
      assignee:
        newTaskAssignee === 'Unassigned'
          ? undefined
          : {
              name: newTaskAssignee,
              initials: newTaskAssignee
                .split(' ')
                .map((n) => n[0])
                .join(''),
            },
      description: newTaskDescription || 'Created via Task Board.',
      priority: 'Medium',
    };

    setTasks([createdTask, ...tasks]);
    setIsCreateTaskOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    showToast(`Created task ${taskKey}: ${createdTask.title}`);
  };

  // Type styling helper:
  // Bug = Danger red (#DC2626)
  // Feature = Primary (#6366F1)
  // Chore = Neutral (#64748B)
  const getTypeStyles = (type: TaskType) => {
    switch (type) {
      case 'Bug':
        return {
          stripe: 'border-l-[3.5px] border-l-[#DC2626]',
          badge: 'bg-rose-50 text-[#DC2626] border-rose-200',
          icon: '🐛',
          label: 'Bug',
        };
      case 'Feature':
        return {
          stripe: 'border-l-[3.5px] border-l-[#6366F1]',
          badge: 'bg-indigo-50 text-[#6366F1] border-indigo-200',
          icon: '✨',
          label: 'Feature',
        };
      case 'Chore':
        return {
          stripe: 'border-l-[3.5px] border-l-[#64748B]',
          badge: 'bg-slate-100 text-[#64748B] border-slate-200',
          icon: '📝',
          label: 'Chore',
        };
    }
  };

  return (
    <div id="task-board-view-root" className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="task-board-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight">
            Task Board
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B] mt-1 flex items-center gap-2">
            <span>Sprint 23 — Nov 15–29, 2025</span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold text-[11px] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Sprint
            </span>
          </p>
        </div>

        {/* Right Controls: Sprint dropdown + Product filter + + New Task */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-slate-800 focus:outline-none w-36 sm:w-44 shadow-2xs"
            />
          </div>

          {/* Sprint Dropdown */}
          <div className="relative">
            <select
              id="sprint-filter-select"
              value={selectedSprint}
              onChange={(e) => setSelectedSprint(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#6366F1] cursor-pointer shadow-2xs"
            >
              <option value="Sprint 23">Sprint 23 (Nov 15–29)</option>
              <option value="Sprint 22">Sprint 22 (Completed)</option>
              <option value="Sprint 21">Sprint 21 (Completed)</option>
              <option value="Backlog">Future Sprints</option>
            </select>
          </div>

          {/* Product Filter */}
          <div className="relative">
            <select
              id="product-filter-select"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#6366F1] cursor-pointer shadow-2xs"
            >
              <option value="All Products">All Products (6)</option>
              <option value="Salguri">Salguri</option>
              <option value="GaarX">GaarX</option>
              <option value="MuuqWear">MuuqWear</option>
              <option value="SomPay">SomPay</option>
              <option value="Ilays">Ilays</option>
              <option value="Dhaxal">Dhaxal</option>
            </select>
          </div>

          {/* + New Task (Primary filled #6366F1) */}
          <button
            id="btn-create-task-page"
            onClick={() => setIsCreateTaskOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ New Task</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KANBAN BOARD OR LIST VIEW                                                 */}
      {/* ========================================================================= */}
      {viewMode === 'board' ? (
        <div
          id="kanban-board-container"
          className="grid grid-cols-1 md:grid-cols-5 gap-4.5 items-start overflow-x-auto pb-4 scroll-smooth min-h-[620px]"
        >
          {COLUMNS.map((col) => {
            const columnTasks = getTasksForColumn(col.id);
            const totalPoints = columnTasks.reduce((sum, t) => sum + (t.points || 0), 0);
            const isDragOver = dragOverColumnId === col.id;

            return (
              <div
                key={col.id}
                id={`kanban-column-${col.id}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex flex-col bg-slate-50/75 rounded-2xl border transition-all duration-150 min-w-[240px] flex-1 p-3 space-y-3 ${
                  isDragOver
                    ? 'border-[#6366F1] bg-indigo-50/40 ring-2 ring-[#6366F1]/20'
                    : 'border-[#E2E8F0]'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1.5 pt-1 pb-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {col.label}
                    </h3>
                    <span
                      id={`column-count-${col.id}`}
                      className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs"
                    >
                      {columnTasks.length}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400">
                    {totalPoints} pts
                  </span>
                </div>

                {/* Task Cards Stack */}
                <div className="flex-1 space-y-2.5 min-h-[460px]">
                  {columnTasks.length === 0 ? (
                    /* Empty column state */
                    <div
                      id={`empty-column-${col.id}`}
                      className="h-44 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2 bg-white/40"
                    >
                      <Layers className="w-5 h-5 text-slate-300 stroke-[1.5]" />
                      <div className="text-xs font-medium text-slate-500">No tasks</div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Drag cards here or click + to add
                      </p>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const typeStyles = getTypeStyles(task.type);
                      const isDragging = draggingTaskId === task.id;

                      return (
                        <div
                          key={task.id}
                          id={`task-card-${task.key.toLowerCase()}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => setSelectedTask(task)}
                          className={`bg-white rounded-xl p-3.5 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing group space-y-2.5 relative ${
                            typeStyles.stripe
                          } ${isDragging ? 'opacity-40 border-dashed border-[#6366F1]' : ''}`}
                        >
                          {/* Card Header: Task Key + Type Badge + Points */}
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-slate-800 group-hover:text-[#6366F1] transition-colors">
                                {task.key}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${typeStyles.badge}`}
                              >
                                <span>{typeStyles.icon}</span>
                                <span>{typeStyles.label}</span>
                              </span>
                            </div>

                            {/* Estimate Badge */}
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              {task.points} pts
                            </span>
                          </div>

                          {/* Task Title */}
                          <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-indigo-950 transition-colors line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Card Footer: Product Tag, GitHub PR indicator & Assignee */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-xs">
                            {/* Product & PR */}
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-[10px] font-medium text-slate-500 truncate max-w-[70px]">
                                {task.product}
                              </span>

                              {/* GitHub PR indicator */}
                              {task.pr && (
                                <div
                                  className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                                    task.pr.status === 'merged'
                                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}
                                  title={task.pr.status === 'merged' ? 'PR Merged' : 'PR Linked'}
                                >
                                  {task.pr.status === 'merged' ? (
                                    <>
                                      <GitMerge className="w-2.5 h-2.5" />
                                      <span>✅</span>
                                    </>
                                  ) : (
                                    <>
                                      <GitPullRequest className="w-2.5 h-2.5" />
                                      <span>🔗 PR</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Assignee Avatar / Unassigned */}
                            <div className="shrink-0">
                              {task.assignee ? (
                                <div
                                  className="w-6 h-6 rounded-full overflow-hidden bg-[#6366F1] text-white flex items-center justify-center font-bold text-[10px] border border-white shadow-2xs"
                                  title={task.assignee.name}
                                >
                                  {task.assignee.avatar ? (
                                    <img
                                      src={task.assignee.avatar}
                                      alt={task.assignee.name}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    task.assignee.initials
                                  )}
                                </div>
                              ) : (
                                <div
                                  className="w-6 h-6 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[10px]"
                                  title="Unassigned"
                                >
                                  <User className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Quick Add at column bottom */}
                <button
                  onClick={() => {
                    setNewTaskColumn(col.id);
                    setIsCreateTaskOpen(true);
                  }}
                  className="w-full py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-[#6366F1] hover:bg-white text-slate-500 hover:text-[#6366F1] text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add card</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* LIST VIEW FALLBACK                                                        */
        /* ========================================================================= */
        <div
          id="task-list-container"
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Key</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status / Column</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Estimate</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">GitHub PR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      No tasks found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const typeStyles = getTypeStyles(task.type);
                    const colName =
                      COLUMNS.find((c) => c.id === task.columnId)?.label || task.columnId;

                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#6366F1] whitespace-nowrap">
                          {task.key}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${typeStyles.badge}`}
                          >
                            <span>{typeStyles.icon}</span>
                            <span>{typeStyles.label}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {task.title}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {colName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-slate-600 font-medium">{task.product}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                            {task.points} pts
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-[9px]">
                                {task.assignee.initials}
                              </div>
                              <span>{task.assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {task.pr ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                                task.pr.status === 'merged'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {task.pr.status === 'merged' ? '✅ Merged' : '🔗 Linked'}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TASK DETAIL & INSPECTOR                                            */}
      {/* ========================================================================= */}
      {selectedTask && (
        <div
          id="task-detail-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedTask(null)}
        >
          <div
            id="task-detail-modal-container"
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#6366F1]">
                    {selectedTask.key}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${
                      getTypeStyles(selectedTask.type).badge
                    }`}
                  >
                    <span>{getTypeStyles(selectedTask.type).icon}</span>
                    <span>{getTypeStyles(selectedTask.type).label}</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                    {selectedTask.product}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{selectedTask.title}</h3>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Column Status</div>
                <div className="mt-1 font-bold text-slate-800">
                  {COLUMNS.find((c) => c.id === selectedTask.columnId)?.label}
                </div>
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Estimate</div>
                <div className="mt-1 font-bold text-slate-800">{selectedTask.points} Story Points</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Assignee</div>
                <div className="mt-1 font-bold text-slate-800">
                  {selectedTask.assignee?.name || 'Unassigned'}
                </div>
              </div>
              <div>
                <div className="text-slate-400 font-medium text-[11px]">Sprint</div>
                <div className="mt-1 font-medium text-slate-700">Sprint 23</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                Description & Acceptance Criteria
              </h4>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {selectedTask.description || 'No detailed specifications added.'}
              </p>
            </div>

            {/* GitHub Pull Request info if any */}
            {selectedTask.pr && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <GitPullRequest className="w-3.5 h-3.5 text-[#6366F1]" />
                    Linked Pull Request
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      selectedTask.pr.status === 'merged'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedTask.pr.status === 'merged' ? '✅ Merged' : '● Open for Review'}
                  </span>
                </div>
                <div className="text-slate-600 font-mono text-[11px]">{selectedTask.pr.number}</div>
              </div>
            )}

            {/* Move Task Across Columns */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                Change Column Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {COLUMNS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setTasks((prev) =>
                        prev.map((t) => (t.id === selectedTask.id ? { ...t, columnId: col.id } : t))
                      );
                      setSelectedTask({ ...selectedTask, columnId: col.id });
                      showToast(`Moved ${selectedTask.key} to ${col.label}`);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedTask.columnId === col.id
                        ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW TASK                                                    */}
      {/* ========================================================================= */}
      {isCreateTaskOpen && (
        <div
          id="create-task-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsCreateTaskOpen(false)}
        >
          <div
            id="create-task-modal-container"
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#6366F1]" />
                <h3 className="text-base font-bold text-slate-900">Create Engineering Task</h3>
              </div>
              <button
                onClick={() => setIsCreateTaskOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement webhook retry backoff handler"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15 text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              {/* Type, Product & Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="Feature">✨ Feature</option>
                    <option value="Bug">🐛 Bug</option>
                    <option value="Chore">📝 Chore</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Product</label>
                  <select
                    value={newTaskProduct}
                    onChange={(e) => setNewTaskProduct(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="Salguri">Salguri</option>
                    <option value="GaarX">GaarX</option>
                    <option value="MuuqWear">MuuqWear</option>
                    <option value="SomPay">SomPay</option>
                    <option value="Ilays">Ilays</option>
                    <option value="Dhaxal">Dhaxal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Estimate (pts)</label>
                  <select
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value={1}>1 pt</option>
                    <option value={2}>2 pts</option>
                    <option value={3}>3 pts</option>
                    <option value={5}>5 pts</option>
                    <option value={8}>8 pts</option>
                    <option value={13}>13 pts</option>
                  </select>
                </div>
              </div>

              {/* Column & Assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Initial Column</label>
                  <select
                    value={newTaskColumn}
                    onChange={(e) => setNewTaskColumn(e.target.value as ColumnId)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  >
                    {COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="Adeel D.">Adeel D. (Lead)</option>
                    <option value="Leila H.">Leila H. (Core Engineer)</option>
                    <option value="Sarah K.">Sarah K. (Platform)</option>
                    <option value="Mike C.">Mike C. (Frontend)</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide technical specifications or steps..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15 text-xs font-medium text-slate-800 outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-xl shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
