'use client';

import { Layout, Menu, Typography } from 'antd';
import {
  CommentOutlined,
  FileTextOutlined,
  FormOutlined,
  OrderedListOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

const { Sider, Content, Header } = Layout;

const MENU_ITEMS = [
  { key: '/inbox', label: 'Inbox', icon: <CommentOutlined /> },
  { key: '/faqs', label: 'FAQs', icon: <FileTextOutlined /> },
  { key: '/forms', label: 'Forms', icon: <FormOutlined /> },
  { key: '/orders', label: 'Orders', icon: <OrderedListOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const selectedKeys = useMemo(() => {
    const found = MENU_ITEMS.find((item) => pathname?.startsWith(item.key));
    return found ? [found.key] : ['/inbox'];
  }, [pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="light">
        <div style={{ padding: '16px', fontWeight: 600, fontSize: 18 }}>Support Desk</div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={(info) => router.push(info.key)}
          items={MENU_ITEMS.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {MENU_ITEMS.find((item) => selectedKeys.includes(item.key))?.label ?? 'Inbox'}
          </Typography.Title>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24, minHeight: 360 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
