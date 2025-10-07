'use client';

import { Card, Typography } from 'antd';
import { PropsWithChildren } from 'react';

interface DashboardPageProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export function DashboardPage({ title, description, children }: DashboardPageProps) {
  return (
    <Card bordered style={{ background: '#fff' }}>
      <Typography.Title level={3}>{title}</Typography.Title>
      {description && <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>}
      <div>{children}</div>
    </Card>
  );
}
