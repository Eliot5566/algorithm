'use client';

import { List, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Conversation, Message } from '@unified-inbox/shared';

const mockConversations: Array<Conversation & { lastMessage: Message | null }> = [
  {
    id: 'conv-1',
    tenantId: 'tenant-1',
    subject: 'Welcome flow feedback',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participants: [],
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderName: 'Jane Doe',
      body: 'Thanks for getting back to me!',
      channel: 'email',
      createdAt: new Date().toISOString(),
    },
  },
];

export function InboxList() {
  const { data } = useQuery({
    queryKey: ['inbox-conversations'],
    queryFn: async () => {
      // TODO: Replace with real API call using axios once endpoints are ready.
      return mockConversations;
    },
    initialData: mockConversations,
  });

  return (
    <List
      itemLayout="vertical"
      dataSource={data}
      renderItem={(conversation) => (
        <List.Item key={conversation.id}>
          <List.Item.Meta
            title={conversation.subject}
            description={
              conversation.lastMessage
                ? `${conversation.lastMessage.senderName}: ${conversation.lastMessage.body}`
                : 'No messages yet'
            }
          />
          <Tag color={conversation.status === 'open' ? 'green' : 'default'}>
            {conversation.status}
          </Tag>
        </List.Item>
      )}
    />
  );
}
