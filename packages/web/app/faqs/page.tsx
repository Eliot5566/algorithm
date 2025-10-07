import { DashboardPage } from '../../components/DashboardPage';
import { FAQ } from '@unified-inbox/shared';

const faqs: FAQ[] = [
  {
    id: 'faq-1',
    tenantId: 'tenant-1',
    question: 'How do I connect my Telegram bot?',
    answer: 'Navigate to Settings > Integrations and follow the guided steps.',
    tags: ['telegram', 'integration'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function FaqsPage() {
  return (
    <DashboardPage title="FAQs" description="Create reusable answers to keep your team aligned.">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {faqs.map((faq) => (
          <li key={faq.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <strong>{faq.question}</strong>
            <div style={{ color: '#888', marginTop: 4 }}>{faq.answer}</div>
          </li>
        ))}
      </ul>
    </DashboardPage>
  );
}
