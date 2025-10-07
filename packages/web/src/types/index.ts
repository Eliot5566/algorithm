export interface Conversation {
  id: string;
  customerName: string;
  lastMessage: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'agent' | 'customer';
  content: string;
  timestamp: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface FormField {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  updatedAt: string;
}

export interface TenantSettings {
  tenantName: string;
  channels: {
    type: string;
    connected: boolean;
  }[];
}
