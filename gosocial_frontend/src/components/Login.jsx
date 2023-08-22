import React, {useState} from 'react'
import introVideo from '../assets/goSocialIntroVideo.mp4';
import logoImage from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import '../css/login.css';
import client from '../container/client';

// This modules will be used at the time of oAuth
// import { FcGoogle } from 'react-icons/fc';
// import { GoogleLogin } from '@leecheuk/react-google-login';


export default function Login() {
  const navigate = useNavigate();
  const [isCorrectUserauth, setIsCorrectUserauth] = useState(true);
  const [isCorrectPassword, setIsCorrectPassword] = useState(true);

  const onFinish = async (values) => {
    // const {remember} = values;
    const users = await client.fetch(`*[_type == "user"]`);
    let flagA = 0;
    let flagP = 0;
    users?.forEach(user => {
      if ( (user?.userName === values.userauth) || (user?.email === values.userauth)){
        flagA = 1;
        if ( user?.password === values.password){
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
      <div className='relative w-full h-full'>
        <video
          src={introVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        {/* Login Signup div */}
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0'>
          <div className='p-5'>
            <img src={logoImage} width='130px' alt='logo' />
          </div>
          <div className='shadow-2xl w-1/3'>
            <div className='bg-white p-10 rounded-lg w-100'>


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
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                    </div>

                    <div>
                      <Link className="login-form-forgot" href="">
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
              <div
                className='flex items-center justify-center text-xl sm:text-sm text-red-500 animate-bounce'
              >You are already logged in</div>
              }
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

