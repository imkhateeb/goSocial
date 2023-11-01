import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import fetchUser from '../utils/fetchUser';
import client from '../container/client';
import { urlFor } from '../container/client';
import logoImage from '../assets/logo.png';
import Roundspinner from './Roundspinner';
import { FaUserCheck } from 'react-icons/fa';

export default function Pin({ pin: { postedBy, image, _id, destination, save, about } }) {
  const navigate = useNavigate();
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [unSaving, setUnSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [savedPin, setSavedPin] = useState(null);
  const [saved, setSaved] = useState(save)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await fetchUser();
        setUser(data);
        setLoading(false);

        const alreadySavedCheck = !!saved?.find(item => item.postedBy?._id === data?._id);
        setAlreadySaved(alreadySavedCheck);

        if (alreadySavedCheck) {
          const savedPinItem = saved?.find(item => item.postedBy?._id === data?._id);
          setSavedPin(savedPinItem);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [saved]);

  const handleSavePin = async (pinId) => {
    if (!alreadySaved) {
      setSavingPost(true);
      try {
        await client.patch(pinId)
          .setIfMissing({ save: [] })
          .insert('after', 'save[-1]', [{
            _key: uuidv4(),
            userId: user?._id,
            postedBy: {
              _type: 'postedBy',
              _ref: user?._id,
            }
          }])
          .commit();
        setAlreadySaved(true);
      } catch (error) {
        console.error("Error saving pin:", error);
      } finally {
        setSavingPost(false);
      }
    }
  };

  const handleUnSavePin = async (pinId, pinKey) => {
    if (alreadySaved) {
      setUnSaving(true);
      try {
        await client.patch(pinId)
          .unset([`save[_key == '${pinKey}']`])
          .commit();
        setAlreadySaved(false);
        const updatedSave = save.filter(item => item._key !== pinKey);
        setSavedPin(null);
        setSaved(updatedSave);
      } catch (error) {
        console.error("Error un-saving pin:", error);
      } finally {
        setUnSaving(false);
      }
    }
  };

  const handleDeletePin = async (pinId) => {
    setDeletingPost(true);
    try {
      await client.delete(pinId);
    } catch (error) {
      console.error("Error deleting pin:", error);
    } finally {
      window.location.reload();
    }
  };

  const postedByURL = postedBy?.image ? urlFor(postedBy.image)?.url() : null;

  return (
    <div className='m-3 bg-white shadow-xl hover:shadow-md transition-all duration-300 ease-in-out rounded-lg border-[0.2px] border-pink-400'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => !user && !loading ? navigate('/login') : navigate(`/pin-details/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        <img
          className='w-full rounded-t-lg rounded-b-none'
          alt='userPost'
          src={urlFor(image).width(250).url()}
        />
        {postHovered && localStorage.getItem("userID") && (
          <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <Link
                  to={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline />
                </Link>
              </div>
              {!loading ?
                (postedBy?._id === user?._id) ? (
                  <button
                    type='button' className='bg-green-500 opacity-70 hover:opacity-100 font-bold px-5 text-white py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                    onClick={(e) => e.stopPropagation()}
                  > Owner </button>
                ) : alreadySaved ? (
                  <button
                    type='button' className='bg-yellow-300 opacity-70 hover:opacity-100 font-bold px-5 text-black py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnSavePin(_id, savedPin?._key);
                    }}
                  >
                  {unSaving ? 'Unsaving...' : 'Unsave'}
                  </button>
                ) : (
                  <button
                    type='button' className='bg-red-500 opacity-70 hover:opacity-100 font-bold px-5 text-white py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSavePin(_id);
                    }}
                  >
                    {savingPost ? 'Saving...' : 'Save'}
                  </button>
                )
                : <Roundspinner />}
            </div>
            <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <Link
                  to={destination}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20 ? `${destination.slice(8, 20)}...` : destination.slice(8)}
                </Link>
              )}
              {postedBy?._id === user?._id &&
                <button
                  type='button'
                  className='bg-white p-2 opacity-70 hover:opacity-100 font-bold font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePin(_id);
                  }}
                >
                  {deletingPost ? 'deleting...' : <AiTwotoneDelete />}
                </button>
              }
            </div>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-1 py-3 px-4 '>
        <Link to={`/user-profile/${user?._id}`}>
          <img
            className='w-8 h-8 rounded-full object-cover'
            src={postedByURL || logoImage}
            alt='user-profile'
          />
        </Link>
        <Link to={`/user-profile/${user?._id}`} className='text-black font-bold'>
          {postedBy.userName}
        </Link>
        <p className='text-gray-400 text-xs'>{about}</p>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-bold'>{save?.length || 0}</span><FaUserCheck />
        </div>
      </div>
    </div>
  );  
}