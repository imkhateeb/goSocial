import React from 'react';
import { FaUserCheck } from 'react-icons/fa';

export default function PinLoading() {
  return (
    <div
      className='m-4 p-4 bg-white shadow-xl rounded-lg border-[0.2px] border-pink-400
      animate-fade-in'
    >
      <div className='relative w-auto'>
        <div className='w-full rounded-t-lg rounded-b-none bg-gray-300 aspect-w-16 aspect-h-9' />
        <div className='absolute top-0 w-full h-full flex flex-col justify-between p-2 pr-3 pt-3 pb-3 z-50'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-3'>
              <div className='bg-white w-10 h-10 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none' />
            </div>
            <div className='bg-gray-300 font-bold px-6 text-white py-2 text-base rounded-3xl hover:shadow-md outlined-none' />
          </div>
          <div className='flex justify-between items-center gap-3 w-full'>
            <div className='bg-gray-300 flex items-center gap-3 text-black font-bold p-3 pl-5 pr-5 rounded-full opacity-70 hover:opacity-100 hover:shadow-md' />
            <div className='bg-gray-300 p-3 opacity-70 hover:opacity-100 font-bold font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none' />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 py-4 px-6 animate-fade-in-up'>
        <div className='w-10 h-10 rounded-full bg-gray-300' />
        <div className='text-black font-bold bg-gray-300 w-3/4 h-7 rounded-md' />
        <div className='text-gray-400 text-xs bg-gray-300 w-1/2 h-5 rounded-md' />
        <div className='flex items-center gap-3'>
          <div className='text-lg font-bold bg-gray-300 w-6 h-6 rounded-full' />
          <FaUserCheck />
        </div>
      </div>
    </div>
  );
}