import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

export const WORKFLOW_LANE_IDS = ['backlog', 'ready', 'in_progress', 'blocked', 'done'];
export const WORKFLOW_AREA_IDS = ['financial', 'media', 'franchise-brain'];
export const WORKFLOW_PRIORITIES = ['low', 'normal', 'medium', 'high', 'urgent'];

const DEFAULT_WORKFLOW_FILE_PATH = path.join(process.cwd(), 'data', 'workflow-kanban.json');

const AREA_LINKS = {
  financial: {
    label: 'Financials',
    href: '/dashboard/financials',
    tone: 'Cash flow + unit economics',
  },
  media: {
    label: 'Media',
    href: '/dashboard/social',
    tone: 'Content capture + publishing',
  },
  'franchise-brain': {
    label: 'Franchise Brain',
    href: '/dashboard/franchise-brain',
    tone: 'Operating memory + SOPs',
  },
};

const DEFAULT_WORKFLOW_BOARD = {
  version: 1,
  title: "Juke's Build + Operator Workflow",
  updatedAt: '2026-05-08',
  lanes: [
    {
      id: 'backlog',
      title: 'Backlog',
      operatorPrompt: 'Useful work that should not distract operators until it is shaped.',
      tasks: [
        {
          id: 'stripe-payout-reconciliation',
          title: 'Stripe payout reconciliation view',
          owner: 'Finance Lead',
          priority: 'medium',
          areaId: 'financial',
          summary: 'Show deposits, fees, taxes, and payout timing by operating account before live money movement.',
        },
        {
          id: 'operator-photo-checklist',
          title: 'Operator photo checklist',
          owner: 'Marketing Lead',
          priority: 'medium',
          areaId: 'media',
          summary: 'Give shift leads the exact shots needed for weekly posts and franchise proof assets.',
        },
      ],
    },
    {
      id: 'ready',
      title: 'Ready',
      operatorPrompt: 'Clear owner and next action; safe to pick up now.',
      tasks: [
        {
          id: 'cashflow-exception-alerts',
          title: 'Cashflow exception alerts',
          owner: 'CFO / Owner',
          priority: 'urgent',
          areaId: 'financial',
          summary: 'Flag negative unit cashflow, high prime cost, and missing source docs from the financial dashboard.',
        },
        {
          id: 'brand-board-asset-picker',
          title: 'Brand board asset picker',
          owner: 'Flo Content Agent',
          priority: 'high',
          areaId: 'media',
          summary: 'Let operators pull approved photos, captions, and CTAs without searching raw folders.',
        },
        {
          id: 'brain-signal-routing-rules',
          title: 'Brain signal routing rules',
          owner: 'Ops Systems',
          priority: 'normal',
          areaId: 'franchise-brain',
          summary: 'Codify which Slack notes become content ideas, support escalations, SOP updates, or catering leads.',
        },
      ],
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      operatorPrompt: 'Actively being built or operated this week.',
      tasks: [
        {
          id: 'workflow-kanban-dashboard',
          title: 'In-dashboard Kanban workflow view',
          owner: 'Hermes',
          priority: 'high',
          areaId: 'franchise-brain',
          summary: 'Expose build and operator work across backlog, ready, in progress, blocked, and done lanes.',
        },
        {
          id: 'weekly-content-plan',
          title: 'Weekly content plan wiring',
          owner: 'Marketing Lead',
          priority: 'high',
          areaId: 'media',
          summary: 'Tie campaign cadence to Metricool-ready deliverables, capture requests, and approvals.',
        },
      ],
    },
    {
      id: 'blocked',
      title: 'Blocked',
      operatorPrompt: 'Needs a decision, credential, or outside dependency before more work is useful.',
      tasks: [
        {
          id: 'live-stripe-connect',
          title: 'Live Stripe Connect onboarding',
          owner: 'Founder',
          priority: 'urgent',
          areaId: 'financial',
          summary: 'Waiting on explicit approval and live credential scope before creating or moving real accounts.',
          blocker: 'Do not touch live money movement without owner approval.',
        },
        {
          id: 'field-sop-source-cleanup',
          title: 'Field SOP source cleanup',
          owner: 'Operations Lead',
          priority: 'medium',
          areaId: 'franchise-brain',
          summary: 'Needs final source-of-truth choice before duplicate SOP drafts are linked into the brain.',
          blocker: 'Choose canonical SOP home: local markdown, Google Drive, or Notion export.',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      operatorPrompt: 'Shipped work operators can already use or review.',
      tasks: [
        {
          id: 'franchise-financials-model',
          title: 'Franchise financial model foundation',
          owner: 'Hermes',
          priority: 'normal',
          areaId: 'financial',
          summary: 'Built the local financial model for visibility layers, account cashflow, and readiness checks.',
        },
      ],
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function decorateTask(task, lane) {
  const area = AREA_LINKS[task.areaId] ?? AREA_LINKS['franchise-brain'];
  return {
    ...task,
    laneId: lane.id,
    laneTitle: lane.title,
    status: lane.id,
    areaLabel: area.label,
    areaHref: area.href,
    areaTone: area.tone,
  };
}

export function createDefaultWorkflowBoard() {
  return clone(DEFAULT_WORKFLOW_BOARD);
}

export function getWorkflowLanes(board = createDefaultWorkflowBoard()) {
  return board.lanes.map((lane) => ({
    ...lane,
    tasks: lane.tasks.map((task) => decorateTask(task, lane)),
  }));
}

export function getWorkflowStats(board = createDefaultWorkflowBoard()) {
  const lanes = getWorkflowLanes(board);
  const tasks = lanes.flatMap((lane) => lane.tasks);

  return {
    lanes: lanes.length,
    tasks: tasks.length,
    activeTasks: tasks.filter((task) => !['blocked', 'done'].includes(task.status)).length,
    blockedTasks: tasks.filter((task) => task.status === 'blocked').length,
    doneTasks: tasks.filter((task) => task.status === 'done').length,
    highPriorityTasks: tasks.filter((task) => ['high', 'urgent'].includes(task.priority)).length,
  };
}

export function getWorkflowTasksByArea(board = createDefaultWorkflowBoard()) {
  const tasks = getWorkflowLanes(board).flatMap((lane) => lane.tasks);

  return WORKFLOW_AREA_IDS.reduce((grouped, areaId) => {
    grouped[areaId] = tasks.filter((task) => task.areaId === areaId);
    return grouped;
  }, {});
}

export async function readWorkflowBoard(filePath = DEFAULT_WORKFLOW_FILE_PATH) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return createDefaultWorkflowBoard();
    throw error;
  }
}

export async function writeWorkflowBoard(board, filePath = DEFAULT_WORKFLOW_FILE_PATH) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(board, null, 2)}\n`, 'utf8');
  return board;
}

export async function getWorkflowBoard() {
  return readWorkflowBoard();
}
