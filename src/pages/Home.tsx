import ToolsOverview from '../components/Tools/ToolsOverview';
import RecentlyAdded from '../components/Tools/RecentlyAdded';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search tools"
          className="h-12 flex-1 rounded-full border border-group-bg bg-primary-bg hidden 2xl:block px-5 text-sm outline-none focus:ring-2 focus:ring-main-color/40"
        />
      </div>

      <ToolsOverview />
      <RecentlyAdded />
    </div>
  );
};

export default HomePage;