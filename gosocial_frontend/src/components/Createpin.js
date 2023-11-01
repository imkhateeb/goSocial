import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import client from '../container/client';
import Spinner from './Spinner';
import ProfilePicture from './ProfilePicture';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import Roundspinner from './Roundspinner';


export default function Createpin({ user }) {
  const navigate = useNavigate();

  // states
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState('');
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function uploadImage(e) {
    // take the type of image file
    const { type, name } = e.target.files[0];
    // console.log(name);
    // check if correct image is taken or not
    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false);

      // start working on the iamge
      setLoading(true);

      client.assets
        // .upload('type of asset', 'body', 'options')
        .upload('image', e.target.files[0], { contentType: type, filename: name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Image upload error ", error);
        })
    } else {
      wrongImageType(true)
    }
  }

  const savePin = () => {

    if (title && about && imageAsset?._id && category) {
      setSaving(true);
      setFields(false);
      const doc = {
        _id: uuidv4(),
        _type: 'pin',   // specifying the schema type to which doc will be saved
        title,   // if key value is same then we can write like this
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      }

      client.createIfNotExists(doc).then(() => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => {
          navigate('/')
        }, 3000);
      });
    } else {

      // to give a warning to fill all the fields
      setFields(true);

      // after 2 sec it will be again gone
      setTimeout(() => {
        setFields(false);
      }, 3000);
    }
  }

  if (saving) {
    <Spinner message={"Saving your pin"} />
  }

  if (saved) {
    <div className='flex flex-col justify-center items-center w-full min-h-[80vh] gap-5'>
      <IoCheckmarkDoneCircle fontSize={50} className='text-green-600' />
      <p className='text-xl font-bold text-center px-2 text-white'>Your pin is saved</p>
    </div>
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in animate-bounce'>Please fill in all the fields</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-gradient-to-t from-blue-950 to-black lg:p-5 p-3 lg:w-4/5 w-full rounded-lg'>
        <div className='bg-blue-950 p-3 flex flex-0.7 w-full rounded-lg'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420 rounded-lg'>
            {loading &&
              <div className='h-full w-full flex items-center justify-center'>
                <Roundspinner />
              </div>}
            {wrongImageType && <p>wrong image type!!</p>}
            {!imageAsset && !loading ? (
              <label className='cursor-pointer'>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload color='white' />
                    </p>
                    <p className='text-lg text-white'>Click to upload</p>
                  </div>
                  <p className='mt-32 text-gray-400'>
                    Use high-quality JPG, SVG, PNG, GIF less than 20MB
                  </p>
                </div>
                {/* Providing the input to the entire rectangle */}
                <input type="file"
                  name='upload-image'
                  onChange={uploadImage}
                  className='w-0 h-0'
                />
              </label>
            ) : (<div className='relative h-5/6'>
              <img src={imageAsset?.url} alt="uploaded-pic" className='h-full w-full rounded-lg' />
              <button
                type='button'
                className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                onClick={() => setImageAsset(null)}
              >
                <MdDelete />
              </button>
            </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title here'
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 bg-transparent border-gray-200 p-2 text-white'
          />
          {user && (
            <div className='flex gap-2 my-2 items-center bg-transparent text-white rounded-lg'>
              <ProfilePicture
                width={10}
                height={10}
                isUploadActive={false}
                rounded={'full'}
                userId={user?._id}
              />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}
          <input
            type='text'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='What is your pin about?'
            className='outline-none text-base sm:text-lg bg-transparent border-b-2 border-gray-200 p-2 text-white'
          />
          <input
            type='text'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add your destination here'
            className='outline-none text-base sm:text-lg bg-transparent border-b-2 border-gray-200 p-2 text-white'
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl text-white'>
                category <span className='text-red-500'>*</span>
              </p>
              <input
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder='Add your category here'
                className='outline-none text-base sm:text-lg bg-transparent border-b-2 border-gray-200 p-2 text-white'
              />
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button type='button'
                onClick={savePin}
                className='text-white bg-gradient-to-t from-black to-blue-900 hover:text-gray-300 transition-all duration-300 ease-linear font-bold p-2 rounded-full w-28 outline-none'
              >Save Pin</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
