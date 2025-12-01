import { useNavigate } from 'react-router-dom';

const submitToolButtons = [
    { icon: 'add', title: 'Submit Tool' , path: '/submit/create-tool' },
    { icon: 'star', title: 'Get Featured' , path: '/submit/get-featured' },
    { icon: 'campaign', title: 'Custom Compaign' , path: '/submit/custom-campaign' },
    { icon: 'handshake', title: 'Sponsorship' , path: '/submit/sponsorship' },
]

const SubmitToolPage = () => {
  return (
    <section className='h-full w-full'>
        <h3 className='pb-3 text-xl font-medium text-primary-color'>Submit Your Tool</h3>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-2xl mx-auto'
        >
            {
                submitToolButtons.map((button: { icon: string, title: string, path: string }) => (
                    <SubmitToolButton key={button.title} icon={button.icon} path={button.path} title={button.title} />
                ))
            }
        </div>
    </section>
  );
};

const SubmitToolButton = ({ icon, title, path = '/' }: { icon: string, title: string, path: string }) => {
    const navigate = useNavigate();
    return (
        <button 
            type="button"
            onClick={() => navigate(path)}
            className='gap-2! flex-col h-30! lg:h-35! w-full! rounded-lg bg-primary-bg text-primary-color 
                font-medium text-sm p-4 border border-border-color cursor-pointer hover:bg-secondary-bg hover:text-primary-color'
        >
            <span className='material-symbols-outlined'>{icon}</span>
            <h3 className='font-bold text-base'>{title}</h3>
        </button>
    )
}

export default SubmitToolPage;