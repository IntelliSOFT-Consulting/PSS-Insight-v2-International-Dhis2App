import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardItem from '../components/Card';
import { viewLog } from '../api/logs';
import { Table } from 'antd';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '20px',
    '@media (max-width: 1020px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export default function LogDetails() {
  const { version } = useParams();
  const styles = useStyles();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLog = async () => {
    try {
      const data = await viewLog(version);
      setLog(data?.details);
    } catch (error) {
      if (error.response.status < 400) {
        setLog(error.response.data?.details);
      }
    }
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
      value: log?.indicator || '-',
    },
  ];

  const data2 = [
    { name: 'Location', value: log?.country},
    {
      name: 'Changes',
      value: log?.changes || '-',
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
