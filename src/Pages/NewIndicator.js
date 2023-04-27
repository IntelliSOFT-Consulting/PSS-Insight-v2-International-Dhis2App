import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { createUseStyles } from 'react-jss';
import { Form, Input, Select, Button, Table } from 'antd';
import Title from '../components/Title';
import {
  createReference,
  getReferenceDetails,
  updateReference,
  getDropdowns,
} from '../api/indicators';
import Notification from '../components/Notification';
import { useNavigate, useParams } from 'react-router-dom';

const useStyles = createUseStyles({
  basicDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    position: 'relative',

    columnGap: '2rem',
    '& @media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  definition: {
    gridColumn: '2 / 3',
    gridRow: '2 / 4',
  },
  question: {
    display: 'flex',
    alignItems: 'center',
    '& input': {
      width: '100%',
    },
    '& button': {
      marginLeft: '1rem',
      backgroundColor: '#002656',
      padding: '0 2rem !important',
      '&:hover': {
        backgroundColor: '#002F6C !important',
      },
    },
  },
  select: {
    width: '20% !important',
    marginLeft: '1rem',
  },
  table: {
    margin: '1rem 0px',
  },
  danger: {
    color: '#F20F0F !important',
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

export default function NewIndicator({ user }) {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [valueTypes, setValueTypes] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    name: '',
    valueType: '',
  });
  const classes = useStyles();

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchDetails = async () => {
    try {
      const data = await getReferenceDetails(id);
      if (data) {
        form.setFieldsValue({
          ...data,
        });
        setQuestions(data.assessmentQuestions);
      }
    } catch (error) {
      setError('Something went wrong!');
    }
  };

  const fetchDropdowns = async () => {
    try {
      const data = await getDropdowns();
      if (data) {
        setTopics(data.topics?.details);
        setValueTypes(data.valueType?.details);
      }
    } catch (error) {
      setError('Something went wrong!');
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
    fetchDropdowns();
  }, [id]);

  const footer = (
    <div className={classes.footer}>
      <Button
        onClick={() => {
          setQuestions([]);
          form.resetFields();
          setCurrentQuestion({ name: '', valueType: '' });
          navigate('/indicators/dictionary');
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
        Save
      </Button>
    </div>
  );

  const handleKeyPress = () => {
    if (currentQuestion.name && currentQuestion.valueType) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({ name: '', valueType: '' });
    }
  };

  const columns = [
    {
      title: 'QUESTIONS',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'TYPE',
      dataIndex: 'valueType',
      key: 'valueType',
      render: text =>
        text === 'SELECTION' ? 'Yes/No' : text === 'NUMBER' ? 'Number' : 'Text',
      width: '30%',
    },
    {
      title: 'ACTIONS',
      dataIndex: 'action',
      key: 'action',
      render: (_, record, index) => (
        <Button
          type='danger'
          kind='link'
          className={classes.danger}
          onClick={() => {
            setQuestions(questions.filter((_, i) => i !== index));
          }}
        >
          Remove
        </Button>
      ),
      width: '20%',
    },
  ];

  const handleSubmit = async values => {
    try {
      const payload = {
        ...values,
        assessmentQuestions: questions,
        createdBy: {
          id: user?.me?.id,
          code: '',
          name: user?.me?.name,
          username: user?.me?.username,
          displayName: user?.me?.name,
        },
      };

      const data = id
        ? await updateReference(id, payload)
        : await createReference(payload);
      if (data) {
        setSuccess(
          id
            ? 'Indicator updated successfully!'
            : 'Indicator created successfully!'
        );
        form.resetFields();
        setQuestions([]);

        setTimeout(() => {
          setSuccess(false);
          navigate('/indicators/dictionary');
        }, 1000);
      }
    } catch (error) {
      setError('Something went wrong!');
    }
  };

  return (
    <Card title='ADD INDICATOR' footer={footer}>
      {success && (
        <Notification
          type='success'
          message={success}
          onClose={() => setSuccess(false)}
        />
      )}
      {error && (
        <Notification
          type='error'
          message={error}
          onClose={() => setError(false)}
        />
      )}
      <Form layout='vertical' form={form} onFinish={handleSubmit}>
        <div className={classes.basicDetails}>
          <Form.Item
            label='Indicator Name'
            name='indicatorName'
            rules={[
              {
                required: true,
                message: 'Please input the indicator name!',
              },
            ]}
          >
            <Input placeholder='Name' size='large' />
          </Form.Item>
          <Form.Item
            name='topic'
            label='Topic'
            rules={[
              {
                required: true,
                message: 'Please select the topic!',
              },
            ]}
          >
            <Select
              removeIcon
              placeholder='Select a topic'
              size='large'
              options={topics.map(topic => {
                return {
                  value: topic,
                  label: topic,
                };
              })}
            ></Select>
          </Form.Item>

          <Form.Item
            name='indicatorCode'
            label='PSS Insight Indicator #'
            rules={[
              {
                required: true,
                message: 'Please input the indicator code!',
              },
            ]}
          >
            <Input placeholder='PSS Insight Indicator #' size='large' />
          </Form.Item>
          <Form.Item
            name='definition'
            label='Definition'
            className={classes.definition}
            rules={[
              {
                required: true,
                message: 'Please input the definition!',
              },
            ]}
          >
            <Input.TextArea placeholder='Definition' size='large' rows={5} />
          </Form.Item>
          <Form.Item
            name='dataType'
            label='Data Type'
            rules={[
              {
                required: true,
                message: 'Please input type!',
              },
            ]}
          >
            <Select
              placeholder='Select a data type'
              size='large'
              options={valueTypes?.map(dataType => {
                return {
                  value: dataType,
                  label: dataType,
                };
              })}
            />
          </Form.Item>
        </div>
        <Title text='ASSESSMENT QUESTIONS:' type='primary' />
        <div className={classes.questions}>
          <div className={classes.question}>
            <Input
              placeholder='Add Question'
              size='large'
              value={currentQuestion.name}
              onChange={e =>
                setCurrentQuestion({
                  ...currentQuestion,
                  name: e.target.value,
                })
              }
            />
            <Select
              className={classes.select}
              placeholder={'Select a type'}
              size='large'
              value={currentQuestion.valueType}
              onChange={value =>
                setCurrentQuestion({ ...currentQuestion, valueType: value })
              }
              options={valueTypes?.map(valueType => {
                return {
                  value: valueType,
                  label: valueType,
                };
              })}
            />

            <Button size='large' type='primary' onClick={handleKeyPress}>
              Add
            </Button>
          </div>
          <Table
            className={classes.table}
            dataSource={questions}
            columns={columns}
            pagination={false}
            bordered
            size='small'
            locale={{
              emptyText: 'No questions added yet',
            }}
          />
        </div>
        <div className={classes.basicDetails}>
          <Form.Item
            name='purposeAndIssues'
            label='Purpose and Issues'
            rules={[
              {
                required: true,
                message: 'Please input the purpose and issues!',
              },
            ]}
          >
            <Input.TextArea
              placeholder='Purpose and Issues'
              size='large'
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name='preferredDataSources'
            label='Preferred Data Sources'
            rules={[
              {
                required: true,
                message: 'Please input the preferred data sources!',
              },
            ]}
          >
            <Input.TextArea
              placeholder='Preferred Data Sources'
              size='large'
              rows={4}
            />
          </Form.Item>
          <Form.Item
            name='methodOfEstimation'
            label='Method of Estimation'
            rules={[
              {
                required: true,
                message: 'Please input the method of estimation!',
              },
            ]}
          >
            <Input placeholder='Method of Estimation' size='large' />
          </Form.Item>

          <Form.Item
            name='proposedScoring'
            label='Proposed Scoring or Benchmarking'
            rules={[
              {
                required: true,
                message: 'Please input the proposed scoring or benchmarking!',
              },
            ]}
            className={classes.definition}
          >
            <Input.TextArea
              placeholder='Proposed Scoring or Benchmarking'
              size='large'
              rows={5}
            />
          </Form.Item>
          <Form.Item
            name='expectedFrequencyDataDissemination'
            label='Expected Frequency of Data Dissemination'
            rules={[
              {
                required: true,
                message:
                  'Please input the expected frequency of data dissemination!',
              },
            ]}
          >
            <Input
              placeholder='Expected Frequency of Data Dissemination'
              size='large'
            />
          </Form.Item>
          <Form.Item
            name='indicatorReference'
            label='Indicator Reference Number(s)'
            rules={[
              {
                required: true,
                message: 'Please input the indicator reference number(s)!',
              },
            ]}
          >
            <Input placeholder='Indicator Reference Number(s)' size='large' />
          </Form.Item>
          <Form.Item
            name='indicatorSource'
            label='Indicator Source(s)'
            rules={[
              {
                required: true,
                message: 'Please input the indicator source(s)!',
              },
            ]}
          >
            <Input.TextArea
              placeholder='Indicator Source(s)'
              size='large'
              rows={4}
            />
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
