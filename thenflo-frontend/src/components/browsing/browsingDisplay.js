import { TASK_STATUS, TASK_STATUS_LABEL } from '../../services/browsingService.js';

export function statusTone(status) {
  if (status === TASK_STATUS.COMPLETED) return 'success';
  if (status === TASK_STATUS.FAILED) return 'error';
  if (status === TASK_STATUS.STOPPED || status === TASK_STATUS.READY) return 'neutral';
  return 'active';
}

export function statusLabel(status) {
  return TASK_STATUS_LABEL[status] || status;
}

export function relativeDay(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const dayMs = 86_400_000;
  const diff = Math.floor((new Date(now.toDateString()) - new Date(date.toDateString())) / dayMs);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
