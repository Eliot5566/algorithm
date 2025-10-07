'use client';

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_COOKIE_NAME } from '../../lib/constants';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/login', values, {
        withCredentials: true,
      });

      message.success('Login successful');
      // TODO: The API should set the HTTP-only cookie.
      // We optimistically redirect to the inbox once the request succeeds.
      router.push('/inbox');
    } catch (error) {
      console.error('Login failed', error);
      message.error('Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      <Card style={{ width: 360 }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Unified Inbox
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center' }}>
          Sign in to continue managing customer conversations.
        </Typography.Paragraph>
        <Form<LoginForm> layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input prefix={<MailOutlined />} type="email" autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
          JWT will be stored in an HTTP-only cookie named <code>{AUTH_COOKIE_NAME}</code> once the
          authentication API is implemented.
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
