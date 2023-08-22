import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import fetchUser from '../utils/fetchUser';
import client from '../container/client';
import { urlFor } from '../container/client';
import logoImage from '../assets/logo.png';


const user = await fetchUser();


export default function Pin({ pin: { postedBy, image, _id, destination, save } }) {
   // console.log("Posted by: ", postedBy._id);


   const navigate = useNavigate();
   const [postHovered, setPostHovered] = useState(false);
   const [savingPost, setSavingPost] = useState(false);
   const [deletingPost, setDeletingPost] = useState(false);

   // we are looping through save array to see if the post is already 
   const alreadySaved = !!((save?.filter((item) => item.postedBy._id === user?._id))?.length);

   async function savePin(pinId) {
      if (!alreadySaved) {
         setSavingPost(true);
         client
            .patch(pinId)  // patch this id
            .setIfMissing({ save: [] })  // Initialize save array as an empty array
            .insert('after', 'save[-1]', [{ // after the last indexed element meaning insert in last

               // document details according to the schema
               _key: uuidv4(),
               userId: user?._id,
               postedBy: {
                  _type: 'postedBy',
                  _ref: user?._id,
               }
            }])
            .commit()  // commit the patch and returns a promise that resolves to the first patched document
            .then(() => {
               window.location.reload();
               setSavingPost(false);
            })
      }
   }


   // getting the pin's owner
   let postedByURL = null;
   if (postedBy?.image) {
      postedByURL = urlFor(postedBy.image)?.url();
   }

   async function deletePin(pinId) {
      setDeletingPost(true);
      client.delete(pinId).then(() => {
         window.location.reload();
      })
      setDeletingPost(false);
   }
   return (
      <div className='m-2'>
         <div
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-details/${_id}`)}
            className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
         >
            <img
               className='rounded-lg w-full'
               alt='userPost'

               // below image is coming from Feed component by component drilling Feed->Masonarylayout->Pin
               src={urlFor(image).width(250).url()}
            />
            {
               postHovered && <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50' style={{ height: '100%' }}>
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
                     {(postedBy?._id === user?._id) ?
                        <button
                           type='button' className='bg-green-500 opacity-70 hover:opacity-100 font-bold px-5 text-white py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                           onClick={(e) => e.stopPropagation()}
                        > Owner </button>
                        :
                        alreadySaved ?
                           <button
                              type='button' className='bg-red-500 opacity-70 hover:opacity-100 font-bold px-5 text-white py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                              onClick={(e) => e.stopPropagation()}
                           >
                              {save?.length} Saved</button>
                           :
                           <button
                              type='button' className='bg-red-500 opacity-70 hover:opacity-100 font-bold px-5 text-white py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                              onClick={(e) => {
                                 e.stopPropagation()
                                 savePin(_id)
                              }}
                           >{savingPost ? 'Saving...' : 'Save'}</button>}
                  </div>
                  <div className='flex justify-between items-center gap-2 w-full'>
                     {destination && (
                        <Link
                           to={destination}
                           target='_blank'
                           rel='noreferrer'
                           className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md'
                        >
                           <BsFillArrowUpRightCircleFill />
                           {destination.length > 20 ? destination.slice(8, 20) : destination.slice(8)}
                        </Link>
                     )}
                     {postedBy?._id === user?._id &&
                        <button
                           type='button'
                           className='bg-white p-2 opacity-70 hover:opacity-100 font-bold font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none'
                           onClick={(e) => {
                              e.stopPropagation()
                              deletePin(_id)
                           }}
                        >
                           {deletingPost ? 'Deleting...' : <AiTwotoneDelete />}
                        </button>

                     }
                  </div>
               </div>
            }
         </div>
         <Link to={`/user-profile/${user?._id}`}
            className='flex gap-2 mt-2 items-center '
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
               {postedBy.userName}
            </p>
         </Link>
      </div>
   )
}
