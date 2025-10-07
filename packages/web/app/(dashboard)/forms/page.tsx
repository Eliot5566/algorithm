'use client';

import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { FormTemplate } from '@/types';

interface FormTemplateValues {
  id?: string;
  name: string;
  description: string;
  fields: { key: string; label: string; placeholder?: string; required?: boolean }[];
}

export default function FormsPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<FormTemplateValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null);
  const [previewForm, setPreviewForm] = useState<FormTemplate | null>(null);

  const { data: forms, isLoading } = useQuery<FormTemplate[]>({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await apiClient.get('/api/forms');
      return response.data;
    }
  });

  useEffect(() => {
    if (forms && forms.length > 0 && !previewForm) {
      setPreviewForm(forms[0]);
    }
  }, [forms, previewForm]);

  const createMutation = useMutation({
    mutationFn: async (values: FormTemplateValues) => {
      const response = await apiClient.post('/api/forms', values);
      return response.data;
    },
    onSuccess: () => {
      message.success('Form created');
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => message.error('Failed to create form')
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormTemplateValues) => {
      const response = await apiClient.put('/api/forms', values);
      return response.data;
    },
    onSuccess: () => {
      message.success('Form updated');
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setIsModalOpen(false);
      form.resetFields();
      setEditingForm(null);
    },
    onError: () => message.error('Failed to update form')
  });

  const columns: ColumnsType<FormTemplate> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: 'Fields',
        key: 'fields',
        render: (_, record) => record.fields.length
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button
            type="link"
            onClick={() => {
              setEditingForm(record);
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
        if (editingForm) {
          updateMutation.mutate({ ...values, id: editingForm.id });
        } else {
          createMutation.mutate(values);
        }
      })
      .catch(() => undefined);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingForm(null);
              form.resetFields();
              form.setFieldsValue({ fields: [{ key: '', label: '', placeholder: '', required: true }] });
              setIsModalOpen(true);
            }}
          >
            New Form
          </Button>
          <Typography.Text type="secondary">
            Forms help agents capture structured information during chats.
          </Typography.Text>
        </Space>
        <Table<FormTemplate>
          rowKey="id"
          columns={columns}
          dataSource={forms}
          loading={isLoading}
          pagination={false}
          onRow={(record) => ({
            onClick: () => setPreviewForm(record)
          })}
        />
      </div>
      <Card title="Preview" bordered style={{ height: 'fit-content' }}>
        {!previewForm ? (
          <EmptyPreview />
        ) : (
          <div>
            <Typography.Title level={4} style={{ marginTop: 0 }}>
              {previewForm.name}
            </Typography.Title>
            <Typography.Paragraph>{previewForm.description}</Typography.Paragraph>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {previewForm.fields.map((field) => (
                <Card key={field.key} size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Text strong>{field.label}</Typography.Text>
                    <Typography.Text type="secondary">Key: {field.key}</Typography.Text>
                    {field.placeholder && (
                      <Typography.Text type="secondary">Placeholder: {field.placeholder}</Typography.Text>
                    )}
                    <Tag color={field.required ? 'blue' : 'default'}>
                      {field.required ? 'Required' : 'Optional'}
                    </Tag>
                  </Space>
                </Card>
              ))}
            </Space>
          </div>
        )}
      </Card>
      <Modal
        title={editingForm ? 'Edit Form' : 'New Form'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingForm(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        width={720}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Form Name" rules={[{ required: true, message: 'Please enter the form name' }]}>
            <Input placeholder="Return Request" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please describe the form' }]}
          >
            <Input.TextArea rows={3} placeholder="Describe how this form is used" />
          </Form.Item>
          <Form.List name="fields">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    title={`Field ${name + 1}`}
                    extra={
                      fields.length > 1 ? (
                        <Button type="link" danger onClick={() => remove(name)}>
                          Remove
                        </Button>
                      ) : null
                    }
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'label']}
                      label="Label"
                      rules={[{ required: true, message: 'Please provide a label' }]}
                    >
                      <Input placeholder="Order ID" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      label="Key"
                      rules={[{ required: true, message: 'Please provide a key' }]}
                    >
                      <Input placeholder="orderId" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'placeholder']} label="Placeholder">
                      <Input placeholder="Enter order number" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'required']} label="Required" valuePropName="checked">
                      <Checkbox>Required</Checkbox>
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add({ key: '', label: '', required: false })} block icon={<PlusOutlined />}>
                  Add Field
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}

function EmptyPreview() {
  return (
    <Typography.Text type="secondary">
      Select a form from the table to see how it will appear in chat.
    </Typography.Text>
  );
}
