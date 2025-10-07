import { Conversation, Faq, FormTemplate, Message, Order, TenantSettings } from '@/types';

const now = new Date();

const conversations: Conversation[] = [
  {
    id: 'c1',
    customerName: 'Alice Chen',
    lastMessage: 'Thanks for the update!',
    updatedAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'c2',
    customerName: 'Bob Lee',
    lastMessage: 'Could you help with my order?',
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString()
  }
];

const messages: Message[] = [
  {
    id: 'm1',
    conversationId: 'c1',
    sender: 'customer',
    content: 'Thanks for the update!',
    timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'm2',
    conversationId: 'c1',
    sender: 'agent',
    content: 'Happy to help!',
    timestamp: new Date(now.getTime() - 1000 * 60 * 4).toISOString()
  },
  {
    id: 'm3',
    conversationId: 'c2',
    sender: 'customer',
    content: 'Could you help with my order?',
    timestamp: new Date(now.getTime() - 1000 * 60 * 55).toISOString()
  }
];

const faqs: Faq[] = [
  {
    id: 'f1',
    question: 'How do I reset my password?',
    answer: 'Click on Forgot password on the login page and follow the instructions.'
  },
  {
    id: 'f2',
    question: 'Where can I track my order?',
    answer: 'You can track your order from the Orders page in your account.'
  }
];

const forms: FormTemplate[] = [
  {
    id: 'form1',
    name: 'Return Request',
    description: 'Collect information for return requests.',
    fields: [
      { key: 'orderId', label: 'Order ID', placeholder: 'Enter order number', required: true },
      { key: 'reason', label: 'Reason', placeholder: 'Describe the issue', required: true }
    ]
  },
  {
    id: 'form2',
    name: 'Product Feedback',
    description: 'Gather customer feedback about products.',
    fields: [
      { key: 'product', label: 'Product Name', required: true },
      { key: 'rating', label: 'Rating (1-5)', required: true },
      { key: 'comments', label: 'Comments' }
    ]
  }
];

const orders: Order[] = [
  {
    id: 'o1',
    customer: 'Alice Chen',
    total: 120.5,
    status: 'processing',
    updatedAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'o2',
    customer: 'Bob Lee',
    total: 89.99,
    status: 'pending',
    updatedAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString()
  }
];

const settings: TenantSettings = {
  tenantName: 'Acme Corp',
  channels: [
    { type: 'Email', connected: true },
    { type: 'Messenger', connected: false },
    { type: 'WhatsApp', connected: true }
  ]
};

export const db = {
  conversations,
  messages,
  faqs,
  forms,
  orders,
  settings
};
