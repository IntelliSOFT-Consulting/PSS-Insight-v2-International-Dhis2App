import React, { useState } from 'react';
import Card from '../components/Card';
import { Form, Input, Button } from 'antd';
import { createUseStyles } from 'react-jss';
import { saveEmailConfig } from '../api/configurations';
import Notification from '../components/Notification';

const useStyles = createUseStyles({
  '@global': {
    '.ant-btn-primary': {
      background: '#218838',
      borderColor: '#218838',
      '&:hover': {
        background: '#139b48 !important',
        borderColor: '#139b48',
      },
    },
    '.ant-btn-default': {
      background: '#AAAAAA',
      borderColor: '#AAAAAA',
      color: '#fff',
      '&:hover': {
        background: '#AAAAAA !important',
        borderColor: '#AAAAAA !important',
        color: '#fff !important',
      },
    },
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '2rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& >button': {
      '&:not(:last-child)': {
        marginRight: '1rem',
      },
    },
  },
  bordered: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    paddingBottom: '1.5rem',
  },
});

export default function EmailConfig() {
  const classes = useStyles();
  const [form] = Form.useForm();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const onFinish = async values => {
    try {
      await saveEmailConfig(values);
      setSuccess('Email configuration saved successfully');

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (e) {
      setError('Error saving email configuration');
    }
  };

  const footer = (
    <div className={classes.footer}>
      <Button
        type='default'
        form='email-config-form'
        onClick={() => form.resetFields()}
      >
        Cancel
      </Button>
      <Button
        type='primary'
        htmlType='submit'
        form='email-config-form'
        onClick={() => form.submit()}
      >
        Save
      </Button>
    </div>
  );

  return (
    <Card title='EMAIL CONFIGURATION' footer={footer}>
      {success && (
        <Notification
          message={success}
          status='success'
          onClose={() => setSuccess(false)}
        />
      )}
      {error && (
        <Notification
          message={error}
          status='error'
          onClose={() => setError(false)}
        />
      )}
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        className={classes.form}
      >
        <Form.Item
          name='username'
          style={{ gridColumn: '1 / span 2' }}
          extra='This is the name that will be shown in the "From" field of emails sent from this account.'
          className={classes.bordered}
          rules={[
            {
              required: true,
              message: 'Username is required',
            },
          ]}
          label='Username'
        >
          <Input style={{ width: '50%' }} size='large' placeholder='Username' />
        </Form.Item>
        <Form.Item
          style={{ gridRow: '2' }}
          rules={[
            {
              required: true,
              message: 'Server is required',
            },
          ]}
          label='Server'
          name='serverName'
        >
          <Input size='large' placeholder='Server' />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Port is required',
            },
          ]}
          label='Port'
          name='ports'
        >
          <Input size='large' placeholder='Port' />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Server Type is required',
            },
          ]}
          label='Server Type'
          name='serverType'
        >
          <Input size='large' placeholder='Server type' />
        </Form.Item>
        <Form.Item
          name='from'
          rules={[
            {
              required: true,
              message: 'From is required',
            },
            {
              type: 'email',
              message: 'Please enter a valid email address',
            },
          ]}
          label='From'
        >
          <Input size='large' placeholder='From' />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Password is required',
            },
          ]}
          label='Password'
          name='password'
        >
          <Input size='large' type='password' placeholder='Password' />
        </Form.Item>
      </Form>
    </Card>
  );
}
