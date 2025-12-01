import { useNavigate } from 'react-router-dom';

const ToolNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h3 className='pb-2 text-xl font-medium text-primary-color'>404 - Tool Not Found</h3>
            <p className='text-sm text-primary-color pb-12'>The tool you are looking for does not exist or has been removed.</p>
            <button 
                type='button'
                onClick={() => navigate('/')}
                className='bg-main-color! text-black-color! px-8! py-2! rounded-full!'
            >
                Go Back Home
            </button>
        </div>
    );
};

export default ToolNotFound;

