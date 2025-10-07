'use client';

import { Layout, Menu, Typography, type MenuProps } from 'antd';
import {
  MailOutlined,
  QuestionCircleOutlined,
  FormOutlined,
  OrderedListOutlined,
  SettingOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useMemo } from 'react';
import { Session } from '../lib/auth';

const { Header, Content, Sider } = Layout;

interface AppShellProps extends PropsWithChildren {
  session: Session | null;
}

export function AppShell({ session, children }: AppShellProps) {
  const pathname = usePathname() || '/';

  const menuItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: '/inbox',
        icon: <MailOutlined />,
        label: <Link href="/inbox">Inbox</Link>,
      },
      {
        key: '/faqs',
        icon: <QuestionCircleOutlined />,
        label: <Link href="/faqs">FAQs</Link>,
      },
      {
        key: '/forms',
        icon: <FormOutlined />,
        label: <Link href="/forms">Forms</Link>,
      },
      {
        key: '/orders',
        icon: <OrderedListOutlined />,
        label: <Link href="/orders">Orders</Link>,
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: <Link href="/settings">Settings</Link>,
      },
    ],
    [],
  );

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const title = pathname === '/' ? 'Dashboard' : pathname.replace('/', '').toUpperCase();

  return (
    <Layout hasSider>
      <Sider breakpoint="lg" collapsedWidth="0" width={240} style={{ background: '#fff' }}>
        <div style={{ padding: '16px', fontWeight: 600 }}>Unified Inbox</div>
        <Menu selectedKeys={[pathname]} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: 24,
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Text type={session ? 'success' : 'secondary'}>
            {session ? (
              'Signed in'
            ) : (
              <Link href="/login">
                <LoginOutlined /> Sign in
              </Link>
            )}
          </Typography.Text>
        </Header>
        <Content style={{ margin: 0, padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
