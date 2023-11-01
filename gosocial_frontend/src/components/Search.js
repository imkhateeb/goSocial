import React, { useState, useEffect } from 'react';

import MasonryLayout from './MasonryLayout';
import client from '../container/client';
import { feedQuery } from '../utils/data';
import { searchQuery } from '../utils/data';
import Spinner from './Spinner';



export default function Search({ searchTerm }) {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingTag, setAddingTag] = useState(false);

  const userId = localStorage.getItem("userID");

  const handleAddTag = () => {
    setAddingTag(true);
    client
      .patch(userId)
      .setIfMissing({ tags: [] })
      .append('tags', [searchTerm])
      .commit()
      .then((response) => {
        setAddingTag(false);
      })
      .catch((error) => {
        setAddingTag(false);
      })
      .finally(()=>{
        window.location.reload();
      })
  }

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch(console.error);
    } else {
      setLoading(true);
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch(console.error)
    }
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message={"Searchin more pins..."} />}
      {pins?.length !== 0 && !loading && searchTerm.replace(" ", "").length !== 0 && (
        <div className='flex gap-3 items-center'>
          <h1 className='text-white text-xl font-bold'>Result for “{searchTerm}”</h1>
          <button
            type='button'
            className='py-1 px-3 rounded-md bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 text-black'
            onClick={handleAddTag}
            disabled={addingTag}
          >
            {addingTag ? 'Adding...' : 'Add this tag'}
          </button>
        </div>
      )}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && <div className='mt-10 text-center text-xl text-white'>No Pins found </div>}
    </div>
  )
}
