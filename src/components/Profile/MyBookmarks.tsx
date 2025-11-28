import React from 'react'

interface MyBookmarksProps {
    index: number;
    name: string;
    logo: string;
}

const myBookmarks = [
    {
      name: 'Tool 1',
      logo: 'https://via.placeholder.com/150',
    },
    {
      name: 'Tool 2',
      logo: 'https://via.placeholder.com/150',
    },
    {
      name: 'Tool 3',
      logo: 'https://via.placeholder.com/150',
    },
    {
      name: 'Tool 4',
      logo: 'https://via.placeholder.com/150',
    },
    {
      name: 'Tool 5',
      logo: 'https://via.placeholder.com/150',
    },
];

const MyBookmarks = () => {
    return (
        <div className='w-full flex flex-col gap-4 bg-primary-bg px-4 py-8 2xl:p-8 rounded-3xl'>
            <h3 className='text-primary-color text-md font-bold'>My Bookmarks</h3>
            {
                myBookmarks.length > 0 ? myBookmarks.map((bookmark, index) => (
                    <div 
                        key={bookmark.name}
                        className='flex items-center gap-2 border-b border-border-color last:border-b-0 pb-4'
                    >
                        <span className='text-secondary-color text-xs ml-4'>{index + 1}</span>
                        <img 
                            src={"https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"} 
                            alt={bookmark.name} 
                            className='w-7 h-7 md:w-10 md:h-10 rounded-full object-contain ml-10'
                        />
                        <h4 className='text-primary-color text-sm font-bold ml-4'>{bookmark.name}</h4>
                    </div>
                )) : (
                    <p>No bookmarks found</p>
                )
            }
        </div>
    );
};

export default MyBookmarks;