import { tools } from '../dummy-data/tools';
import { useNavigate } from 'react-router-dom';
import ToolList from '../components/Profile/ToolList';
import { useMyTools } from '../context/MyToolsProvider';
import ProfileCard from '../components/Profile/ProfileCard';
import ProfileStatsCard, { ProfileStatsCardSkeleton } from '../components/Profile/ProfileStatsCard';

const profileStats = [
  {
    icon: "tools",
    label: 'Tools',
    value: 0, // Will be updated from MyToolMachine
  },
  {
    icon: "bookmarks",
    label: 'Bookmarks',
    value: 10,
  },
  {
    icon: "votes",
    label: 'Votes',
    value: 23,
  },
  {
    icon: "comments",
    label: 'Comments',
    value: 12,
  },
];

const DashboardPage = () => {
  const isLoading = false; // Set to true when fetching data
  const navigate = useNavigate();
  const { state: myToolsState } = useMyTools();

  const userTools = myToolsState.context.tools;
  const toolsCount = userTools.length;

  // Update tools count dynamically
  const updatedProfileStats = profileStats.map(stat => 
    stat.icon === "tools" ? { ...stat, value: toolsCount } : stat
  );

  // Get first 5 tools for bookmarks and next 5 for recently viewed
  const myBookmarks = tools.slice(0, 5).map(tool => ({
    name: tool.name,
    logo: tool.logo,
  }));

  const recentlyViewed = tools.slice(5, 10).map(tool => ({
    name: tool.name,
    logo: tool.logo,
  }));

  return (
    <div className='flex flex-col gap-8 xl:gap-10'>
        <h3 className='hidden md:block mb-9 text-primary-color text-xl'>Dashboard</h3>
        <div className='flex flex-col gap-6 xl:flex-row xl:gap-10 px-4'>
            <ProfileCard />

            <div className='w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-4'>
                {
                    isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <ProfileStatsCardSkeleton key={`stats-skeleton-${index}`} />
                        ))
                    ) : updatedProfileStats.length > 0 ? (
                        updatedProfileStats.map((stat) => (
                            <ProfileStatsCard 
                                key={stat.label} 
                                label={stat.label} 
                                value={stat.value} 
                                iconName={stat.icon as "tools" | "votes" | "bookmarks" | "comments"}
                                onClick={stat.icon === "tools" ? () => navigate('/my-tools') : undefined}
                            />
                        ))
                    ) : (
                        <p>No stats found</p>
                    )
                }
            </div>
        </div>

        <ToolList tools={myBookmarks} label="My Bookmarks" />
        <ToolList tools={recentlyViewed} label="Recently Viewed" />

        <div className='flex flex-col gap-0 text-secondary-color'>
            <p>Help us understand how we're doing</p>
            <p>Based on your experience so far, how would you rate us?</p>

            <div className='flex items-center gap-2 mt-2'>
                {
                    Array.from({ length: 5 }).map(() => (
                        <span className='material-symbols-outlined'>star</span>
                    ))
                }
            </div>
        </div>
    </div>
  );
};

export default DashboardPage;