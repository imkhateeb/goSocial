import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import client from '../container/client';
import { MasonryLayout, Spinner } from '../components';
import { feedQuery, searchQuery } from '../utils/data';
import { PiPushPinSimpleSlashFill } from 'react-icons/pi';

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      })
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      })
    }
  }, [categoryId]);


  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />
  } else if (!(pins?.length)) {
    return (
      <div className='flex flex-col justify-center items-center mt-20'>
        <PiPushPinSimpleSlashFill color='white' fontSize={50} />
        <h2 className='text-2xl font-semibold text-white my-5'>No Pins available!</h2>
      </div>
    )
  } else {
    return (
      <div>
        {
          pins && <MasonryLayout pins={pins} />
        }
      </div>
    )
  }
}
