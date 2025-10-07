export interface TenantDailyDigest {
  tenantId: string;
  tenantName?: string;
  newOrders: number;
  pendingConversations: number;
}

export interface DailyDigestSummary {
  date: string;
  tenants: TenantDailyDigest[];
}

/**
 * Collect the daily digest metrics. The actual implementation should be replaced
 * with real data fetching from the production data sources. The current version
 * returns an empty list so the rest of the system can be wired and tested.
 */
export async function collectDailyDigest(date: Date): Promise<TenantDailyDigest[]> {
  // Placeholder implementation. Replace with database/service calls in the future.
  return [];
}

export function formatDailyDigestMessage(date: Date, tenants: TenantDailyDigest[]): string {
  const formattedDate = date.toISOString().split('T')[0];
  if (!tenants.length) {
    return `\uD83D\uDCC5 ${formattedDate} Daily Digest\n目前沒有新的訂單或未回覆的對話。`;
  }

  const lines = tenants.map((tenant) => {
    const name = tenant.tenantName ? `${tenant.tenantName} (${tenant.tenantId})` : tenant.tenantId;
    return `• ${name}: 新訂單 ${tenant.newOrders} 筆 / 未回覆對話 ${tenant.pendingConversations} 則`;
  });

  return [`\uD83D\uDCC5 ${formattedDate} Daily Digest`, ...lines].join('\n');
}
