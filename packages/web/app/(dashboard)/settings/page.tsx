'use client';

import { Card, List, Skeleton, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { TenantSettings } from '@/types';

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery<TenantSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await apiClient.get('/api/settings');
      return response.data;
    }
  });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Tenant">
        {isLoading || !settings ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <div>
            <Typography.Title level={4} style={{ marginTop: 0 }}>
              {settings.tenantName}
            </Typography.Title>
            <Typography.Paragraph type="secondary">
              Placeholder tenant configuration. Integrate with backend settings to manage more options.
            </Typography.Paragraph>
          </div>
        )}
      </Card>
      <Card title="Channels">
        {isLoading || !settings ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <List
            dataSource={settings.channels}
            renderItem={(channel) => (
              <List.Item>
                <List.Item.Meta
                  title={channel.type}
                  description={channel.connected ? 'Connected' : 'Not connected'}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
