import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import { listSubscribers } from '../api/notifications';
import Notification from '../components/Notification';

export default function NotificationSubscriptions() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSubscribers = async () => {
    try {
      setLoading(true);
      const data = await listSubscribers();
      setSubscribers(data?.details);
      setLoading(false);
    } catch (error) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (_, _record, index) => index + 1,
    },
    {
      title: 'NAMES',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
    },
  ];
  return (
    <Card title='NOTIFICATION SUBSCRIPTIONS'>
      {error && (
        <Notification
          status='error'
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <Table
        size='small'
        columns={columns}
        dataSource={subscribers}
        locale={{
          emptyText: 'No Subscriptions',
        }}
        loading={loading}
        pagination={subscribers.length > 10 ? { pageSize: 15 } : false}
      />
    </Card>
  );
}
