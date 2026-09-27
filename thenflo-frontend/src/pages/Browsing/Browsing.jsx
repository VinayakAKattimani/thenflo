import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import TaskComposer from '../../components/browsing/TaskComposer.jsx';
import TaskWorkspace from '../../components/browsing/TaskWorkspace.jsx';
import TaskHistoryList from '../../components/browsing/TaskHistoryList.jsx';
import * as browsingService from '../../services/browsingService.js';
import './Browsing.css';

export default function Browsing() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const refreshHistory = useCallback(async () => {
    const list = await browsingService.listTasks();
    setTasks(list);
    return list;
  }, []);

  useEffect(() => {
    refreshHistory().finally(() => setLoadingHistory(false));
  }, [refreshHistory]);

  // Subscribe to live updates for whichever task is active.
  useEffect(() => {
    if (!activeTask) return undefined;
    const unsubscribe = browsingService.subscribeToTask(activeTask.id, (updated) => {
      setActiveTask(updated);
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== updated.id);
        return [updated, ...next];
      });
    });
    return unsubscribe;
  }, [activeTask?.id]);

  const handleStartTask = async (instruction) => {
    const task = await browsingService.createTask(instruction);
    setActiveTask(task);
    setTasks((prev) => [task, ...prev]);
  };

  const handleSelectHistoryTask = async (taskId) => {
    const task = await browsingService.getTask(taskId);
    setActiveTask(task);
  };

  const handleStop = async () => {
    if (!activeTask) return;
    const stopped = await browsingService.stopTask(activeTask.id);
    setActiveTask(stopped);
  };

  return (
    <div className="browsing-page">
      <PageHeader title="Automated Browsing" subtitle="Let ThenFLo interact with the web for you." />

      <TaskComposer onSubmit={handleStartTask} />

      <div className="browsing-layout">
        <div className="browsing-main">
          {activeTask ? (
            <TaskWorkspace task={activeTask} onStop={handleStop} />
          ) : (
            <div className="browsing-idle-hint">
              Describe a task above, or pick up a previous one from Recent Tasks.
            </div>
          )}
        </div>

        <aside className="browsing-history">
          <h3 className="browsing-history-title">Recent Tasks</h3>
          {loadingHistory ? (
            <p className="browsing-history-loading">Loading…</p>
          ) : (
            <TaskHistoryList tasks={tasks} activeTaskId={activeTask?.id} onSelect={handleSelectHistoryTask} />
          )}
        </aside>
      </div>
    </div>
  );
}
