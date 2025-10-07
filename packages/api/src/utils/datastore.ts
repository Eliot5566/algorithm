export type ConversationStatus = 'open' | 'closed';
export type MessageDirection = 'inbound' | 'outbound';

export interface Customer {
  id: number;
  tenantId: number;
  externalId: string;
  channel: string;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  tenantId: number;
  channelId: number;
  customerId: number;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  direction: MessageDirection;
  contentType: 'text' | 'photo' | 'form';
  content: any;
  createdAt: string;
  externalMessageId?: string;
  metadata?: Record<string, any>;
}

export interface Job {
  id: number;
  tenantId: number;
  type: string;
  status: 'pending' | 'done';
  payload: Record<string, any>;
  createdAt: string;
}

export interface FAQ {
  id: number;
  tenantId: number;
  question: string;
  answer: string;
  keywords?: string[];
  updatedAt: string;
}

export interface FormDefinition {
  id: number;
  tenantId: number;
  channelId: number;
  name: string;
  schema: any;
  trigger_keywords: string[];
  updatedAt: string;
}

type DataShape = {
  customers: Customer[];
  conversations: Conversation[];
  messages: Message[];
  jobs: Job[];
  faqs: FAQ[];
  forms: FormDefinition[];
};

const defaultData: DataShape = {
  customers: [],
  conversations: [],
  messages: [],
  jobs: [],
  faqs: [],
  forms: [],
};

let globalInstance: DataStore | null = null;

export class DataStore {
  private data: DataShape;
  private nextIds: Record<keyof DataShape, number>;

  private constructor() {
    this.data = JSON.parse(JSON.stringify(defaultData));
    this.nextIds = {
      customers: 1,
      conversations: 1,
      messages: 1,
      jobs: 1,
      faqs: 1,
      forms: 1,
    };
  }

  static getInstance(): DataStore {
    if (!globalInstance) {
      globalInstance = new DataStore();
    }
    return globalInstance;
  }

  seedFAQs(tenantId: number, faqs: Array<Omit<FAQ, 'id' | 'tenantId' | 'updatedAt'>>): void {
    for (const faq of faqs) {
      this.data.faqs.push({
        id: this.nextIds.faqs++,
        tenantId,
        question: faq.question,
        answer: faq.answer,
        keywords: faq.keywords ?? [],
        updatedAt: new Date().toISOString(),
      });
    }
  }

  seedForms(tenantId: number, forms: Array<Omit<FormDefinition, 'id' | 'tenantId' | 'updatedAt'>>): void {
    for (const form of forms) {
      this.data.forms.push({
        id: this.nextIds.forms++,
        tenantId,
        channelId: form.channelId,
        name: form.name,
        schema: form.schema,
        trigger_keywords: form.trigger_keywords,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  listFAQs(tenantId: number): FAQ[] {
    return this.data.faqs.filter((faq) => faq.tenantId === tenantId);
  }

  listForms(tenantId: number): FormDefinition[] {
    return this.data.forms.filter((form) => form.tenantId === tenantId);
  }

  findOrCreateCustomer(params: {
    tenantId: number;
    externalId: string;
    channel: string;
    displayName?: string;
  }): Customer {
    const existing = this.data.customers.find(
      (customer) => customer.tenantId === params.tenantId && customer.externalId === params.externalId && customer.channel === params.channel,
    );
    if (existing) {
      existing.updatedAt = new Date().toISOString();
      if (params.displayName && !existing.displayName) {
        existing.displayName = params.displayName;
      }
      return existing;
    }
    const now = new Date().toISOString();
    const customer: Customer = {
      id: this.nextIds.customers++,
      tenantId: params.tenantId,
      externalId: params.externalId,
      channel: params.channel,
      displayName: params.displayName,
      createdAt: now,
      updatedAt: now,
    };
    this.data.customers.push(customer);
    return customer;
  }

  findOrCreateConversation(params: {
    tenantId: number;
    channelId: number;
    customerId: number;
  }): Conversation {
    let conversation = this.data.conversations
      .filter((conv) => conv.tenantId === params.tenantId && conv.customerId === params.customerId && conv.status === 'open')
      .sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1))[0];

    if (conversation) {
      return conversation;
    }

    const now = new Date().toISOString();
    conversation = {
      id: this.nextIds.conversations++,
      tenantId: params.tenantId,
      channelId: params.channelId,
      customerId: params.customerId,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };
    this.data.conversations.push(conversation);
    return conversation;
  }

  appendMessage(message: Omit<Message, 'id' | 'createdAt'> & { createdAt?: string }): Message {
    const createdAt = message.createdAt ?? new Date().toISOString();
    const record: Message = {
      id: this.nextIds.messages++,
      conversationId: message.conversationId,
      direction: message.direction,
      contentType: message.contentType,
      content: message.content,
      createdAt,
      externalMessageId: message.externalMessageId,
      metadata: message.metadata,
    };
    this.data.messages.push(record);
    const conversation = this.data.conversations.find((conv) => conv.id === message.conversationId);
    if (conversation) {
      conversation.lastMessageAt = createdAt;
      conversation.updatedAt = createdAt;
    }
    return record;
  }

  listMessages(conversationId: number): Message[] {
    return this.data.messages
      .filter((msg) => msg.conversationId === conversationId)
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0));
  }

  listConversations(params: { tenantId: number; status?: ConversationStatus; q?: string; page: number; pageSize: number }): {
    data: Conversation[];
    total: number;
  } {
    const { tenantId, status, q, page, pageSize } = params;
    let result = this.data.conversations.filter((conv) => conv.tenantId === tenantId);
    if (status) {
      result = result.filter((conv) => conv.status === status);
    }
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter((conv) => {
        const customer = this.data.customers.find((c) => c.id === conv.customerId);
        const display = customer?.displayName ?? '';
        const externalId = customer?.externalId ?? '';
        return display.toLowerCase().includes(lower) || externalId.toLowerCase().includes(lower);
      });
    }
    result = result.sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1));
    const total = result.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = result.slice(start, end);
    return { data, total };
  }

  closeConversation(conversationId: number): void {
    const conversation = this.data.conversations.find((conv) => conv.id === conversationId);
    if (conversation) {
      conversation.status = 'closed';
      conversation.updatedAt = new Date().toISOString();
    }
  }

  getConversation(conversationId: number): Conversation | undefined {
    return this.data.conversations.find((conv) => conv.id === conversationId);
  }

  getCustomer(customerId: number): Customer | undefined {
    return this.data.customers.find((customer) => customer.id === customerId);
  }

  enqueueJob(job: Omit<Job, 'id' | 'createdAt' | 'status'> & { status?: Job['status'] }): Job {
    const record: Job = {
      id: this.nextIds.jobs++,
      tenantId: job.tenantId,
      type: job.type,
      payload: job.payload,
      status: job.status ?? 'pending',
      createdAt: new Date().toISOString(),
    };
    this.data.jobs.push(record);
    return record;
  }

  listJobs(): Job[] {
    return [...this.data.jobs];
  }
}
