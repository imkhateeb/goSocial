import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { PoweroffOutlined } from '@ant-design/icons';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import client from '../container/client';
import { urlFor } from '../container/client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import ProfilePicture from './ProfilePicture';

const randomImage = 'https://source.unsplash.com/1600x900/?technology';

const activeBtnStyles = 'bg-gradient-to-t from-blue-900 to-black text-white font-bold py-2 px-4 rounded-full outline-none transition-all duration-500 ease-in';

const notActiveBtnStyles = 'bg-primary mr-4 text-gray-300 font-bold py-2 px-4 rounded-full outline-none transition-all duration-300 ease-in';

export default function Userprofile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  const [confirmLogout, setConfirmLogout] = useState(false);

  function handleLogout() {
    localStorage.removeItem('userID');
    localStorage.clear();
    setConfirmLogout(false);
    navigate("/");
    window.location.reload();
  }


  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
      .catch((console.error));
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery)
        .then((data) => setPins(data))
        .catch(console.error)
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery)
        .then((data) => setPins(data))
        .catch(console.error)
    }

  }, [text, userId]); // whenever the text or userId changes



  if (!user) {
    return (
      <Spinner message="Loading profile..." />
    )
  }


  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img src={randomImage} className='w-full h-[30vh] 2xl:h-[40vh] shadow-lg object-cover' alt='random-img' />
            <ProfilePicture
              height={20}
              width={20}
              isUploadActive={false}
              classNames="shadow-2xl -mt-10 object-cover"
              rounded="full"
              userId={user?._id}
            />
            <h1 className='font-bold text-3xl text-center mt-3 text-white'> {user.userName} </h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === localStorage.getItem("userID") && (
                confirmLogout ?
                  (
                    <div className='flex items-center rounded-full shadow-lg animate-fade-in duration-300 ease-linear w-full'>
                      <button className='py-2 px-4 rounded-l-full outline-none bg-red-600 shadow-lg hover:shadow-sm hover:bg-red-500 cursor-pointer transition-all duration-200 text-white' onClick={handleLogout}>Confirm</button>
                      <button className='py-2 px-5 rounded-r-full outline-none bg-blue-600 shadow-lg hover:shadow-sm hover:bg-blue-500 cursor-pointer transition-all duration-200 text-white' onClick={() => setConfirmLogout(false)}>Cancel</button>
                    </div>
                  ) : (
                    <div className='p-4 rounded-full flex items-center justify-center outline-none bg-red-600 hover:bg-red-500 shadow-lg cursor-pointer transition-all duration-200 text-white w-full'
                      onClick={() => setConfirmLogout(!confirmLogout)}
                    ><AiOutlineLogout className='text-white text-xl' />
                    </div>
                  )
              )}
            </div>
          </div>
          <div className='text-center mb-7 mt-4'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('created')
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('saved')
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>


          {/* Fix this to show the personalize pins only */}
          {pins?.length > 0 ?
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
            :
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2 text-white'>No pins found</div>
          }
        </div>
      </div>
    </div>
  )
}
