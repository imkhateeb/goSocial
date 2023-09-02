import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import client from '../container/client';
const { v4: uuidv4 } = require('uuid');


const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function Signup() {
  const [usernameExist, setUsernameExist] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const checkExistingUser = async (values) => {
    const users = await client.fetch(`*[_type == "user"]`);
    let usernameExists = false;
    let emailExists = false;

    users?.forEach((user) => {
      if (user.userName === values.userName) {
        usernameExists = true;
      }
      if (user.email === values.email) {
        emailExists = true;
      }
    });
    return { usernameExists, emailExists };
  };


  const onFinish = async (values) => {
  const { usernameExists, emailExists } = await checkExistingUser(values);

  if (usernameExists) {
    setUsernameExist(true);
  }

  if (emailExists) {
    setEmailExist(true);
  }

  if (!emailExists && !usernameExists) { // Only create user if both conditions are false
    const { userName, email, password, gender, agreement } = values;
    const uuid = uuidv4();
    const doc = {
      _id: uuid,
      _type: 'user',
      myId: uuid,
      userName,
      email,
      password,
      gender,
      agreement,
    }

    client.createIfNotExists(doc).then(() => {
      localStorage.setItem("userID", doc._id);
      navigate('/');
    }).catch((error) => {
      console.log("Error creating user!", error);
    });
  } else {
    setTimeout(() => {
      setEmailExist(false);
      setUsernameExist(false);
    }, 3000);
  }
};



  return (
    <div className='flex justify-center items-center min-h-screen flex-col bg-mainColor'>
      <div className='p-5'>
        <img src={logoImage} width='100px' alt='logo' />
      </div>
      <div className='bg-white md:px-10 max-md:px-8 max-sm:px-6 pt-10 pb-2 my-3 rounded-lg w-3/5 xl:w-2/5 max-md:w-4/5 max-sm:w-11/12'>
        {!localStorage.getItem("userID") ?
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            scrollToFirstError
          >
            {emailExist && <p className='text-red-500 mb-5 text-md transition-all duration-100 ease-in-out animate-bounce'>
              Email already exist! Try another.
            </p>
            }
            {usernameExist && <p className='text-red-500 mb-5 text-md transition-all duration-200 ease-in-out animate-bounce'>
              Username already exist! Try another.
            </p>

            }
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value.length >= 6) {
                      return Promise.resolve();
                    } return Promise.reject(new Error('At least 6 character password!'));
                  }
                })

              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="userName"
              label="Username"
              tooltip="No spaces!, No special character except: _,@,$"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                  whitespace: true,
                },
                () => ({
                  validator(_, value) {
                    const pattern = /^[a-zA-Z0-9$_@]+$/;
                    if (pattern.test(value) && value.length >= 5) {
                      return Promise.resolve();
                    } else {
                      if (value.includes(" ")) {
                        return Promise.reject('Username will not contain spaces!');
                      } else if (value.length < 5) {
                        return Promise.reject('Username contains atleast 5 characters!');
                      } else {
                        return Promise.reject('Invalid username format! (specail character other than $,_,@ are not allowed');
                      }
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                {
                  required: true,
                  message: 'Please select gender!',
                },
              ]}
            >
              <Select placeholder="select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                I have read the <Link href="">agreement</Link>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <div className='flex justify-evenly'>
                <Button htmlType="submit">
                  Register
                </Button>
                <h1>OR</h1>
                <Link className='text-blue-700 hover:text-blue-400 transition-all duration-300' to='/login'>Already a user?</Link>
              </div>
            </Form.Item>
          </Form> : <div
            className='flex items-center justify-center text-xl sm:text-sm text-red-500 animate-bounce'
          >You are already logged in</div>}
      </div>
    </div>
  )
}
