'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  Kanban,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function AgentRosterPage() {
  const [roster, setRoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAgents, setExpandedAgents] = useState(new Set());

  useEffect(() => {
    loadRoster();
  }, []);

  const loadRoster = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/data/agent-roster.json');
      if (!res.ok) throw new Error('Failed to load roster');
      const data = await res.json();
      setRoster(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = (profile) => {
    const newExpanded = new Set(expandedAgents);
    if (newExpanded.has(profile)) {
      newExpanded.delete(profile);
    } else {
      newExpanded.add(profile);
    }
    setExpandedAgents(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Zap className="h-3 w-3" />;
      case 'ready': return <Clock className="h-3 w-3" />;
      case 'blocked': return <AlertCircle className="h-3 w-3" />;
      default: return <CheckCircle2 className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-diner-red mx-auto mb-4" />
          <p className="text-gray-600">Loading agent roster...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Failed to load roster</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRoster}
            className="px-4 py-2 bg-diner-red text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-diner-black mb-2">
            Agent Roster
          </h1>
          <p className="text-gray-600">
            Autonomous agents working on Juke's operating system
          </p>
        </div>
        <button
          onClick={loadRoster}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-diner-teal/10 rounded-lg">
              <Bot className="h-6 w-6 text-diner-teal" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-diner-black">{roster?.profile_count || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Kanban className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-diner-black">{roster?.total_active_tasks || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Busy Agents</p>
              <p className="text-2xl font-bold text-diner-black">
                {roster?.agents?.filter(a => a.task_count > 0).length || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Unassigned Tasks */}
      {roster?.unassigned_tasks && roster.unassigned_tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Unassigned Tasks ({roster.unassigned_tasks.length})
              </h3>
              <div className="space-y-2">
                {roster.unassigned_tasks.map(task => (
                  <div key={task.id} className="text-sm text-yellow-800">
                    <span className="font-mono text-xs text-yellow-600">{task.id}</span> — {task.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Agent List */}
      <div className="space-y-4">
        {roster?.agents?.map((agent, idx) => (
          <motion.div
            key={agent.profile}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Agent Header */}
            <button
              onClick={() => toggleAgent(agent.profile)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "p-3 rounded-lg",
                  agent.task_count > 0 ? "bg-blue-500/10" : "bg-gray-100"
                )}>
                  <Bot className={cn(
                    "h-6 w-6",
                    agent.task_count > 0 ? "text-blue-500" : "text-gray-400"
                  )} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-lg text-diner-black font-mono">
                    {agent.profile}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{agent.mission}</p>
                </div>
                {agent.task_count > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    <Kanban className="h-4 w-4" />
                    {agent.task_count} {agent.task_count === 1 ? 'task' : 'tasks'}
                  </div>
                )}
              </div>
              {expandedAgents.has(agent.profile) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* Agent Details */}
            {expandedAgents.has(agent.profile) && (
              <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                {/* Mission */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Mission
                  </h4>
                  <p className="text-gray-700">{agent.mission}</p>
                </div>

                {/* Working Rules */}
                {agent.working_rules && agent.working_rules.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Working Rules
                    </h4>
                    <ul className="space-y-1">
                      {agent.working_rules.map((rule, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          {rule.replace(/^-\s*/, '• ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Guardrails */}
                {agent.guardrails && agent.guardrails.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                      Guardrails
                    </h4>
                    <ul className="space-y-1">
                      {agent.guardrails.map((guard, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          {guard.replace(/^-\s*/, '• ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Active Tasks */}
                {agent.active_tasks && agent.active_tasks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                      Active Tasks
                    </h4>
                    <div className="space-y-2">
                      {agent.active_tasks.map(task => (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-1.5 rounded-full text-white mt-0.5",
                              getStatusColor(task.status)
                            )}>
                              {getStatusIcon(task.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-gray-500">{task.id}</span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                                  task.status === 'running' && "bg-blue-100 text-blue-700",
                                  task.status === 'ready' && "bg-green-100 text-green-700",
                                  task.status === 'blocked' && "bg-red-100 text-red-700"
                                )}>
                                  {task.status}
                                </span>
                                {task.priority && task.priority > 0 && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                    P{task.priority}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{task.title}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 pt-4">
        Last updated: {roster?.generated_at ? new Date(roster.generated_at).toLocaleString() : '--'}
      </div>
    </div>
  );
}
