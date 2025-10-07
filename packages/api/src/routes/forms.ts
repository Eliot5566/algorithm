import { Request, Response, Router } from 'express';
import { createForm, Form, listForms, getForm } from '../store';

const formsRouter = Router();

formsRouter.get('/', (_req: Request, res: Response) => {
  res.json({ data: listForms() });
});

formsRouter.post('/', (req: Request, res: Response) => {
  const { name, schema_json, trigger_keywords } = req.body ?? {};

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'name is required' });
  }

  if (typeof schema_json !== 'object' || schema_json === null) {
    return res.status(400).json({ message: 'schema_json must be an object' });
  }

  if (!Array.isArray(trigger_keywords) || trigger_keywords.some((keyword) => typeof keyword !== 'string')) {
    return res.status(400).json({ message: 'trigger_keywords must be an array of strings' });
  }

  const sanitizedKeywords = trigger_keywords
    .map((keyword: string) => keyword.trim())
    .filter((keyword: string) => keyword.length > 0);

  const form = createForm({
    name: name.trim(),
    schema_json,
    trigger_keywords: sanitizedKeywords,
  });

  res.status(201).json({ data: form });
});

formsRouter.post('/:id/preview', (req: Request, res: Response) => {
  const form = getForm(req.params.id);
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }

  const preview = buildFormPreview(form);
  res.json({ data: preview });
});

export default formsRouter;

type PreviewField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

type FormPreview = {
  formId: string;
  name: string;
  introText: string;
  quickReplies: string[];
  fields: PreviewField[];
};

function buildFormPreview(form: Form): FormPreview {
  return {
    formId: form.id,
    name: form.name,
    introText: `請填寫 ${form.name}`,
    quickReplies: form.trigger_keywords,
    fields: extractFields(form.schema_json),
  };
}

function extractFields(schema: unknown): PreviewField[] {
  if (!schema) {
    return [];
  }

  if (Array.isArray(schema)) {
    return schema.map((value, index) => normalizeField(value, `field_${index + 1}`));
  }

  if (typeof schema === 'object') {
    const record = schema as Record<string, unknown>;
    if (Array.isArray(record.fields)) {
      return record.fields.map((value, index) => normalizeField(value, `field_${index + 1}`));
    }

    return Object.entries(record).map(([key, value]) => normalizeField(value, key));
  }

  return [];
}

function normalizeField(value: unknown, fallbackName: string): PreviewField {
  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>;
    const name = typeof record.name === 'string' && record.name.trim() ? record.name : fallbackName;
    const label = typeof record.label === 'string' && record.label.trim() ? record.label : name;
    const type = typeof record.type === 'string' && record.type.trim()
      ? record.type
      : inferType(record.value ?? record.default ?? record.placeholder);
    const required = typeof record.required === 'boolean' ? record.required : false;

    return {
      name,
      label,
      type,
      required,
    };
  }

  return {
    name: fallbackName,
    label: fallbackName,
    type: inferType(value),
    required: false,
  };
}

function inferType(value: unknown): string {
  if (value === null || value === undefined) {
    return 'text';
  }

  if (Array.isArray(value)) {
    return 'select';
  }

  const valueType = typeof value;
  if (valueType === 'number') {
    return 'number';
  }
  if (valueType === 'boolean') {
    return 'boolean';
  }

  return 'text';
}
