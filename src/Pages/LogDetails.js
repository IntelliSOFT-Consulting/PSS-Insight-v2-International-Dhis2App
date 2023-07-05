import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardItem from '../components/Card';
import { viewLog } from '../api/logs';

export default function LogDetails() {
  const { version } = useParams();

  const [log, setLog] = useState(null);

  const fetchLog = async () => {
    const data = await viewLog(version);
    setLog(data?.details);
  };

  useEffect(() => {
    fetchLog();
  }, [version]);

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      render: text => `${text}:`,
      width: '40%',
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const data1 = [
    { name: 'Version', value: log?.version },

    {
      name: 'Indicator',
      value: log?.indicatorName,
    },
  ];

  const data2 = [
    { name: 'Location', value: log?.location },
    {
      name: 'Changes',
      value: log?.changes,
    },
  ];
  return (
    <CardItem title='CHANGE LOGS'>
      {log && (
        <div className={styles.grid}>
          <Table
            columns={columns}
            dataSource={data1}
            pagination={false}
            loading={loading}
            showHeader={false}
            bordered
          />
          <Table
            columns={columns}
            dataSource={data2}
            pagination={false}
            loading={loading}
            showHeader={false}
            bordered
          />
        </div>
      )}
    </CardItem>
  );
}
