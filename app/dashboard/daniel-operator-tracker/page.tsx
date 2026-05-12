'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  Users,
  Scale,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Import the tracker data
import trackerData from '../../../data/daniel-operator-tracker.json';

export default function DanielOperatorTracker() {
  const [activeSection, setActiveSection] = useState('agreement-status');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'documented':
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'blocked':
        return <Lock className="h-5 w-5 text-red-600" />;
      case 'pending':
      case 'not-started':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'documented': { bg: 'bg-green-100', text: 'text-green-700', label: 'DOCUMENTED' },
      'active': { bg: 'bg-green-100', text: 'text-green-700', label: 'ACTIVE' },
      'blocked': { bg: 'bg-red-100', text: 'text-red-700', label: 'BLOCKED' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'PENDING' },
      'not-started': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'NOT STARTED' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status.toUpperCase() };

    return (
      <span className={cn(
        'text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest',
        config.bg,
        config.text
      )}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { bg: string; text: string }> = {
      'critical': { bg: 'bg-red-100', text: 'text-red-700' },
      'high': { bg: 'bg-orange-100', text: 'text-orange-700' },
      'medium': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'low': { bg: 'bg-gray-100', text: 'text-gray-600' },
    };

    const config = priorityConfig[priority] || { bg: 'bg-gray-100', text: 'text-gray-600' };

    return (
      <span className={cn(
        'text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest',
        config.bg,
        config.text
      )}>
        {priority}
      </span>
    );
  };

  const sections = trackerData.sections;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-diner-black mb-1">DANIEL OPERATOR TRACKER</h1>
          <p className="text-gray-500 font-sans">
            Agreement status, IP ownership, legal touchpoints, and document dependencies.
          </p>
          <p className="text-xs text-gray-400 font-mono mt-2">
            Last updated: {trackerData.updatedAt} • Next review: {trackerData.metadata.nextReviewDate}
          </p>
        </div>
      </div>

      {/* Risk Flags - Top Priority */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-6 border-b border-red-100 flex items-center gap-3 bg-red-100/50">
          <AlertTriangle className="h-6 w-6 text-red-700" />
          <h2 className="font-display text-lg text-red-900">RISK FLAGS</h2>
        </div>
        <div className="p-6 space-y-4">
          {trackerData.riskFlags.map((risk: any) => (
            <div key={risk.id} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Shield className={cn(
                    "h-5 w-5",
                    risk.severity === 'critical' ? 'text-red-600' : 'text-orange-600'
                  )} />
                  <h3 className="font-bold text-sm text-gray-900">{risk.title}</h3>
                </div>
                <span className={cn(
                  'text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest',
                  risk.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                )}>
                  {risk.severity}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{risk.description}</p>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2">
                <p className="text-xs font-semibold text-blue-900 mb-1">Mitigation:</p>
                <p className="text-xs text-blue-800">{risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {sections.map((section: any) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-display transition-all",
              activeSection === section.id
                ? "bg-diner-red text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {section.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Active Section Content */}
      {sections.map((section: any) => (
        activeSection === section.id && (
          <div key={section.id} className="space-y-6">
            {section.items.map((item: any) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Item Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-base text-gray-900">{item.title}</h3>
                          {item.priority && getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                        </div>
                        {item.owner && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Users className="h-3 w-3" />
                            Owner: <span className="font-semibold">{item.owner}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-600">{item.summary}</p>
                        {item.blockedReason && (
                          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <Lock className="h-4 w-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-red-900">BLOCKED:</p>
                              <p className="text-xs text-red-800">{item.blockedReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      {expandedItems[item.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedItems[item.id] && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-5">
                    {/* Next Action */}
                    {item.nextAction && (
                      <div className="bg-white rounded-xl p-4 border border-blue-100">
                        <p className="text-xs font-bold text-blue-900 mb-1 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          NEXT ACTION:
                        </p>
                        <p className="text-sm text-gray-700">{item.nextAction}</p>
                      </div>
                    )}

                    {/* Required Documents */}
                    {item.requiredDocuments && item.requiredDocuments.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          REQUIRED DOCUMENTS:
                        </p>
                        <ul className="space-y-1">
                          {item.requiredDocuments.map((doc: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-diner-red mt-1">•</span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Must Include (for document items) */}
                    {item.mustInclude && item.mustInclude.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          MUST INCLUDE:
                        </p>
                        <ul className="space-y-1">
                          {item.mustInclude.map((req: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-diner-red mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Open Questions */}
                    {item.openQuestions && item.openQuestions.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          OPEN QUESTIONS:
                        </p>
                        <ul className="space-y-1">
                          {item.openQuestions.map((q: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-yellow-600 mt-1">?</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tasks (for timeline items) */}
                    {item.tasks && item.tasks.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          TASKS:
                        </p>
                        <ul className="space-y-1">
                          {item.tasks.map((task: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-diner-red mt-1">□</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Estimated Duration/Cost */}
                    {(item.estimatedDuration || item.estimatedCost) && (
                      <div className="flex gap-4">
                        {item.estimatedDuration && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="text-[9px] font-bold text-gray-500 uppercase">Duration</p>
                              <p className="text-sm text-gray-900">{item.estimatedDuration}</p>
                            </div>
                          </div>
                        )}
                        {item.estimatedCost && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                            <Scale className="h-4 w-4 text-gray-600" />
                            <div>
                              <p className="text-[9px] font-bold text-gray-500 uppercase">Est. Cost</p>
                              <p className="text-sm text-gray-900">{item.estimatedCost}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-yellow-900 mb-1">NOTE:</p>
                        <p className="text-xs text-yellow-800">{item.notes}</p>
                      </div>
                    )}

                    {/* Last Updated */}
                    {item.lastUpdated && (
                      <p className="text-[10px] text-gray-400 font-mono">
                        Last updated: {item.lastUpdated}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  );
}
