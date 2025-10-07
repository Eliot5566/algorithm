import { DashboardPage } from '../../components/DashboardPage';
import { Form } from '@unified-inbox/shared';

const forms: Form[] = [
  {
    id: 'form-1',
    tenantId: 'tenant-1',
    name: 'Contact Us',
    fields: [
      { id: 'field-1', label: 'Name', type: 'text', required: true },
      { id: 'field-2', label: 'Email', type: 'email', required: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function FormsPage() {
  return (
    <DashboardPage
      title="Forms"
      description="Build custom forms and track submissions in a single inbox."
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {forms.map((form) => (
          <li key={form.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <strong>{form.name}</strong>
            <div style={{ color: '#888', marginTop: 4 }}>
              {form.fields.length} fields · Last updated{' '}
              {new Date(form.updatedAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </DashboardPage>
  );
}
