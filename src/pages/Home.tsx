import React from 'react';

const HomePage = () => {
  return (
    <div className='flex flex-col gap-4 bg-group-bg p-4 rounded-3xl'>
      <input 
        type='search' 
        placeholder='Search' 
        className='w-full h-10 bg-primary-bg border border-group-bg rounded-full p-2 hidden sm:block'
      />
    </div>
  )
};

export default HomePage;