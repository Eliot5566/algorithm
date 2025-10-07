'use client';

import { Button, Form, Input, Modal, Space, Table, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ColumnsType } from 'antd/es/table';
import { Faq } from '@/types';

interface FaqFormValues {
  id?: string;
  question: string;
  answer: string;
}

export default function FaqsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [form] = Form.useForm<FaqFormValues>();

  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await apiClient.get('/api/faqs');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (values: FaqFormValues) => {
      const response = await apiClient.post('/api/faqs', values);
      return response.data;
    },
    onSuccess: () => {
      message.success('FAQ created');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => message.error('Failed to create FAQ')
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FaqFormValues) => {
      const response = await apiClient.put('/api/faqs', values);
      return response.data;
    },
    onSuccess: () => {
      message.success('FAQ updated');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsModalOpen(false);
      form.resetFields();
      setEditingFaq(null);
    },
    onError: () => message.error('Failed to update FAQ')
  });

  const columns: ColumnsType<Faq> = useMemo(
    () => [
      {
        title: 'Question',
        dataIndex: 'question',
        key: 'question'
      },
      {
        title: 'Answer',
        dataIndex: 'answer',
        key: 'answer'
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button
            type="link"
            onClick={() => {
              setEditingFaq(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
        )
      }
    ],
    [form]
  );

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingFaq) {
          updateMutation.mutate({ ...values, id: editingFaq.id });
        } else {
          createMutation.mutate(values);
        }
      })
      .catch(() => undefined);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setEditingFaq(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          New FAQ
        </Button>
        <Typography.Text type="secondary">
          Manage frequently asked questions to speed up replies.
        </Typography.Text>
      </Space>
      <Table<Faq>
        rowKey="id"
        columns={columns}
        dataSource={faqs}
        loading={isLoading}
        pagination={false}
      />
      <Modal
        title={editingFaq ? 'Edit FAQ' : 'New FAQ'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingFaq(null);
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="question" label="Question" rules={[{ required: true, message: 'Please enter the question' }]}>
            <Input.TextArea rows={2} placeholder="Enter FAQ question" />
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true, message: 'Please enter the answer' }]}>
            <Input.TextArea rows={4} placeholder="Enter FAQ answer" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
