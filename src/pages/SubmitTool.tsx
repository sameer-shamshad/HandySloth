const submitToolButtons = [
    { icon: 'add', title: 'Submit Tool' },
    { icon: 'star', title: 'Get Featured' },
    { icon: 'campaign', title: 'Custom Compaign' },
    { icon: 'handshake', title: 'Sponsorship' },
]

const SubmitToolPage = () => {
  return (
    <section className='h-full w-full'>
        <h3 className='pb-3 text-xl font-medium text-primary-color'>Submit Your Tool</h3>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-2xl mx-auto'
        >
            {
                submitToolButtons.map((button: { icon: string, title: string }) => (
                    <SubmitToolButton key={button.title} icon={button.icon} title={button.title} />
                ))
            }
        </div>
    </section>
  );
};

const SubmitToolButton = ({ icon, title }: { icon: string, title: string }) => {
    return (
        <button 
            type="button"
            className='gap-2! flex-col h-30! lg:h-35! w-full! rounded-lg bg-primary-bg text-primary-color 
                font-medium text-sm p-4 border border-border-color cursor-pointer hover:bg-secondary-bg hover:text-primary-color'
        >
            <span className='material-symbols-outlined'>{icon}</span>
            <h3 className='font-bold text-base'>{title}</h3>
        </button>
    )
}

export default SubmitToolPage;