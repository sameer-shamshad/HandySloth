import ToolsOverview from '../components/Tools/ToolsOverview';
import RecentlyAdded from '../components/Tools/RecentlyAdded';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search tools"
          className="flex-1 rounded-full text-primary-color outline-0
            bg-primary-bg hidden xl:block px-8 py-3 text-lg outline-none shadow-[0_0_20px_0_rgba(0,0,0,0.1)]"
        />
      </div>

      <ToolsOverview />
      <RecentlyAdded />
    </div>
  );
};

export default HomePage;