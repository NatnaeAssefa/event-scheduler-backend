export interface AnalyticsQuery {
  listingId: string;
  range?: '7days' | '30days' | '90days' | 'custom';
  customStart?: string; // ISO date string (e.g., '2025-04-01')
  customEnd?: string; // ISO date string (e.g., '2025-04-21')
}

interface LeadAnalyticsResponse {
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  clickThroughRate: number; // Percentage (clicks / impressions * 100)
  recentLeads: Array<{
    id: string;
    email: string;
    name: string;
    phoneNumber?: string;
    description?: string;
    createdAt: Date;
  }>;
  leadsByMonth: Array<{
    month: string; // e.g., '2025-04'
    count: number;
  }>;
}

interface AuthOptions {
  options: any;
  paranoid?: boolean;
}

class QueryParser {
  static parseAnalyticsQuery(query: any): AnalyticsQuery {
    const parsed: AnalyticsQuery = {
      listingId: query.listingId,
      range: ['7days', '30days', '90days', 'custom'].includes(query.range) ? query.range : '30days',
    };

    if (parsed.range === 'custom') {
      parsed.customStart = query.customStart ? new Date(query.customStart).toISOString() : undefined;
      parsed.customEnd = query.customEnd ? new Date(query.customEnd).toISOString() : undefined;
    }

    return parsed;
  }

  static getDateRange(range: string, customStart?: string, customEnd?: string): { start: Date; end: Date } {
    let end = new Date();
    let start: Date;

    switch (range) {
      case '7days':
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        start = customStart ? new Date(customStart) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = customEnd ? new Date(customEnd) : new Date();
        break;
      case '30days':
      default:
        start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    return { start, end };
  }
}

export default QueryParser;