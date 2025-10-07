import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_: Request, { params }: Params) {
  const conversationMessages = db.messages
    .filter((message) => message.conversationId === params.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return NextResponse.json(conversationMessages);
}

export async function POST(request: Request, { params }: Params) {
  const body = await request.json().catch(() => null);
  const content = body?.content as string | undefined;

  if (!content) {
    return NextResponse.json({ message: 'Message content is required' }, { status: 400 });
  }

  const newMessage = {
    id: randomUUID(),
    conversationId: params.id,
    sender: 'agent' as const,
    content,
    timestamp: new Date().toISOString()
  };

  db.messages.push(newMessage);

  const conversation = db.conversations.find((item) => item.id === params.id);
  if (conversation) {
    conversation.lastMessage = content;
    conversation.updatedAt = newMessage.timestamp;
  }

  return NextResponse.json(newMessage, { status: 201 });
}
