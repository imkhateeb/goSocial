import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
// import { IoIosArrowForward } from 'react-icons/io';
import logoImage from '../assets/logo.png';
import { urlFor } from '../container/client';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import client from '../container/client';
import Roundspinner from './Roundspinner';
import { PoweroffOutlined } from '@ant-design/icons';

import { categories } from '../utils/data';

export default function Sidebar({ user, closeToggle }) {
  // this is for image loading
  const [loading, setLoading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);

  // this is for dp loading
  const [dploading, setDploading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);

  function handleCloseSidebar() {
    if (closeToggle) closeToggle(false)
  }
  const isNoteActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
  const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

  // logic to check if DP was present or not
  let dpUrl = null;
  if (user?.image) {
    const dp = urlFor(user.image);
    dpUrl = dp?.url();
  }
  // console.log(dpUrl);

  useEffect(() => {
    setTimeout(() => {
      setDploading(false);
    }, 1000);
  }, [])


  function uploadDP(e) {
    // take the type of image file
    const { type, name } = e.target.files[0];
    // console.log(name);
    // check if correct image is taken or not
    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false);

      // start working on the iamge
      setLoading(true);

      // uploading the image into assets of y project
      client.assets
        // .upload('type of asset', 'body', 'options')
        .upload('image', e.target.files[0], { contentType: type, filename: name })
        .then((document) => {
          const imageAssetId = document._id;
          client
            .patch(user?._id)
            .set({
              image: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAssetId,
                },
              },
            })
            .commit()
            .then(updatedDocument => {
              setLoading(false);
              window.location.reload();
            })
            .catch(error => {
              console.error('Error updating document:', error);
            });
        })
        .catch((error) => {
          console.log("Image upload error ", error);
        })
    } else {
      wrongImageType(true)
      setTimeout(() => {
        wrongImageType(false);
      }, 2000);
    }
  }

  function handleLogout() {
    localStorage.removeItem('userID');
    localStorage.clear();
    setConfirmLogout(false);
    window.location.reload();
  }

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        {user ?
          <>
            {!dpUrl ?
              <label className='flex px-5 gap-2 my-6 pt-1 w-190 items-center cursor-pointer'>
                {loading ? <Roundspinner /> : (
                  <>
                    <div className='h-20 w-20 flex flex-col justify-center items-center bg-gray-300 rounded-full'>
                      {dploading ? <Roundspinner /> :
                        <>
                          <p className='font-bold text-2xl'>
                            <AiOutlineCloudUpload />
                          </p>
                          <p className='text-sm'>Upload DP</p>
                        </>
                      }
                    </div>
                    <input type="file"
                      name='upload-dp'
                      onChange={uploadDP}
                      className='w-0 h-0'
                    />
                  </>
                )}
              </label>
              :
              <Link to={'/'} className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'>
                <img src={dpUrl} alt='DP' className='h-20 w-20 rounded-full' />
              </Link>
            }
          </>
          :
          <div className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'>
            {dploading ? <Roundspinner /> :
              <img src={logoImage} alt="logo-img" className='h-20 w-20 rounded-full' />
            }
          </div>
        }
        {wrongImageType &&
          <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in-out animate-bounce'>Upload correct file</p>
        }
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
      {user ? (
        <>
          <Link
            to={`user-profile/${user._id}`}
            className='flex gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 animate-slide-in mt-4 justify-center'
            onClick={handleCloseSidebar}
          >
            <img src={logoImage} className='w-10 h-10 rounded-full' alt='user profile' />
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
        </>)
        :
        <div className='flex mb-3 items-center gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 justify-between animate-slide-in my-1'>
          <Link to={'login'} className='cursor-pointer text-gray-500' >Login</Link>
          <Link to={'signup'} className='cursor-pointer text-gray-500'>Signup</Link>
        </div>
      }
    </div>
  )
}
