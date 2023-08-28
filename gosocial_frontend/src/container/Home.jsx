import React, { useEffect, useState, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, Userprofile } from '../components';
import logoImage from '../assets/logo.png';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import client from './client';

export default function Home() {
  const [ToggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const authToken = localStorage.getItem('userID') !== undefined ? localStorage.getItem('userID') : localStorage.clear();


  useEffect(() => {
    const query = userQuery(authToken);
    const queryData = () => {
      client.fetch(query).then((data) => {
        setUser(data[0]);
      })
    }
    queryData();
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);


  return (
    // This is complete home div
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>

      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user} />
      </div>

      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>

          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />

          <Link to={'/'}>
            <img src={logoImage} alt='logo' className='w-10 rounded-lg ' />
          </Link>
          <Link to={`user-profile/${user?.myId}`}>
            <span>{user?.userName}</span>
          </Link>
        </div>
        {
          ToggleSidebar && (
            <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>

              <div className='absolute w-full flex justify-end items-center p-2'>
                <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
              </div>

              <Sidebar user={user && user} closeToggle={setToggleSidebar} />
            </div>
          )
        }
      </div>

      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<Userprofile />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>

    </div>
  )
}
