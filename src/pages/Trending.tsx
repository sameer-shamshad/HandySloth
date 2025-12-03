import ToolsGrid from '../components/Tools/ToolsGrid';
import { selectTrendingTools } from '../machines/tool-machines/ToolMachine';
import type { Tool } from '../types';
import { useTools } from '../context/ToolsProvider';


const TrendingPage = () => {
    const { state } = useTools();
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