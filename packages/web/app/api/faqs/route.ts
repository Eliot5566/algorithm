import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

export async function GET() {
  return NextResponse.json(db.faqs);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question = body?.question as string | undefined;
  const answer = body?.answer as string | undefined;

  if (!question || !answer) {
    return NextResponse.json({ message: 'Question and answer are required' }, { status: 400 });
  }

  const newFaq = { id: randomUUID(), question, answer };
  db.faqs.push(newFaq);

  return NextResponse.json(newFaq, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;
  const question = body?.question as string | undefined;
  const answer = body?.answer as string | undefined;

  if (!id || !question || !answer) {
    return NextResponse.json({ message: 'ID, question, and answer are required' }, { status: 400 });
  }

  const faq = db.faqs.find((item) => item.id === id);
  if (!faq) {
    return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
  }

  faq.question = question;
  faq.answer = answer;

  return NextResponse.json(faq);
}
