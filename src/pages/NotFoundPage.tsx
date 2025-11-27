import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>404</h3>
        <h4 className='pb-4 text-lg font-medium text-primary-color'>Page Not Found</h4>
        <p className='text-sm text-primary-color'>The page you are looking for does not exist.</p>
        <button 
            type='button'
            onClick={() => navigate('/')}
            className='bg-main-color text-black-color px-4 py-2 rounded-lg'>Go Back</button>
    </div>
  )
}

export default NotFoundPage