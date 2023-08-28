import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import client from '../container/client';
import {MasonryLayout, Spinner} from '../components';
import { feedQuery, searchQuery } from '../utils/data';
import Roundspinner from './Roundspinner';

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if ( categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data)=>{
        setPins(data);
        setLoading(false);
      })
    } else {
      client.fetch(feedQuery).then((data)=>{
        setPins(data);
        setLoading(false);
      })
    }
  }, [categoryId])
  
  if (!(pins?.length)){
    return (
      <div className='flex flex-col justify-center items-center'>
        <Roundspinner />
        <h2>No Pins available!</h2>
      </div>
    )
  }


  if(loading) return <Spinner message="We are adding new ideas to your feed!" />
  return (
    <div>
        {
          pins && <MasonryLayout pins={pins} />
        }
    </div>
  )
}
