interface ProfileStatsCardProps {
    label: string;
    value: number;
    iconName: "tools" | "votes" | "bookmarks" | "comments";
    onClick?: () => void;
}

const ProfileStatsCard = ({ label, value, iconName, onClick }: ProfileStatsCardProps) => {
    return (
        <div 
            onClick={onClick}
            className={`w-full flex items-center gap-6 xl:gap-4 bg-primary-bg dark:bg-group-bg sm:dark:bg-primary-bg p-6 2xl:p-8 rounded-xl ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        >
            <span className='text-main-color xl:[&>svg]:w-6 xl:[&>svg]:h-6'>{icon[iconName as keyof typeof icon]}</span>
            <div className='flex flex-col'>
                <span className='text-secondary-color text-sm -mb-2'>{label}</span>
                <p className='text-primary-color text-lg font-bold'>{value}</p>
            </div>
        </div>
    )
};

const icon = {
    "tools": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-tools" viewBox="0 0 16 16">
                <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
            </svg>,
    "votes": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-archive-fill" viewBox="0 0 16 16">
                <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z"/>
            </svg>,
    "bookmarks": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
            </svg>,
    "comments": <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chat-square-dots-fill" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                </svg>
}

export const ProfileStatsCardSkeleton = () => {
    return (
        <div className='flex items-center gap-6 bg-primary-bg mx-4 p-6 rounded-xl animate-pulse'>
            <div className='w-8 h-8 rounded bg-primary-color/20' />
            <div className='flex flex-col gap-2'>
                <div className='h-3 w-20 rounded bg-primary-color/20' />
                <div className='h-6 w-12 rounded bg-primary-color/30' />
            </div>
        </div>
    );
};

export default ProfileStatsCard;