import React, { useState, useEffect } from 'react';
import { listVersions, deleteVersion } from '../api/api';
import { createUseStyles } from 'react-jss';
import Card from '../components/Card';
import { format } from 'date-fns';
import Table from '../components/Table';
import { Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { sortVersions } from '../utils/helpers';

const useStyles = createUseStyles({
  actions: {
    '& button': {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      margin: '0 3px',
      padding: 0,
    },
  },
  edit: {
    color: '#005a8e',
  },
  delete: {
    color: '#f44336',
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  iconError: {
    width: '6rem',
    color: '#FD0C0B',
  },
  iconSuccess: {
    width: '6rem',
    color: ' #218838',
  },
});

export default function Versions({ user }) {
  const [versions, setVersions] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classes = useStyles();

  const getVersons = async () => {
    try {
      const data = await listVersions();
      setVersions(sortVersions(data?.details));
      setLoading(false);
    } catch (error) {
      setError(error?.response?.data);
    }
  };

  const handleDelete = async id => {
    try {
      const data = await deleteVersion(id);
      if (data) {
        setDeleted(true);
      }
    } catch (error) {
      setError(error?.response?.data?.details || 'Error deleting version');
    }
  };

  useEffect(() => {
    getVersons();
  }, [deleted]);

  const columns = [
    {
      name: '#',
      key: 'id',
      render: (row, index) => index + 1,
      width: '3rem',
    },
    {
      name: 'DATE CREATED',
      key: 'createdAt',
      render: row =>
        row.createdAt && format(new Date(row.createdAt), 'dd/MM/yyyy'),
    },
    {
      name: 'CREATED BY',
      key: 'createdBy',
    },
    {
      name: 'VERSION NUMBER',
      key: 'versionName',
    },
    {
      name: 'DESCRIPTION',
      key: 'versionDescription',
    },
    {
      name: 'STATUS',
      key: 'status',
      render: row =>
        row.status?.charAt(0).toUpperCase() +
        row.status?.slice(1).toLowerCase(),
    },
    {
      name: 'PUBLISHED BY',
      key: 'publishedBy',
    },
    {
      name: 'ACTIONS',
      key: 'actions',
      render(row) {
        return (
          <div className={classes.actions}>
            <Link to={`/view/${row.id}`}>
              <button className={classes.edit}>View</button> |{' '}
            </Link>
            {row?.status !== 'PUBLISHED' &&
            row.createdBy === user?.me?.username ? (
              <Link to={`/edit/${row.id}`}>
                <button className={classes.edit}>Edit</button> |{' '}
              </Link>
            ) : null}
            <Popconfirm
              title='Are you sure you want to delete this version?'
              onConfirm={() => handleDelete(row.id)}
            >
              <button className={classes.delete}>Delete</button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <Card title='TEMPLATES'>
      {error && (
        <Modal
          open={error}
          type='error'
          onCancel={() => setError(false)}
          title='Error'
          footer={null}
        >
          <div className={classes.modal}>
            <XCircleIcon className={classes.iconError} />
            {error}
          </div>
        </Modal>
      )}
      <Table
        columns={columns}
        tableData={versions}
        loading={loading}
        emptyMessage='No indicator versions available'
        pageSize={15}
        total={versions?.length}
        pagination={versions?.length > 15}
        hidePageSizeSelect
        hidePageSummary
        hidePageSelect
        bordered
      />
    </Card>
  );
}
