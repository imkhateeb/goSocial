import React, { Suspense } from 'react';
import Masonry from 'react-masonry-css';
import PinLoading from './LoadingStates/PinLoading';
const Pin = React.lazy(() => import('./Pin'));

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
}


export default function MasonryLayout({ pins }) {
  return (
    <Masonry
      className='flex animate-slide-fwd'
      breakpointCols={breakpointObj}
    >
      {pins?.map((pin) =>
        <Suspense key={pin?._id} fallback={<PinLoading />}>
          <Pin
            pin={pin}
            className="w-max"
          />
        </Suspense>
      )}
    </Masonry>
  )
}
