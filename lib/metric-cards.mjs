// Metric Cards configuration for Command Center
// Unified design system for operator dashboard metric cards

export const METRIC_CARD_RESPONSIVE_CONFIG = {
  gridCols: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
  minHeight: {
    mobile: '80px',
    tablet: '100px',
    desktop: '120px',
  },
  gap: {
    mobile: '12px',
    tablet: '16px',
    desktop: '16px',
  },
};

export const METRIC_CARD_CONFIG = [
  {
    id: 'urgent-tasks',
    label: 'Urgent Tasks',
    color: 'red',
    icon: 'AlertTriangle',
    showTrend: true,
    trendLabel: 'vs yesterday',
    styles: {
      padding: '20px',
      borderRadius: '12px',
      shadow: 'sm',
    },
    hoverEffect: 'shadow-increase',
    linkTo: '/dashboard/command-center#priorities',
  },
  {
    id: 'today-bookings',
    label: 'Today Bookings',
    color: 'teal',
    icon: 'Calendar',
    showTrend: true,
    trendLabel: 'vs yesterday',
    styles: {
      padding: '20px',
      borderRadius: '12px',
      shadow: 'sm',
    },
    hoverEffect: 'shadow-increase',
    linkTo: '/dashboard/bookings',
  },
  {
    id: 'open-issues',
    label: 'Open Issues',
    color: 'orange',
    icon: 'AlertCircle',
    showTrend: true,
    trendLabel: 'vs last week',
    styles: {
      padding: '20px',
      borderRadius: '12px',
      shadow: 'sm',
    },
    hoverEffect: 'shadow-increase',
    linkTo: '/dashboard/command-center#issues',
  },
  {
    id: 'media-approvals',
    label: 'Media Approvals',
    color: 'purple',
    icon: 'Image',
    showTrend: true,
    trendLabel: 'pending review',
    styles: {
      padding: '20px',
      borderRadius: '12px',
      shadow: 'sm',
    },
    hoverEffect: 'shadow-increase',
    linkTo: '/dashboard/command-center#media',
  },
];
