import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
export default function Navbar({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      {!localStorage.getItem("userID") ? (
        <div className='flex justify-start items-center w-full px-2 rounded-md border-none outline-none focus-within:shadow-sm'>
          <button className='py-2 px-5 rounded-md mr-5 outline-none bg-blue-600 shadow-lg hover:shadow-sm hover:bg-blue-500 cursor-pointer transition-all duration-500 text-white' onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")} className='text-white py-2 px-5 rounded-lg shadow-lg hover:shadow-sm hover:text-gray-200 transition-all duration-500 outline-none'>Signup</button>
        </div>
      ) : (
        <div className='flex justify-start items-center w-full pl-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
          <IoMdSearch fontSize={21} className='ml-1' />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search'
            value={searchTerm}
            onFocus={() => navigate("/search")}
            className='p-2 w-full bg-white outline-none'
          />
          <div>
            <Link to={`/create-pin`} className='bg-black text-white rounded-r-md w-12 h-12 md:w-14 flex justify-center items-center'>
              <IoMdAdd className='text-3xl font-bold' />
            </Link>
          </div>
        </div>
      )}
    </div >
  )
}
