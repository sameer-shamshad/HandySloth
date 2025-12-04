import ToolsOverviewList from './ToolsOverviewList';
import { useTools } from '../../context/ToolsProvider';

const ToolsOverview = () => {
  const { state } = useTools();

  const trendingTools = state.context.trendingTools;
  const popularTools = state.context.popularTools;
  const recentTools = state.context.recentTools;

  return (
    <>
      <section className="grid grid-cols-3 auto-rows-fr px-4 xl:px-12 lg:py-8 bg-primary-bg rounded-3xl shadow-[0_40px_80px_rgba(10,17,40,0.05)]">
        <ToolsOverviewList tools={trendingTools} toolsLabel="Trending Tools" />
        <ToolsOverviewList tools={popularTools} toolsLabel="Popular Tools" />
        <ToolsOverviewList tools={recentTools} toolsLabel="Recently Added" />
      </section>
    </>
  );
};

export default ToolsOverview;