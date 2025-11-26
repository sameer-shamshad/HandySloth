import React from 'react';

const HomePage = () => {
  return (
    <>
      <input 
        type='search' 
        placeholder='Search' 
        className='w-full h-10 bg-primary-bg border border-group-bg rounded-full p-2 hidden sm:block'
      />
    </>
  )
};

export default HomePage;