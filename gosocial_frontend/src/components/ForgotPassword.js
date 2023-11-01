import React from 'react'
import { Link } from 'react-router-dom'
import logoImage from '../assets/logo.png';

export default function ForgotPassword() {
  return (
    <div className='flex justify-center items-center min-h-screen flex-col bg-gradient-to-t from-black to-blue-900'>
      <div className='p-5'>
        <Link to={"/"}>
          <img src={logoImage} width='100px' alt='logo' className='rounded-full border-[0.5px] border-red-400' />
        </Link>
      </div>
      <div className='bg-white md:px-10 max-md:px-8 max-sm:px-6 pt-10 pb-2 my-3 rounded-lg w-3/5 xl:w-2/5 max-md:w-4/5 max-sm:w-11/12'>


      </div>
    </div>
  )
}
