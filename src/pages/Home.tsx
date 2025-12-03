import ToolsOverview from '../components/Tools/ToolsOverview';
import RecentlyAdded from '../components/Tools/RecentlyAdded';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search tools"
          className="flex-1 rounded-full border border-border-color text-primary-color outline-0
            bg-primary-bg hidden xl:block px-8 py-3 text-lg outline-none focus:ring focus:ring-main-color/40"
        />
      </div>

      <ToolsOverview />
      <RecentlyAdded />
    </div>
  );
};

export default HomePage;