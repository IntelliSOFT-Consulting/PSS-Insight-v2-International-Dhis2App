import {
  MinusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  '@global': {
    '.selections': {
      marginTop: '10px',
      padding: '0px !important',
      paddingBottom: '1rem',
    },
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '10px',
  },
  delete: {
    color: '#bb0c2f',
  },
});

const OptionsForm = ({ onFinish }) => {
  const classes = useStyles();
  return (
    <Form
      name='optionsForm'
      onFinish={onFinish}
      autoComplete='off'
      className={classes.root}
    >
      <Form.List name='options'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  marginBottom: 8,
                }}
                align='baseline'
                className={classes.option}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'key']}
                  style={{ marginRight: '10px', width: 'calc(100% - 10px)' }}
                  rules={[
                    {
                      required: true,
                      message: 'Please input an option',
                    },
                  ]}
                >
                  <Input placeholder='Option' />
                </Form.Item>
                <DeleteOutlined
                  className={classes.delete}
                  onClick={() => remove(name)}
                />
              </div>
            ))}
            <Form.Item>
              <Button
                type='dashed'
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add option
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      {/* <Form.Item>
      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </Form.Item> */}
    </Form>
  );
};
export default OptionsForm;
