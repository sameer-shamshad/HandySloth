import ToolsGrid from '../components/Tools/ToolsGrid';
import { useAppSelector } from '../store/hooks';

const MyBookmarksPage = () => {
    const { bookmarkedTools } = useAppSelector((state) => state.user);

    return (
      <div className='h-full'>
          <h3 className='pb-4 text-xl font-medium text-primary-color'>My Bookmarks</h3>
          <ToolsGrid tools={bookmarkedTools} tag="index" />
      </div>
    );
};

export default MyBookmarksPage;

