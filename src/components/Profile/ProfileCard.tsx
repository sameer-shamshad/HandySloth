import React from 'react'

const ProfileCard = () => {
    return (
        <div className='w-max flex xl:flex-col items-center xl:items-center gap-4 xl:gap-1'>
            <img 
                src="https://i.pravatar.cc/150?img=1" 
                alt="profile" 
                className='w-10 h-10 rounded-full object-cover'
            />
            <div className='flex flex-col xl:items-center'>
                <h4 className='text-primary-color text-sm font-bold dark:text-main-color'>John Doe</h4>
                <p className='text-secondary-color text-xs w-max'>Joined Nov 2024</p>
            </div>
        </div>
    )
}

export default ProfileCard