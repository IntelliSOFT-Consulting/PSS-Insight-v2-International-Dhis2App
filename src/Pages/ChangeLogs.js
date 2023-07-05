import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { listLogs } from '../api/logs';

export default function ChangeLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      const data = await listLogs();
      setLogs(data?.details);
    } catch (error) {
      if (error.response.status < 400) {
        setLogs(error.response.data?.details);
      } else {
        setError('Error fetching logs');
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
      dataIndex: 'dateAdded',
      key: 'dateAdded',
      render: date => date && format(new Date(date), 'dd/MM/yyyy'),
    },
    {
      title: 'ACTIONS',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Link to={`/changelog/${record?.version}`}>View</Link>
        </span>
      ),
    },
  ];
  return (
    <Card title='CHANGE LOGS'>
      {logs?.length > 0 && (
        <Table
          columns={columns}
          dataSource={logs}
          rowKey={record => record?.id}
          pagination={logs.length > 15 ? { pageSize: 15 } : false}
          size='small'
          bordered
          locale={{
            emptyText: 'No change logs',
          }}
        />
      )}
    </Card>
  );
}
