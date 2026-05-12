'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  ExternalLink,
  Bot,
  Calendar,
  Loader2,
} from 'lucide-react';

export default function AgentOutputsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (typeFilter !== 'all') params.set('type', typeFilter);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (agentFilter !== 'all') params.set('producingAgent', agentFilter);
        
        const response = await fetch(`/api/agent-outputs?${params.toString()}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch agent outputs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [typeFilter, statusFilter, agentFilter]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-diner-red" />
      </div>
    );
  }

  const { outputs, metadata } = data;
  const allOutputsCount = metadata.total;

  // Format type label
  const formatTypeLabel = (type) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'rejected':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'archived':
        return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-500/10' };
      default:
        return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-500/10' };
    }
  };

  // Calculate stats from all outputs (need to refetch for accurate stats)
  const pendingCount = outputs.filter((o) => o.status === 'pending').length;
  const needsApprovalCount = outputs.filter((o) => o.approvalRequired && o.status === 'pending').length;
  const approvedCount = outputs.filter((o) => o.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display tracking-tight text-gray-900">
          Agent Outputs
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Review agent-generated drafts and handoffs. External-facing content requires approval before sending.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
            <FileText className="h-4 w-4" />
            <span>Total Outputs</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{allOutputsCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-yellow-600 text-sm mb-1">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
            <AlertCircle className="h-4 w-4" />
            <span>Needs Approval</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{needsApprovalCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diner-red focus:border-transparent"
            >
              <option value="all">All Types</option>
              {metadata.types.map((type) => (
                <option key={type} value={type}>
                  {formatTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diner-red focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {metadata.statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Agent filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producing Agent
            </label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-diner-red focus:border-transparent"
            >
              <option value="all">All Agents</option>
              {metadata.producingAgents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Outputs List */}
      <div className="space-y-4">
        {outputs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No outputs match your filters</p>
          </div>
        ) : (
          outputs.map((output) => {
            const statusDisplay = getStatusDisplay(output.status);
            const StatusIcon = statusDisplay.icon;

            return (
              <div
                key={output.id}
                className={`bg-white rounded-xl border-2 p-6 ${
                  output.approvalRequired && output.status === 'pending'
                    ? 'border-red-300 bg-red-50/30'
                    : 'border-gray-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {output.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {output.status.charAt(0).toUpperCase() + output.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Bot className="h-3.5 w-3.5" />
                        {output.producingAgent}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(output.createdAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                        {formatTypeLabel(output.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approval Warning */}
                {output.approvalRequired && output.status === 'pending' && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-red-900">
                      Needs John approval — not sent
                    </p>
                  </div>
                )}

                {/* Summary */}
                <p className="text-sm text-gray-700 mb-4">{output.summary}</p>

                {/* Body */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 overflow-x-auto max-w-full">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                    {output.body}
                  </pre>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  {output.sourceTaskId && (
                    <div>
                      <span className="font-medium text-gray-700">Source Task:</span>{' '}
                      <span className="text-gray-600">{output.sourceTaskId}</span>
                      {output.sourceTaskTitle && (
                        <span className="text-gray-500"> — {output.sourceTaskTitle}</span>
                      )}
                    </div>
                  )}
                  {output.recommendedNextAction && (
                    <div>
                      <span className="font-medium text-gray-700">Recommended Action:</span>{' '}
                      <span className="text-gray-600">{output.recommendedNextAction}</span>
                    </div>
                  )}
                </div>

                {/* Links */}
                {output.links && output.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {output.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-diner-teal/10 text-diner-teal hover:bg-diner-teal hover:text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
