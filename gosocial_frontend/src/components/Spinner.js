import React from 'react';
import {FallingLines} from 'react-loader-spinner';

export default function Spinner({ message }) {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <FallingLines 
        type="Circles"
        color="00BFFF"
        height={50}
        width={150}
        className="m-5"
      />
      <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}
