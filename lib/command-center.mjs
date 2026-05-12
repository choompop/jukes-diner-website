// Command Center data model for operator dashboard
// Provides sections, priorities, bookings, issues, approvals, financials, SOPs, and blockers

export const COMMAND_CENTER_SECTIONS = [
  {
    id: 'todays-priorities',
    label: "Today's Priorities",
    icon: 'CheckCircle',
    description: 'What to do next - urgent tasks sorted by deadline',
  },
  {
    id: 'bookings-leads',
    label: 'Bookings & Leads',
    icon: 'Calendar',
    description: 'Event pipeline with status and next action',
  },
  {
    id: 'ops-issues',
    label: 'Open Ops Issues',
    icon: 'AlertTriangle',
    description: 'Current blockers with severity and owner',
  },
  {
    id: 'media-approvals',
    label: 'Media Approvals',
    icon: 'Image',
    description: 'Pending content awaiting review',
  },
  {
    id: 'financial-pulse',
    label: 'Financial Pulse',
    icon: 'DollarSign',
    description: 'Read-only financial snapshot',
  },
  {
    id: 'sop-shortcuts',
    label: 'SOP Shortcuts',
    icon: 'BookOpen',
    description: 'Quick access to common procedures',
  },
  {
    id: 'blockers',
    label: 'Blockers Needing John',
    icon: 'AlertCircle',
    description: 'Escalation items requiring founder input',
  },
];

export function getTodaysPriorities() {
  return [
    {
      id: 'pri-001',
      title: 'Order Sysco inventory for weekend events',
      priority: 'urgent',
      dueBy: '2026-05-08T17:00:00Z',
      owner: 'Daniel',
      estimatedMinutes: 30,
    },
    {
      id: 'pri-002',
      title: 'Confirm Westside Park setup time with venue',
      priority: 'high',
      dueBy: '2026-05-08T18:00:00Z',
      owner: 'Justin',
      estimatedMinutes: 15,
    },
    {
      id: 'pri-003',
      title: 'Clean fryer filters before tomorrow shift',
      priority: 'high',
      dueBy: '2026-05-09T08:00:00Z',
      owner: 'Kitchen Lead',
      estimatedMinutes: 45,
    },
    {
      id: 'pri-004',
      title: 'Update staff schedule for next week',
      priority: 'medium',
      dueBy: '2026-05-09T17:00:00Z',
      owner: 'Daniel',
      estimatedMinutes: 60,
    },
  ];
}

export function getBookingsAndLeads() {
  return [
    {
      id: 'book-001',
      type: 'booking',
      name: 'Westside Park Lunch Service',
      status: 'confirmed',
      date: '2026-05-08T11:00:00Z',
      value: '$800',
      nextAction: 'Load truck at 9:30 AM',
      contactName: 'Sarah Johnson',
      contactPhone: '(615) 555-0123',
    },
    {
      id: 'lead-001',
      type: 'lead',
      name: 'Tech Plaza Dinner Inquiry',
      status: 'pending-quote',
      date: '2026-05-12T17:00:00Z',
      value: '$1,200 (est)',
      nextAction: 'Send menu + pricing by EOD',
      contactName: 'Mike Peterson',
      contactPhone: '(615) 555-0456',
    },
    {
      id: 'book-002',
      type: 'booking',
      name: 'Arts District Festival Weekend',
      status: 'deposit-paid',
      date: '2026-05-10T12:00:00Z',
      value: '$2,400',
      nextAction: 'Order extra inventory for high volume',
      contactName: 'Arts District Org',
      contactPhone: '(615) 555-0789',
    },
  ];
}

export function getOpenOpsIssues() {
  return [
    {
      id: 'issue-001',
      title: 'Propane tank regulator pressure fluctuating',
      severity: 'high',
      assignedTo: 'Daniel',
      status: 'investigating',
      createdAt: '2026-05-08T08:30:00Z',
      impact: 'May affect cooking times during lunch rush',
    },
    {
      id: 'issue-002',
      title: 'Point-of-sale tablet battery draining quickly',
      severity: 'medium',
      assignedTo: 'Justin',
      status: 'open',
      createdAt: '2026-05-07T14:00:00Z',
      impact: 'Need backup charger on hand',
    },
    {
      id: 'issue-003',
      title: 'Generator noise complaint from neighbor at usual parking spot',
      severity: 'medium',
      assignedTo: 'John',
      status: 'escalated',
      createdAt: '2026-05-06T19:00:00Z',
      impact: 'May need to find alternate regular location',
    },
    {
      id: 'issue-004',
      title: 'Refrigeration unit running warm - needs cleaning',
      severity: 'low',
      assignedTo: 'Kitchen Lead',
      status: 'scheduled',
      createdAt: '2026-05-05T10:00:00Z',
      impact: 'Scheduled for next maintenance day',
    },
  ];
}

