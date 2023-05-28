import React, { useState, useEffect } from 'react';
import { listVersions, deleteVersion } from '../api/api';
import { createUseStyles } from 'react-jss';
import Card from '../components/Card';
import { format } from 'date-fns';
// import Table from '../components/Table';
import { Popconfirm, Table, Pagination } from 'antd';
import { Button } from '@dhis2/ui';
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
  actionLink: {
    '&::before': {
      content: '" | "',
      color: '#0067B9 !important',
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
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});

export default function Versions({ user }) {
  const [versions, setVersions] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(15);

  const classes = useStyles();

  const pageSize = 15;

  const getVersons = async () => {
    try {
      setLoading(true);
      const data = await listVersions(pageSize, page);
      setVersions(sortVersions(data?.details));
      data?.details?.length >= pageSize && setTotal(data?.count);
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
  }, [deleted, page]);

  const columns = [
    {
      title: '#',
      key: 'id',
      render: (_, row, index) => index + 1,
      width: '3rem',
    },
    {
      title: 'DATE CREATED',
      key: 'createdAt',
      render: (_, row) =>
        row.createdAt && format(new Date(row.createdAt), 'dd/MM/yyyy'),
    },
    {
      title: 'CREATED BY',
      key: 'createdBy',
      dataIndex: 'createdBy',
    },
    {
      title: 'VERSION NUMBER',
      key: 'versionName',
      dataIndex: 'versionName',
    },
    {
      title: 'DESCRIPTION',
      key: 'versionDescription',
      dataIndex: 'versionDescription',
    },
    {
      title: 'STATUS',
      key: 'status',
      render: row =>
        row.status?.charAt(0).toUpperCase() +
        row.status?.slice(1).toLowerCase(),
    },
    {
      title: 'PUBLISHED BY',
      key: 'publishedBy',
      dataIndex: 'publishedBy',
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render(row) {
        return (
          <div className={classes.actions}>
            <Link to={`/templates/versions/view/${row.id}`}>
              <button className={classes.edit}>View</button>
            </Link>
            {row?.status !== 'PUBLISHED' &&
            row.createdBy === user?.me?.username ? (
              <>
                <Link
                  to={`/templates/versions/edit/${row.id}`}
                  className={classes.actionLink}
                >
                  <button className={classes.edit}>Edit</button>
                </Link>
                <Popconfirm
                  title='Are you sure you want to delete this version?'
                  onConfirm={() => handleDelete(row.id)}
                  className={classes.actionLink}
                >
                  <button className={classes.delete}>Delete</button>
                </Popconfirm>
              </>
            ) : null}
          </div>
        );
      },
    },
  ];

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  const title = (
    <div className={classes.title}>
      <h3>TEMPLATES</h3>
      <Link to='/templates/versions/new'>
        <Button primary>New Version</Button>
      </Link>
    </div>
  );

  return (
    <Card title={title}>
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
        dataSource={versions}
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={page}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
        showLessItems={true}
        total={total}
      />
    </Card>
  );
}
