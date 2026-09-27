// Automated Browsing has NO backend yet. Every function here is a mock
// simulation used only to visualize the intended UI/UX and to exercise the
// real component states (Starting -> Opening website -> ... -> Completed).
//
// This file is the ONLY place that knows tasks are simulated. UI components
// only ever call these exported functions and never touch timers, mock
// task state, or progression logic directly.
//
// When a real Automated Browsing backend exists (Frontend -> Gateway ->
// Browsing Service -> Browser Automation Engine, per the architecture
// brief), each function below is replaced with a real Gateway call —
// createTask() becomes a POST, subscribeToTask() becomes a WebSocket/SSE
// subscription or poll, etc. No UI component changes are required because
// they only depend on the shapes returned here.

export const TASK_STATUS = {
  READY: 'ready',
  STARTING: 'starting',
  OPENING: 'opening_website',
  NAVIGATING: 'navigating',
  READING: 'reading_page',
  INTERACTING: 'interacting',
  WAITING: 'waiting',
  COMPLETED: 'completed',
  FAILED: 'failed',
  STOPPED: 'stopped'
};

export const TASK_STATUS_LABEL = {
  [TASK_STATUS.READY]: 'Ready',
  [TASK_STATUS.STARTING]: 'Starting',
  [TASK_STATUS.OPENING]: 'Opening website',
  [TASK_STATUS.NAVIGATING]: 'Navigating',
  [TASK_STATUS.READING]: 'Reading page',
  [TASK_STATUS.INTERACTING]: 'Interacting',
  [TASK_STATUS.WAITING]: 'Waiting',
  [TASK_STATUS.COMPLETED]: 'Completed',
  [TASK_STATUS.FAILED]: 'Failed',
  [TASK_STATUS.STOPPED]: 'Stopped'
};

// The step rail shown while a task runs (subset of statuses that represent
// forward progress; terminal states are shown separately).
export const PROGRESS_SEQUENCE = [
  TASK_STATUS.STARTING,
  TASK_STATUS.OPENING,
  TASK_STATUS.NAVIGATING,
  TASK_STATUS.READING,
  TASK_STATUS.INTERACTING,
  TASK_STATUS.COMPLETED
];

function extractSiteGuess(instruction) {
  const urlMatch = instruction.match(/([a-z0-9-]+\.[a-z]{2,})/i);
  if (urlMatch) return urlMatch[1];
  return 'the target website';
}

function id() {
  return 'task_' + Math.random().toString(36).slice(2, 10);
}

let tasks = [
  {
    id: 'task_seed_1',
    instruction: 'Find the pricing information on example.com',
    site: 'example.com',
    status: TASK_STATUS.COMPLETED,
    createdAt: '2026-09-27T07:40:00Z',
    completedAt: '2026-09-27T07:41:20Z',
    activity: [
      { label: 'Opened website', done: true },
      { label: 'Navigated to pricing', done: true },
      { label: 'Read available plans', done: true },
      { label: 'Extracted pricing information', done: true }
    ],
    result: '3 plans found: Starter ($19/mo), Growth ($49/mo), Scale (custom).',
    error: null
  },
  {
    id: 'task_seed_2',
    instruction: 'Download the monthly report from the dashboard',
    site: 'dashboard.internal',
    status: TASK_STATUS.COMPLETED,
    createdAt: '2026-09-26T13:00:00Z',
    completedAt: '2026-09-26T13:02:10Z',
    activity: [
      { label: 'Opened dashboard', done: true },
      { label: 'Located monthly report', done: true },
      { label: 'Downloaded file', done: true }
    ],
    result: 'monthly-report-aug.pdf downloaded.',
    error: null
  },
  {
    id: 'task_seed_3',
    instruction: 'Check my leave balance on the employee portal',
    site: 'portal.internal',
    status: TASK_STATUS.FAILED,
    createdAt: '2026-09-26T09:15:00Z',
    completedAt: '2026-09-26T09:15:40Z',
    activity: [
      { label: 'Opened employee portal', done: true },
      { label: 'Attempted login', done: true }
    ],
    result: null,
    error: 'Login required multi-factor approval that could not be completed automatically.'
  }
];

const subscribers = new Map(); // taskId -> Set<callback>
const timers = new Map(); // taskId -> timeout handle

function notify(task) {
  const subs = subscribers.get(task.id);
  if (subs) subs.forEach((cb) => cb({ ...task }));
}

export async function listTasks() {
  return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) throw new Error('Task not found');
  return { ...task };
}

/** Creates a task and begins the mock simulated run. Returns the initial task record. */
export async function createTask(instruction) {
  const task = {
    id: id(),
    instruction,
    site: extractSiteGuess(instruction),
    status: TASK_STATUS.STARTING,
    createdAt: new Date().toISOString(),
    completedAt: null,
    activity: [],
    result: null,
    error: null
  };
  tasks = [task, ...tasks];
  runSimulation(task.id);
  return { ...task };
}

/** Subscribe to live updates for a task. Returns an unsubscribe function. */
export function subscribeToTask(taskId, onUpdate) {
  if (!subscribers.has(taskId)) subscribers.set(taskId, new Set());
  subscribers.get(taskId).add(onUpdate);
  return () => {
    const subs = subscribers.get(taskId);
    if (subs) subs.delete(onUpdate);
  };
}

export async function stopTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  clearTimeout(timers.get(taskId));
  task.status = TASK_STATUS.STOPPED;
  task.completedAt = new Date().toISOString();
  notify(task);
  return { ...task };
}

const STEP_ACTIVITY = {
  [TASK_STATUS.OPENING]: 'Opened website',
  [TASK_STATUS.NAVIGATING]: 'Navigated to relevant page',
  [TASK_STATUS.READING]: 'Read page content',
  [TASK_STATUS.INTERACTING]: 'Performed task actions'
};

function runSimulation(taskId) {
  const sequence = [TASK_STATUS.OPENING, TASK_STATUS.NAVIGATING, TASK_STATUS.READING, TASK_STATUS.INTERACTING];
  let i = 0;

  const step = () => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === TASK_STATUS.STOPPED) return;

    if (i < sequence.length) {
      const status = sequence[i];
      task.status = status;
      task.activity = [...task.activity, { label: STEP_ACTIVITY[status], done: true }];
      notify(task);
      i += 1;
      timers.set(taskId, setTimeout(step, 1100 + Math.random() * 700));
    } else {
      // 85% simulated success rate to exercise the failed state too
      const succeeds = Math.random() < 0.85;
      task.status = succeeds ? TASK_STATUS.COMPLETED : TASK_STATUS.FAILED;
      task.completedAt = new Date().toISOString();
      if (succeeds) {
        task.activity = [...task.activity, { label: 'Extracted result', done: true }];
        task.result = `Task completed on ${task.site}. (Mock result — connect the Browsing backend for real output.)`;
      } else {
        task.error = `Could not complete the task on ${task.site}. (Mock failure — connect the Browsing backend for real error detail.)`;
      }
      notify(task);
    }
  };

  timers.set(taskId, setTimeout(step, 900));
}
