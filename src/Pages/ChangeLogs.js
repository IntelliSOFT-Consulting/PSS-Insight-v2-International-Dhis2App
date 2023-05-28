import React from 'react';
import { Table } from 'antd';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function ChangeLogs() {
  const columns = [
    {
      title: 'VERSION',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'COUNTRY',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'DATE ADDDED',
      dataIndex: 'date',
      key: 'date',
      render: date => date && format(new Date(date), 'dd/MM/yyyy'),
    },
    {
      title: 'ACTIONS',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Link to={`/changelog/${record?.id}`}>View</Link>
        </span>
      ),
    },
  ];
  return (
    <Card title='CHANGE LOGS'>
      <Table
        columns={columns}
        dataSource={[]}
        rowKey={record => record?.id}
        pagination={false}
        size='small'
        bordered
        locale={{
          emptyText: 'No change logs',
        }}
      />
    </Card>
  );
}
