import React, { useEffect, useState, useRef, Suspense } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Userprofile } from '../components';
import logoImage from '../assets/logo.png';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import client from './client';

const Sidebar = React.lazy(()=>import('../components/Sidebar'));

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
    <div className='flex bg-gradient-to-t from-black to-blue-900 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>

      <div className='hidden md:flex h-screen flex-initial'>
      <Suspense fallback={<h1>Sidebar Loading..</h1>}>
        <Sidebar user={user && user} />
      </Suspense>
      </div>

      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>

          <HiMenu fontSize={40} className='cursor-pointer text-white' onClick={() => setToggleSidebar(true)} />

          <Link to={'/'}>
            <img src={logoImage} alt='logo' className='w-10 rounded-lg ' />
          </Link>
        </div>
        {
          ToggleSidebar && (
            <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>

              <div className='absolute w-full flex justify-end items-center p-2'>
                <AiFillCloseCircle fontSize={30} className='cursor-pointer text-white' onClick={() => setToggleSidebar(false)} />
              </div>
            <Suspense fallback={<h1>Loading Sidebar..</h1>}>
              <Sidebar user={user && user} closeToggle={setToggleSidebar} />
            </Suspense>
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
