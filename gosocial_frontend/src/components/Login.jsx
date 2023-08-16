import React from 'react'
import introVideo from '../assets/goSocialIntroVideo.mp4';
import logoImage from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import '../css/login.css';
// This modules will be used at the time of oAuth
// import { FcGoogle } from 'react-icons/fc';
// import { GoogleLogin } from '@leecheuk/react-google-login';


export default function Login() {
  const navigate = useNavigate();


  // This is the part of oAuth
  // function responseGoogle(response) {
  //   console.log(response);
  // }

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    navigate("/");
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
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logoImage} width='130px' alt='logo' />
          </div>
          <div className='shadow-2xl w-1/3'>
            <div className='bg-white p-10 rounded-lg w-100'>
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Username!',
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
                      Or <Link href="" className='ml-2'>register now!</Link>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            </div>


            {/* 
              // we will see it when complete the oAuth - Angela Yu
              <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={renderProps => (
                <button type='button' className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none' onClick={renderProps.onClick} disabled={renderProps.disabled}><FcGoogle className='mr-4' /> Signin with google</button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy='single_host_origin'
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

