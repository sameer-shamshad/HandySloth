import ToolsOverview from '../components/Tools/ToolsOverview';
import RecentlyAdded from '../components/Tools/RecentlyAdded';
import SearchBar from '../components/SearchBar/SearchBar';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <SearchBar />
      </div>

      <ToolsOverview />
      <RecentlyAdded />
    </div>
  );
};

export default HomePage;