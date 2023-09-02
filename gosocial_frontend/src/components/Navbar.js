import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import ProfilePicture from './ProfilePicture';
export default function Navbar({ searchTerm, setSearchTerm, user }) {
  const navigate = useNavigate();

  // if (!user) return null;

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      {!user ? (
        <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
          <button className='py-1 px-3 rounded-lg mr-5 outline-none bg-blue-500 shadow-lg hover:shadow-sm hover:bg-blue-400 cursor-pointer transition-all duration-500 text-white' onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")} className='text-blue-700 py-1 px-3 rounded-lg shadow-lg hover:shadow-sm hover:text-blue-400 transition-all duration-500 outline-none'>Signup</button>
        </div>
      ) : (
        <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
          <IoMdSearch fontSize={21} className='ml-1' />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search'
            value={searchTerm}
            onFocus={() => navigate("/search")}
            className='p-2 w-full bg-white outline-none'
          />
          <div className='flex gap-3'>
            <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
              <ProfilePicture
                width={14}
                height={12}
                isUploadActive={false}
                userId={user?._id}
                rounded='full'
              />
            </Link>
            <Link to={`/create-pin`} className='bg-black text-white rounded-full w-12 h-12 md:w-14 md:wh-12 flex justify-center items-center'>
              <IoMdAdd />
            </Link>
          </div>
        </div>
      )}
    </div >
  )
}
