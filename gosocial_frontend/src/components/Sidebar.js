import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { PoweroffOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { categories } from '../utils/data';
import ProfilePicture from './ProfilePicture';


export default function Sidebar({ user, closeToggle }) {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  function handleCloseSidebar() {
    if (closeToggle) closeToggle(false)
  }
  const isNoteActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
  const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';


  function handleLogout() {
    localStorage.removeItem('userID');
    localStorage.clear();
    setConfirmLogout(false);
    navigate("/");
    window.location.reload();
  }

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='w-200 mt-5 flex ml-5'>
      </div>
      <div className='flex flex-col'>
        <div className='flex px-5 gap-2 mt-3 mb-2 py-1 w-190 items-center cursor-pointer'>
          <ProfilePicture
            height={20}
            width={20}
            rounded={'full'}
            isUploadActive={true}
            userId={user && user._id}
          />
        </div>
        <div className='flex flex-col gap-5'>
          <NavLink to={'/'} className={({ isActive }) => isActive ? isActiveStyle : isNoteActiveStyle} onClick={handleCloseSidebar} >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover categories</h3>
          {
            categories.slice(0, categories.length - 1).map((category) => (
              <NavLink
                to={`/category/${category.name}`}
                className={({ isActive }) => isActive ? isActiveStyle : isNoteActiveStyle}
                onClick={handleCloseSidebar}
                key={category.name} >
                <img src={category.image} alt="category-img" className='w-8 h-8 rounded-full shadow-lg' />
                {category.name}
              </NavLink>
            ))
          }
        </div>
      </div>
      {user && (
        <>
          <Link
            to={`user-profile/${user._id}`}
            className='flex gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 animate-slide-in mt-4 justify-center'
            onClick={handleCloseSidebar}
          >
            <div className='flex px-5 gap-2 items-center'>
              <ProfilePicture
                height={10}
                width={10}
                rounded={'full'}
                isUploadActive={false}
                userId={user && user._id}
              />
            </div>
            <p>{user.userName}</p>
          </Link>
          {confirmLogout &&
            <div className='flex items-center gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 justify-between animate-slide-in mt-1'>
              <button className='cursor-pointer text-red-500' onClick={handleLogout}>Confirm</button>
              <button className='cursor-pointer text-green-300' onClick={() => setConfirmLogout(false)}>Cancel</button>
            </div>
          }

          <div className='flex mb-3 items-center gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 justify-center cursor-pointer z-100 animate-slide-in mt-1'
            onClick={() => setConfirmLogout(!confirmLogout)}
          > Logout
            <PoweroffOutlined />
          </div>
        </>
      )}
    </div>
  )
}
