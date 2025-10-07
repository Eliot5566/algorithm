'use client';

import { Select, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Order } from '@/types';

const STATUS_OPTIONS: Order['status'][] = ['pending', 'processing', 'completed', 'cancelled'];

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/api/orders');
      return response.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const response = await apiClient.put('/api/orders', { id, status });
      return response.data;
    },
    onSuccess: () => {
      message.success('Order updated');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('Failed to update order')
  });

  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: Order['status'], record) => (
        <Select
          value={value}
          options={STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
          onChange={(status) => mutation.mutate({ id: record.id, status })}
          style={{ width: 160 }}
        />
      )
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => new Date(value).toLocaleString()
    }
  ];

  return (
    <div>
      <Typography.Paragraph type="secondary">
        Track order statuses and update them as you communicate with customers.
      </Typography.Paragraph>
      <Table<Order>
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
}
