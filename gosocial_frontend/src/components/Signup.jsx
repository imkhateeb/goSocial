import React from 'react';
import logoImage from '../assets/logo.png';
import introVideo from '../assets/goSocialIntroVideo.mp4';
import { Button, Checkbox, Form, Input, Select, } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
// import client from '../container/client';
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

async function postData(documment){
   const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;
   const URI = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/production`;
   const Token = `Bearer ${process.env.REACT_APP_SANITY_TOKEN}`

   try {
      const response = await fetch(URI, {
         method: "POST",
         headers: {
            "Content-Type" : "application/json",
            "Authorization" : Token,
         },
         body: JSON.stringify({
            mutations: [
               {
                  create: documment
               }
            ]
         })
      });

      const json = await response.json();
      console.log("Document created: ", json);
   } catch (error) {
      console.log("Error while sending data to sanity---", error);
   }
};


export default function Signup() {
   const navigate = useNavigate();
   const [form] = Form.useForm();
   const onFinish = async (values) => {
      const uuid = uuidv4();
      const doc = {
         _id: uuid,
         _type: 'user',
         myId: uuid,
         userName: values.username,
         email: values.email,
         password: values.password,
         gender: values.gender,
      }
      localStorage.setItem('userID', uuid);
      await postData(doc);
      navigate('/');
   };



   return (


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
               <div className='bg-white p-10 rounded-lg w-1/3'>
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
                        name="username"
                        label="Username"
                        tooltip="how others will tag you(e.g @iamhateeb_)?"
                        rules={[
                           {
                              required: true,
                              message: 'Please input your username!',
                              whitespace: true,
                           },
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
                        <Button htmlType="submit">
                           Register
                        </Button>
                     </Form.Item>
                  </Form>
               </div>
            </div>
         </div>
      </div>
   )
}
