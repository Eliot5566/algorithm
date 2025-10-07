import dayjs from 'dayjs';
import { DashboardPage } from '../../components/DashboardPage';
import { Submission } from '@unified-inbox/shared';

const orders: Submission[] = [
  {
    id: 'order-1',
    formId: 'order-form',
    tenantId: 'tenant-1',
    submittedAt: new Date().toISOString(),
    payload: {
      orderNumber: 'SO-1001',
      total: '$125.00',
    },
  },
];

export default function OrdersPage() {
  return (
    <DashboardPage
      title="Orders"
      description="Review the latest commerce activity synced from your storefront."
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {orders.map((order) => (
          <li key={order.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <strong>{order.payload.orderNumber as string}</strong>
            <div style={{ color: '#888', marginTop: 4 }}>
              Received on {dayjs(order.submittedAt).format('YYYY/MM/DD HH:mm')} · Total{' '}
              {order.payload.total as string}
            </div>
          </li>
        ))}
      </ul>
    </DashboardPage>
  );
}
