'use client';

import { SendOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Empty, Input, List, Segmented, Space, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Conversation, Faq, Message as ConversationMessage } from '@/types';

const { TextArea, Search } = Input;

export default function InboxPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: isLoadingConversations } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await apiClient.get('/api/conversations');
      return response.data;
    }
  });

  const { data: faqs } = useQuery<Faq[]>({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await apiClient.get('/api/faqs');
      return response.data;
    }
  });

  const { data: messagesData, isLoading: isLoadingMessages } = useQuery<ConversationMessage[]>(
    {
      queryKey: ['messages', selectedConversation],
      queryFn: async () => {
        const response = await apiClient.get(`/api/conversations/${selectedConversation}/messages`);
        return response.data;
      },
      enabled: Boolean(selectedConversation)
    }
  );

  useEffect(() => {
    if (!selectedConversation && conversations && conversations.length > 0) {
      setSelectedConversation(conversations[0].id);
    }
  }, [conversations, selectedConversation]);

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.customerName.toLowerCase().includes(normalizedSearch) ||
        conversation.lastMessage.toLowerCase().includes(normalizedSearch)
    );
  }, [conversations, searchTerm]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedConversation) return;
      const response = await apiClient.post(`/api/conversations/${selectedConversation}/messages`, {
        content: reply
      });
      return response.data;
    },
    onSuccess: () => {
      setReply('');
      message.success('Message sent');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      message.error('Failed to send message');
    }
  });

  const handleFaqInsert = (answer: string) => {
    setReply((current) => `${current}${current ? '\n' : ''}${answer}`);
  };

  return (
    <div style={{ display: 'flex', gap: 16, minHeight: 500 }}>
      <Card
        style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        <div style={{ padding: 16 }}>
          <Search
            placeholder="Search conversations"
            allowClear
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <List
            loading={isLoadingConversations}
            dataSource={filteredConversations}
            renderItem={(conversation) => (
              <List.Item
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                style={{
                  cursor: 'pointer',
                  background: conversation.id === selectedConversation ? '#f0f5ff' : 'transparent'
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar>{conversation.customerName.charAt(0)}</Avatar>}
                  title={conversation.customerName}
                  description={<Typography.Paragraph ellipsis={{ rows: 1 }}>{conversation.lastMessage}</Typography.Paragraph>}
                />
              </List.Item>
            )}
            locale={{ emptyText: <Empty description="No conversations" /> }}
          />
        </div>
      </Card>
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedConversation ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Empty description="Select a conversation" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
              <List
                loading={isLoadingMessages}
                dataSource={messagesData ?? []}
                renderItem={(messageItem) => (
                  <List.Item key={messageItem.id} style={{ border: 'none', padding: '12px 0' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Typography.Text type={messageItem.sender === 'agent' ? 'secondary' : undefined}>
                        {messageItem.sender === 'agent' ? 'You' : 'Customer'} -{' '}
                        {new Date(messageItem.timestamp).toLocaleString()}
                      </Typography.Text>
                      <Typography.Paragraph style={{ marginBottom: 0 }}>
                        {messageItem.content}
                      </Typography.Paragraph>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Segmented
                options={(faqs ?? []).map((faq) => ({ label: faq.question, value: faq.id }))}
                onChange={(value) => {
                  const faq = faqs?.find((item) => item.id === value);
                  if (faq) {
                    handleFaqInsert(faq.answer);
                    message.success(`Inserted FAQ: ${faq.question}`);
                  }
                }}
                block
              />
              <TextArea
                rows={4}
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Type your reply..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => mutation.mutate()}
                  disabled={!reply.trim()}
                  loading={mutation.isPending}
                >
                  Send Reply
                </Button>
              </div>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
}
