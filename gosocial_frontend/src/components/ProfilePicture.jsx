import React, { useState, useEffect } from 'react';
import logoImage from '../assets/logo.png';
import client from '../container/client';
import { urlFor } from '../container/client';
import Roundspinner from './Roundspinner';
import { AiOutlineCloudUpload } from 'react-icons/ai';

export default function ProfilePicture({ userId, height, width, rounded, isUploadActive, classNames }) {
  const [dploading, setDploading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [dpChangeOptions, setDpChangeOptions] = useState(false);
  const [user, setUser] = useState(null);



  useEffect(() => {
    client.fetch(`*[_type == "user" && _id == '${userId}']`)
      .then((data) => {
        setUser(data[0]);
      })
      .catch((console.error))
  }, [userId]);

  // logic to check if DP was present or not
  let dpUrl = null;
  if (user?.image) {
    const dp = urlFor(user.image);
    dpUrl = dp?.url();
  }
  // console.log(dpUrl && dpUrl);


  useEffect(() => {
    setTimeout(() => {
      setDploading(false);
    }, 1000);
  }, []);

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


  function deleteDisplayPicture() {
    console.log("Inside delete DP");
    setDpChangeOptions(false);
  }

  function changeDisplayPicture() {
    console.log("Inside change DP");
    setDpChangeOptions(false);
  }

  const style = {
    dpStyle: `h-${!height ? 20 : height} w-${!width ? 20 : width} rounded-${!rounded ? 'full' : rounded} ${classNames && classNames} cursor-pointer`
  }


  return (
    <>
      {!user ?
        <div className='flex justify-center'>
          {dploading ? <Roundspinner /> :
            <img src={logoImage} alt="logo-img" className={`${style.dpStyle} border-[0.5px] border-red-500`} />
          }
        </div>
        :
        <div className='flex flex-col items-center justify-center'>
          {isUploadActive && dpUrl &&
            <>
              <label>
                {loading ? <Roundspinner /> : (
                  <>
                    <div className='h-20 w-20 flex flex-col justify-center items-center bg-gray-300 rounded-full'
                      onClick={() => setDpChangeOptions(!dpChangeOptions)}>
                      {dploading ? <Roundspinner /> :
                        <img src={dpUrl} alt='DP' className={`${style.dpStyle} border-[0.5px] border-red-500`} />
                      }
                    </div>
                  </>
                )}
              </label>
              {dpChangeOptions &&
                <div className='rounded-lg flex gap-3 my-3 justify-evenly items-center animate-fade-in transition-all duration-300 ease-in'>
                  <button type='button' className='outline-none rounded-lg text-[12px] hover:shadow-md text-red-600 font-bold' onClick={deleteDisplayPicture}>Delete</button>

                  <label className='flex items-center cursor-pointer outline-none rounded-lg text-[12px] hover:shadow-md text-white font-bold'>
                    Change
                    <input type="file"
                      name='change-dp'
                      onChange={changeDisplayPicture}
                      className='w-0 h-0'
                    />
                  </label>

                  <button type='button' className='outline-none rounded-lg text-[12px] hover:shadow-md text-blue-500 font-bold' onClick={() => setDpChangeOptions(false)}>Cancel</button>
                </div>
              }
            </>
          }{isUploadActive && !dpUrl &&
            <label>
              {loading ? <Roundspinner /> : (
                <>
                  <div className='h-20 w-20 flex flex-col justify-center items-center bg-gray-300 rounded-full'>
                    {dploading ? <Roundspinner /> :
                      <>
                        <p className='font-bold text-2xl'>
                          <AiOutlineCloudUpload color='black' />
                        </p>
                        <p className='text-sm text-black'>Upload DP</p>
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
          }{dpUrl && !isUploadActive &&
            <img src={dpUrl} alt='DP' className={`${style.dpStyle} border-[0.5px] border-red-500`} />
          }{!dpUrl && !isUploadActive &&
            <img src={logoImage} alt="logo-img" className={`${style.dpStyle} border-[0.5px] border-red-500`} />
          }
        </div>

      }{wrongImageType &&
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in-out animate-bounce'>Upload correct file</p>
      }
    </>
  )
}
