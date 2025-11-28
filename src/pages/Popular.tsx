import ToolsGrid from '../components/Tools/ToolsGrid';
import { selectPopularTools } from '../machines/ToolMachine';
import type { Tool } from '../types';
import { useTools } from '../context/ToolsProvider';


const PopularPage = () => {
    const { state } = useTools();
    const tools = state.context.tools;
    const popularTools: Tool[] = selectPopularTools(tools, 20);

  return (
    <div className='h-full'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>Popular</h3>
        <ToolsGrid tools={popularTools} tag="index" />
    </div>
  );
};

export default PopularPage;