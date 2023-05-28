import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Form, Radio, Input, Select, Button } from 'antd';
import { createUseStyles } from 'react-jss';
import { sendNotification, listSubscribers } from '../api/notifications';
import Notification from '../components/Notification';
import { filterValidEmails } from '../utils/helpers';

const useStyles = createUseStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: '2rem',
    width: '100%',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  btnSuccess: {
    backgroundColor: '#218838 !important',
    color: 'white',
    border: 'none',
    '&:hover': {
      backgroundColor: '#218838 !important',
      color: 'white !important',
    },
  },
  btnCancel: {
    backgroundColor: '#F2F2F2 !important',
    marginRight: '1rem',
    border: 'none !important',
    '&:hover': {
      backgroundColor: '#F2F2F2 !important',
      outline: 'none !important',
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default function NotificationBroadCast() {
  const [showEmails, setShowEmails] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const classes = useStyles();

  const [form] = Form.useForm();

  const onFormChange = (changedValues, _) => {
    if (changedValues.sendTo) {
      setShowEmails(changedValues.sendTo === 'emails');
    }
  };

  const getSubscribers = async () => {
    try {
      const data = await listSubscribers();
      const emails = data?.details.map(subscriber => ({
        label: `${subscriber.firstName} ${subscriber.lastName}`,
        value: subscriber.email,
      }));
      setSubscribers(filterValidEmails(emails));
    } catch (error) {
      console.log(error);
      setError('Failed to load subscribers');
    }
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  const onFinish = async values => {
    try {
      const { sendTo, emailList, title, message } = values;
      const notification = {
        sendAll: sendTo === 'sendAll',
        emailList: sendTo === 'emails' ? emailList : [],
        title,
        message,
        sender: 'admin',
      };
      const sent = await sendNotification(notification);
      if (sent) {
        setSuccess('Notification sent successfully');

        form.resetFields();

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setError('Something went wrong!');
    }
  };

  const footer = (
    <div className={classes.footer}>
      <Button
        onClick={() => {
          form.resetFields();
        }}
        className={classes.btnCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={() => {
          form.submit();
        }}
        className={classes.btnSuccess}
      >
        Send
      </Button>
    </div>
  );

  return (
    <Card title='NOTIFICATIONS BROADCAST' footer={footer}>
      {success && (
        <Notification
          status='success'
          message={success}
          onClose={() => setSuccess(false)}
        />
      )}
      {error && (
        <Notification
          status='error'
          message={error}
          onClose={() => setError(false)}
        />
      )}
      <Form
        layout='vertical'
        form={form}
        onValuesChange={onFormChange}
        onFinish={onFinish}
      >
        <div className={classes.grid}>
          <Form.Item
            label='Send to'
            name='sendTo'
            rules={[{ required: true, message: 'Please select an option' }]}
          >
            <Radio.Group>
              <Radio value='sendAll'>Subscribers</Radio>
              <Radio value='emails'>Enter emails</Radio>
            </Radio.Group>
          </Form.Item>
          {form.getFieldValue('sendTo') === 'emails' && (
            <Form.Item
              label='Emails'
              name='emailList'
              rules={
                showEmails && [
                  { required: true, message: 'Please enter email(s)' },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }

                      const errors = [];
                      value.forEach(email => {
                        if (!email.includes('@')) {
                          errors.push(new Error('Invalid email address'));
                        }
                      });

                      if (errors.length) {
                        return Promise.reject(errors);
                      }

                      return Promise.resolve();
                    },
                  },
                ]
              }
            >
              <Select
                size='large'
                removeIcon
                mode='tags'
                optionLabelProp='label'
                placeholder='Enter emails'
              >
                {subscribers.map(({ label, value }) => (
                  <Select.Option key={value} value={value} label={label}>
                    <span style={{ fontWeight: 'bolder' }} aria-label={label}>
                      {label}:
                    </span>
                    <span>{` ${value}`}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </div>
        <Form.Item
          name='title'
          label='Title'
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input size='large' placeholder='Title' />
        </Form.Item>

        <Form.Item
          name='message'
          label='Message'
          rules={[{ required: true, message: 'Please enter a message' }]}
        >
          <Input.TextArea placeholder='Message' rows={5} />
        </Form.Item>
      </Form>
    </Card>
  );
}