export function getMediaApprovals() {
  return [
    {
      id: 'media-001',
      title: 'Peach Cobbler Milkshake Launch Video',
      type: 'video',
      submittedBy: 'Marketing Lead',
      submittedAt: '2026-05-08T10:00:00Z',
      previewUrl: '/media/previews/peach-cobbler-video.mp4',
      duration: '0:45',
      platforms: ['TikTok', 'Instagram Reels'],
    },
    {
      id: 'media-002',
      title: 'Behind-the-scenes shift prep photos',
      type: 'image',
      submittedBy: 'GM',
      submittedAt: '2026-05-08T08:15:00Z',
      previewUrl: '/media/previews/shift-prep-collage.jpg',
      count: 4,
      platforms: ['Instagram Stories'],
    },
    {
      id: 'media-003',
      title: 'Weekend festival promo graphic',
      type: 'image',
      submittedBy: 'Designer',
      submittedAt: '2026-05-07T16:30:00Z',
      previewUrl: '/media/previews/festival-promo.jpg',
      count: 1,
      platforms: ['Facebook', 'Instagram Feed'],
    },
  ];
}

export function getFinancialPulse() {
  return {
    todaySales: '$1,284.50',
    weekToDate: '$6,432.20',
    monthToDate: '$18,947.80',
    pendingPayouts: '$4,200.00',
    lowInventoryAlert: 'Milkshake cups below reorder threshold',
    lastUpdated: '2026-05-08T15:30:00Z',
  };
}

export function getSOPShortcuts() {
  return [
    {
      id: 'sop-001',
      title: 'Daily Opening Checklist',
      category: 'daily-ops',
      path: '/dashboard/resources#sop-daily-opening',
      estimatedTime: '30 min',
    },
    {
      id: 'sop-002',
      title: 'Event Setup Protocol',
      category: 'daily-ops',
      path: '/dashboard/resources#sop-event-setup',
      estimatedTime: '15 min read',
    },
    {
      id: 'sop-003',
      title: 'Equipment Emergency Contacts',
      category: 'emergency',
      path: '/dashboard/resources#sop-emergency-contacts',
      estimatedTime: '2 min',
    },
    {
      id: 'sop-004',
      title: 'Food Safety Incident Response',
      category: 'emergency',
      path: '/dashboard/resources#sop-food-safety-incident',
      estimatedTime: '10 min',
    },
    {
      id: 'sop-005',
      title: 'Inventory Ordering Guide',
      category: 'weekly-ops',
      path: '/dashboard/resources#sop-inventory-ordering',
      estimatedTime: '20 min',
    },
  ];
}

export function getBlockersNeedingJohn() {
  return [
    {
      id: 'blocker-001',
      title: 'Generator noise complaint - location decision needed',
      blockedSince: '2026-05-06T19:00:00Z',
      requestedBy: 'Daniel',
      context:
        'Neighbor at our usual Friday evening spot complained about generator noise. Need to decide: quieter generator upgrade, alternate location, or negotiate hours?',
      urgency: 'medium',
    },
    {
      id: 'blocker-002',
      title: 'Franchise inquiry from Atlanta investor',
      blockedSince: '2026-05-05T14:00:00Z',
      requestedBy: 'Sales Lead',
      context:
        'Serious investor wants franchise package and financials. Need founder approval before sharing detailed P&L and operations manual.',
      urgency: 'high',
    },
  ];
}

export function getOperatorDashboardStats() {
  const priorities = getTodaysPriorities();
  const bookings = getBookingsAndLeads();
  const issues = getOpenOpsIssues();
  const approvals = getMediaApprovals();
  const blockers = getBlockersNeedingJohn();

  return {
    urgentTasks: priorities.filter((p) => p.priority === 'urgent').length,
    todayBookings: bookings.filter(
      (b) => b.type === 'booking' && b.date.startsWith('2026-05-08')
    ).length,
    openIssues: issues.filter((i) => i.status !== 'resolved').length,
    pendingApprovals: approvals.length,
    blockersNeedingJohn: blockers.length,
  };
}
