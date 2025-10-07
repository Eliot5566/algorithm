import { v4 as uuid } from 'uuid';

export type Form = {
  id: string;
  name: string;
  schema_json: unknown;
  trigger_keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type SubmissionStatus = 'new' | 'confirmed' | 'cancelled';

export type FormSubmission = {
  id: string;
  formId: string;
  conversationId: string;
  payload: unknown;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
};

const forms: Form[] = [];
const submissions: FormSubmission[] = [];

function now(): string {
  return new Date().toISOString();
}

export function listForms(): Form[] {
  return forms;
}

export function createForm(input: {
  name: string;
  schema_json: unknown;
  trigger_keywords: string[];
}): Form {
  const timestamp = now();
  const form: Form = {
    id: uuid(),
    name: input.name,
    schema_json: input.schema_json,
    trigger_keywords: input.trigger_keywords,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  forms.push(form);
  return form;
}

export function getForm(formId: string): Form | undefined {
  return forms.find((form) => form.id === formId);
}

export function listSubmissions(): FormSubmission[] {
  return submissions;
}

export function createSubmission(input: {
  formId: string;
  conversationId: string;
  payload: unknown;
}): FormSubmission {
  const timestamp = now();
  const submission: FormSubmission = {
    id: uuid(),
    formId: input.formId,
    conversationId: input.conversationId,
    payload: input.payload,
    status: 'new',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  submissions.push(submission);
  return submission;
}

export function getSubmission(submissionId: string): FormSubmission | undefined {
  return submissions.find((submission) => submission.id === submissionId);
}

export function updateSubmissionStatus(submissionId: string, status: SubmissionStatus): FormSubmission | undefined {
  const submission = getSubmission(submissionId);
  if (!submission) {
    return undefined;
  }

  submission.status = status;
  submission.updatedAt = now();
  return submission;
}
