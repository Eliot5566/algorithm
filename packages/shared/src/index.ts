export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  role: 'admin' | 'agent' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  tenantId: string;
  question: string;
  answer: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Form {
  id: string;
  tenantId: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];
}

export interface Submission {
  id: string;
  formId: string;
  tenantId: string;
  submittedAt: string;
  payload: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  tenantId: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId?: string;
  name: string;
  type: 'internal' | 'external';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId?: string;
  senderName: string;
  body: string;
  channel: 'email' | 'whatsapp' | 'telegram' | 'webform';
  attachments?: Attachment[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
