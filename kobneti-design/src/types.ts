export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  badge?: string | number;
  badgeType?: 'primary' | 'tertiary' | 'neutral' | 'danger';
  subItems?: {
    id: string;
    label: string;
    badge?: string | number;
    badgeType?: 'primary' | 'tertiary' | 'neutral' | 'danger';
  }[];
}

export interface MetricItem {
  id: string;
  title: string;
  value: string | number;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral' | 'warning';
  trendType?: 'primary' | 'neutral' | 'tertiary' | 'danger';
  subtext: string;
  icon: string;
  alert?: boolean;
}

export interface ProductTicket {
  name: string;
  tickets: number;
  maxTickets: number;
  color?: string;
  openCount: number;
  slaStatus: 'Healthy' | 'At Risk' | 'Breached';
}

export interface AccessItem {
  icon: string;
  title: string;
  permission: string;
  tagColor: string;
  bgColor: string;
}

export interface PerformanceRow {
  metric: string;
  current: string;
  previous: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  status: 'Healthy' | 'Warning' | 'Operational';
}

export interface ActivityItem {
  id: string;
  actor: string;
  actorType: 'user' | 'system';
  action: string;
  target: string;
  productTag?: string;
  timeAgo: string;
  avatarBg?: string;
}

export interface QuickActionItem {
  id: string;
  icon: string;
  text: string;
  actionText: string;
  type: 'review' | 'approval' | 'sync' | 'product';
  badge?: string;
}
