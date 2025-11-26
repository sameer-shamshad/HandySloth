import { useMachine } from '@xstate/react';
import ToolsOverviewList from './ToolsOverviewList';
import { toolMachine, selectTrendingTools, selectPopularTools, selectRecentTools } from '../../machines/ToolMachine';

const ToolsOverview = () => {
  const [state] = useMachine(toolMachine);
  const tools = state.context.tools;

  const trendingTools = selectTrendingTools(tools);
  const popularTools = selectPopularTools(tools);
  const recentTools = selectRecentTools(tools);

  return (
    <section className="grid grid-cols-3 items-center p-4 bg-primary-bg rounded-3xl shadow-[0_40px_80px_rgba(10,17,40,0.05)]">
      <ToolsOverviewList tools={trendingTools} toolsLabel="Trending Tools" />
      <ToolsOverviewList tools={popularTools} toolsLabel="Popular Tools" />
      <ToolsOverviewList tools={recentTools} toolsLabel="Recently Added" />
    </section>
  );
};

export default ToolsOverview;