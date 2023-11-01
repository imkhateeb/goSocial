import React, { useState } from 'react';
import logoImage from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import '../css/login.css';
import client from '../container/client';

export default function Login() {
  const navigate = useNavigate();
  const [isCorrectUserauth, setIsCorrectUserauth] = useState(true);
  const [isCorrectPassword, setIsCorrectPassword] = useState(true);

  const onFinish = async (values) => {
    const users = await client.fetch(`*[_type == "user"]`);
    let flagA = 0;
    let flagP = 0;
    users?.forEach(user => {
      if ((user?.userName === values.userauth) || (user?.email === values.userauth)) {
        flagA = 1;
        if (user?.password === values.password) {
          flagP = 1;
          localStorage.clear();
          localStorage.setItem("userID", user?._id);
          navigate("/");
          window.location.reload();
        }
      }
    });
    !flagA && setIsCorrectUserauth(false);
    !flagP && setIsCorrectPassword(false);
    setTimeout(() => {
      setIsCorrectPassword(true);
      setIsCorrectUserauth(true);
    }, 2000);
  };


  return (
    // Main login div
    <div className='flex justify-start items-center flex-col h-screen'>

      {/* video div */}
      <div className='relative w-full h-full bg-gradient-to-t from-black to-blue-900'>
        {/* Login Signup div */}
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0'>
          <div className='p-5'>
            <Link to={"/"}>
              <img src={logoImage} width='100px' alt='logo' className='rounded-full border-[0.5px] border-red-400' />
            </Link>
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>Login here.</h1>
          <div className='shadow-2xl w-2/5 xl:w-1/3 max-md:w-3/5 max-sm:w-11/12'>
            <div className='bg-white md:px-10 max-md:px-8 max-sm:px-5 py-10 rounded-lg w-100'>
              {!isCorrectUserauth && <p className='flex items-center justify-center text-xl sm:text-sm text-red-500 animate-bounce'>Incorrect Email or Username</p>}

              {!isCorrectPassword && isCorrectUserauth && <p className='flex items-center justify-center text-xl sm:text-sm text-red-500 animate-bounce'>Incorrect Password</p>}


              {!localStorage.getItem('userID') ?
                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="userauth"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Username or email!',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Password!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <div className='flex justify-between'>
                      <div>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                          <Checkbox className='max-sm:text-xs'>Remember me</Checkbox>
                        </Form.Item>
                      </div>

                      <div>
                        <Link className="login-form-forgot max-sm:text-xs" href="">
                          Forgot password
                        </Link>
                      </div>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <div className='flex items-center'>
                      <div className='mr-2'>
                        <Button htmlType="submit" className="login-form-button">
                          Log in
                        </Button>
                      </div>
                      <div>
                        Or <Link to={'/signup'} className='ml-2'>register now!</Link>
                      </div>
                    </div>
                  </Form.Item>
                </Form>
                :
                <>

                  <div
                    className='flex items-center justify-center text-xl sm:text-sm text-red-500 animate-bounce'
                  >You are already logged in</div>
                  <button onClick={() => localStorage.removeItem("userID")}>Logout</button>
                </>
              }
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

