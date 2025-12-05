import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ToolList from '../components/Profile/ToolList';
import { useTools } from '../context/ToolsProvider';
import ProfileCard from '../components/Profile/ProfileCard';
import ProfileStatsCard, { ProfileStatsCardSkeleton } from '../components/Profile/ProfileStatsCard';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearUserData } from '../store/features/userReducer';
import { fetchToolsByIds } from '../services/tools.service';
import { useAuth } from '../hooks/useAuth';

const profileStats = [
  {
    icon: "tools",
    label: 'Tools',
    value: 0, // Will be updated from Redux userReducer
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
  const dispatch = useAppDispatch();
  const { state: toolsState } = useTools();
  const { isAuthenticated, accessToken } = useAuth();
  const { tools: userToolIds, bookmarkedTools: bookmarkedToolIds } = useAppSelector((state) => state.user);
  const [bookmarkedToolsForDisplay, setBookmarkedToolsForDisplay] = useState<Array<{ name: string; logo: string }>>([]);

  // // Clear user data if user is not authenticated and has no tokens
  // useEffect(() => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const refreshToken = localStorage.getItem('refreshToken');
    
  //   if (!isAuthenticated && !accessToken && !refreshToken) {
  //     // Clear user data if not authenticated and no tokens exist
  //     if (userToolIds.length > 0 || bookmarkedToolIds.length > 0) {
  //       dispatch(clearUserData());
  //     }
  //   }
  // }, [isAuthenticated, userToolIds.length, bookmarkedToolIds.length, dispatch]);

  // // Fetch first 5 bookmarked tools for display
  // useEffect(() => {
  //   const fetchBookmarksForDisplay = async () => {
  //     if (bookmarkedToolIds.length === 0) {
  //       setBookmarkedToolsForDisplay([]);
  //       return;
  //     }

  //     try {
  //       const firstFiveIds = bookmarkedToolIds.slice(0, 5);
  //       const tools = await fetchToolsByIds(firstFiveIds);
  //       setBookmarkedToolsForDisplay(tools.map(tool => ({
  //         name: tool.name,
  //         logo: tool.logo,
  //       })));
  //     } catch (error) {
  //       console.error('Failed to fetch bookmarked tools for display:', error);
  //       setBookmarkedToolsForDisplay([]);
  //     }
  //   };

  //   fetchBookmarksForDisplay();
  // }, [bookmarkedToolIds]);

  const toolsCount = userToolIds.length;
  const bookmarksCount = bookmarkedToolIds.length;

  // Update tools count and bookmarks count dynamically
  const updatedProfileStats = profileStats.map(stat => {
    if (stat.icon === "tools") {
      return { ...stat, value: toolsCount };
    }
    if (stat.icon === "bookmarks") {
      return { ...stat, value: bookmarksCount };
    }
    return stat;
  });

  // Get recent tools from ToolMachine (first 5 for recently viewed)
  const recentlyViewed = toolsState.context.recentTools.slice(0, 5).map(tool => ({
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
                                onClick={
                                  stat.icon === "tools" 
                                    ? () => navigate('/my-tools') 
                                    : stat.icon === "bookmarks"
                                    ? () => navigate('/my-bookmarks')
                                    : undefined
                                }
                            />
                        ))
                    ) : (
                        <p>No stats found</p>
                    )
                }
            </div>
        </div>

        <ToolList tools={bookmarkedToolsForDisplay} label="My Bookmarks" />
        <ToolList tools={recentlyViewed} label="Recently Viewed" />

        <div className='flex flex-col gap-0 text-secondary-color'>
            <p>Help us understand how we're doing</p>
            <p>Based on your experience so far, how would you rate us?</p>

            <div className='flex items-center gap-2 mt-2'>
                {
                    Array.from({ length: 5 }).map((_, index) => (
                        <span key={`star-${index}`} className='material-symbols-outlined'>star</span>
                    ))
                }
            </div>
        </div>
    </div>
  );
};

export default DashboardPage;