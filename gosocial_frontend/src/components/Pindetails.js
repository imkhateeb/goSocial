import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import client from '../container/client';
import { urlFor } from '../container/client';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import Roundspinner from './Roundspinner';
import logoImage from '../assets/logo.png';
import MasonryLayout from './MasonryLayout';

export default function Pindetails({ user }) {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [validComment, setValidComment] = useState(true);
  const { pinId } = useParams();

  function addComment() {
    if (comment.replace("  ", " ").length >= 3) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        })
        .catch((console.error))
    } else {
      setValidComment(false);
      setTimeout(() => {
        setValidComment(true);
      }, 3000);
    }
  }

  // getting the pin's owner
  let postedByURL = null;
  if (pinDetail?.postedBy?.image) {
    postedByURL = urlFor(pinDetail?.postedBy.image)?.url();
  }

  //getting the pin detail and related pins
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);
    if (query) {
      client
        .fetch(query)
        .then((data) => {
          setPinDetail(data[0]);

          if (data[0]) {
            query = pinDetailMorePinQuery(data[0]);
            client
              .fetch(query)
              .then((res) => {
                setPins(res);
              }).catch((console.error))
          }
        }).catch((console.error))
    }
  }

  // when the pin detail will be changed
  useEffect(() => {
    fetchPinDetails();
  }, [pinId]) // This useEffecct will be in effect whenever pinId changes


  if (!pinDetail) {
    return <Spinner message={"Loading Pin..."} />
  }


  return (
    <>
      <div className='flex xl-flex-row flex-col m-auto bg-white p-5' style={{ maxWidth: '1500px', borderRadius: '32px' }}>

        <div className='flex justify-center items-center md:items-start flex-initial'>

          <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="pin-img"
            className='rounded-3xl max-h-[90vh]' />

        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <Link
                to={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-lg outline-none'
              >
                <MdDownloadForOffline />
              </Link>
            </div>
            {pinDetail?.destination && (
              <Link
                to={pinDetail.destination}
                target='_blank'
                rel='noreferrer'
                className='p-2 rounded-md hover:shadow-lg transition-all duration-400 ease-in'
              >
                {pinDetail.destination}
              </Link>
            )}
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>{pinDetail.title}</h1>
            <p className='mt-3'>{pinDetail.about}</p>
          </div>
        </div>
        <Link to={`/user-profile/${pinDetail?.postedBy?._id}`}
          className='flex gap-2 mb-2 ml-5 items-center bg-white rounded-lg'
        >
          {!postedByURL ?
            <img
              className='w-8 h-8 rounded-full object-cover'
              src={logoImage} // we have to change this by user image
              alt='user-profile'
            />
            :
            <img
              className='w-8 h-8 rounded-full object-cover'
              src={postedByURL} // we have to change this by user image
              alt='user-profile'
            />
          }

          <p className='font-semibold capitalize'>
            {pinDetail?.postedBy.userName}
          </p>
        </Link>

        <h2 className='mt-5 text-2xl'>Comments</h2>
        <div className='max-h-370 overflow-y-auto'>
          {!pinDetail.comments
            ?
            <div>Be the first one to comment...</div>
            :
            pinDetail?.comments?.map((comment, i) => (
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                <img src={!(comment.postedBy.image) ? logoImage : urlFor(comment.postedBy.image)?.url()} alt="user-dp" className='w-10 h-10 rounded-full cursor-pointer' />
                <div className='flex flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          {!validComment && <p className='text-red-500 mt-5 mb-0 text-center text-md transition-all duration-150 ease-in animate-bounce'>Comment should be greater than or equal to 3 letter</p>}


          {!user 
          ? 
          <Link to='/login'>Login to comment</Link> 
          : 
          <>
            <div className='flex flex-wrap mt-2 gap-3 max-md:flex-col '>
              <Link to={`/user-profile/${user?._id}`}
                className='flex gap-2 items-center bg-white rounded-lg'
              >
                <img
                  className='w-8 h-8 rounded-full object-cover'
                  src={!(user.image) ? logoImage :
                    urlFor(user.image).url()} // we have to change this by user image
                  alt='user-profile'
                />
              </Link>
              <input
                className='flex-1 gap-2 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                type='text'
                placeholder='Add a comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type='button' className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none' onClick={addComment}>
                {addingComment ? 'Adding comment...' : "Post"}
              </button>
            </div>

          </>}
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>More like this</h2>
          <MasonryLayout pins={pins} />
          <div className='flex flex-col items-center justify-center gap-2 mt-5 mb-3'>
            <Roundspinner />
            <p>It looks like we reach the end :)</p>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center my-3'>
          No Pins like this
        </div>
      )}
    </>
  )
}
