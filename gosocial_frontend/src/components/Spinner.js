import React from 'react';
import {FallingLines} from 'react-loader-spinner';

export default function Spinner({ message }) {
  return (
    <div className='flex flex-col justify-center items-center w-full min-h-[80vh] gap-5'>
      <FallingLines 
        type="Circles"
        color="white"
        height={50}
        width={150}
      />
      <p className='text-xl font-bold text-center px-2 text-white'>{message}</p>
    </div>
  )
}
