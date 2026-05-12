/**
 * Dashboard Card Components
 * 
 * Standardized card components for Juke's Dashboard.
 * Enforces consistent padding, spacing, and visual hierarchy.
 * 
 * @example
 * import { DashboardCard, DashboardCardList, DashboardCardListItem } from '@/components/dashboard-card';
 * 
 * <DashboardCard title="Section Title" icon={<Icon />}>
 *   <DashboardCardList>
 *     <DashboardCardListItem>Content</DashboardCardListItem>
 *   </DashboardCardList>
 * </DashboardCard>
 */

export {
  DashboardCard,
  DashboardCardList,
  DashboardCardListItem,
  DashboardNestedCard,
} from './dashboard-card';

export type {
  DashboardCardProps,
  DashboardCardListProps,
  DashboardCardListItemProps,
  DashboardNestedCardProps,
} from './dashboard-card';
