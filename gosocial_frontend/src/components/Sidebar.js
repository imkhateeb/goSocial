import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FcHome } from 'react-icons/fc';
import { MdDelete } from 'react-icons/md';
import client from '../container/client';
import Roundspinner from './Roundspinner';
import ProfilePicture from './ProfilePicture'; // Make sure to import ProfilePicture component

export default function Sidebar({ closeToggle }) {
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);
  const [gettingTags, setGettingTags] = useState(true);
  const [deleteTag, setDeleteTag] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await client.fetch(`*[_type == 'user' && _id == $user_id][0]`, {
          user_id: localStorage.getItem("userID")
        });
        setUser(userData);

        const tagData = await client.fetch(`*[_type == 'user' && _id == $user_id] | order(_createdAt desc) | { tags[] }`, {
          user_id: localStorage.getItem("userID")
        });
        setTags(tagData[0]?.tags || []);
      } catch (error) {
        console.error(error);
      } finally {
        setGettingTags(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteTag = (tag) => {
    try {
      const updatedUser = { ...user };
      updatedUser.tags = user.tags.filter((t) => t !== tag);
      setUser(updatedUser);
      setDeleteTag(null);

      client
        .patch(user._id)
        .setIfMissing({ tags: [] })
        .set({ tags: updatedUser.tags })
        .commit()
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error removing the tag:', error);
        });
    } catch (error) {
      console.error('Error handling tag deletion:', error);
    }
  };

  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className='flex flex-col bg-gradient-to-tr from-black to-blue-950 h-full md:w-[260px] text-white flex items-center'>
      <div className='flex flex-col'>
        <div className='flex flex-col gap-2 m-3 w-190 justify-center items-center'>
          <ProfilePicture
            height={20}
            width={20}
            rounded={'full'}
            isUploadActive={true}
            userId={user && user._id}
          />
          <div />
          <NavLink to={'/'} onClick={handleCloseSidebar}>
            <FcHome className='text-5xl font-bold' />
          </NavLink>
        </div>
      </div>

      <div className='h-[0.5px] border-[1px] border-gray-500 my-2 w-5/6' />

      {localStorage.getItem("userID") ?
        (gettingTags ? (
          <Roundspinner />
        ) : (
          <div className='flex flex-wrap gap-[5px] py-2 px-4'>
            {tags.length !== 0 &&
              tags.length <= 10 &&
              user &&
              tags.map((tag, index) => (
                <span key={tag + index} className='text-sm cursor-pointer bg-blue-600 rounded-full flex items-center gap-2 px-3'>
                  <NavLink to={`/category/${tag.toLowerCase()}`} className='py-2'>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </NavLink>
                  <MdDelete className='text-red-500 hover:text-red-400 text-2xl font-semibold' onClick={() => setDeleteTag({ tag, index })} />
                </span>
              ))
            }
            {!gettingTags && tags.length === 0 && (
              <h1 className='flex flex-col items-center text-lg font-bold'><Link to={"/search"} className='text-blue-300 underline'>Search</Link><span>and</span><span>add</span><span>tags</span></h1>
            )}
          </div>
        )) : (
          <div className='py-2 px-5 flex flex-col'>
            <h2 className='text-3xl font-semibold text-white'>Hello user,</h2>
            <h2 className='text-3xl font-semibold text-white'>Welcome to</h2>
            <h1 className='text-5xl font-bold text-yellow-400'>goSocial</h1>
            <p className='my-2 text-gray-400'>A modern and interactive, image sharing social media application.</p>
            <p className='my-2 text-gray-400'>Get in and delve in the community of eye pleasing pictures with features like creating post, editing it, saving it and if something went wrong then delete it.</p>
            <div className='flex flex-col gap-2 justify-center'>
              <Link to='/signup' className='underline text-blue-500 hover:text-blue-400 duration-200 transition-all ease-linear'>New user?</Link>
              <Link to='/login' className='underline text-yellow-400 hover:text-yellow-300 duration-200 transition-all ease-linear'>Already a user?</Link>
            </div>
          </div>
        )}

      {deleteTag !== null && (
        <div className='absolute top-0 bottom-0 right-0 left-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center'>
          <p className='text-2xl font-bold'>You want to delete this tag?</p>
          <div className='flex gap-3 my-2'>
            <button
              className='py-1 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white'
              onClick={() => {
                handleDeleteTag(deleteTag.tag);
                setDeleteTag(null);
              }}
            >
              Yes
            </button>
            <button
              className='py-1 px-3 rounded-md bg-red-600 hover:bg-red-500 text-white'
              onClick={() => setDeleteTag(null)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className='fixed bottom-5 flex flex-col gap-1 items-center justify-center'>
          <Link
            to={`user-profile/${user._id}`}
            className='flex gap-2 items-center bg-black rounded-full shadow-lg animate-slide-in justify-center w-full'
            onClick={handleCloseSidebar}
          >
            <ProfilePicture
              height={10}
              width={10}
              rounded={'full'}
              isUploadActive={false}
              userId={user && user._id}
            />
            <p className='text-white text-center py-3 px-5'>{user.userName}</p>
          </Link>
        </div>
      )}
    </div>
  );
}
