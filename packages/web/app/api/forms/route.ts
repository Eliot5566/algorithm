import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import { FormField } from '@/types';

export async function GET() {
  return NextResponse.json(db.forms);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name as string | undefined;
  const description = body?.description as string | undefined;
  const fields = body?.fields as FormField[] | undefined;

  if (!name || !description || !fields) {
    return NextResponse.json({ message: 'Name, description, and fields are required' }, { status: 400 });
  }

  const newForm = { id: randomUUID(), name, description, fields };
  db.forms.push(newForm);

  return NextResponse.json(newForm, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;
  const name = body?.name as string | undefined;
  const description = body?.description as string | undefined;
  const fields = body?.fields as FormField[] | undefined;

  if (!id || !name || !description || !fields) {
    return NextResponse.json({ message: 'ID, name, description, and fields are required' }, { status: 400 });
  }

  const form = db.forms.find((item) => item.id === id);
  if (!form) {
    return NextResponse.json({ message: 'Form not found' }, { status: 404 });
  }

  form.name = name;
  form.description = description;
  form.fields = fields;

  return NextResponse.json(form);
}
