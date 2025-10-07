import { DashboardPage } from '../../components/DashboardPage';

const settingsItems = [
  { key: 'profile', label: 'Profile', description: 'Update your personal details and avatar.' },
  {
    key: 'integrations',
    label: 'Integrations',
    description: 'Connect Telegram, WhatsApp, and e-commerce platforms.',
  },
  {
    key: 'automation',
    label: 'Automation',
    description: 'Create workflows and routing rules to automate your inbox.',
  },
];

export default function SettingsPage() {
  return (
    <DashboardPage
      title="Settings"
      description="Configure tenants, integrations, and automation policies."
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {settingsItems.map((item) => (
          <li key={item.key} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <strong>{item.label}</strong>
            <div style={{ color: '#888', marginTop: 4 }}>{item.description}</div>
          </li>
        ))}
      </ul>
    </DashboardPage>
  );
}
