import { useMachine } from '@xstate/react';
import ToolsGrid from '../components/Tools/ToolsGrid';
import { selectTrendingTools, toolMachine } from '../machines/ToolMachine';
import type { Tool } from '../types';


const TrendingPage = () => {
    const [state] = useMachine(toolMachine);
    const tools = state.context.tools;
    const trendingTools: Tool[] = selectTrendingTools(tools, 20);

  return (
    <div className='h-full'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>Trending</h3>
        <ToolsGrid tools={trendingTools} tag="index" />
    </div>
  );
};

export default TrendingPage;