import { useMachine } from '@xstate/react';
import ToolsGrid from '../components/Tools/ToolsGrid';
import { selectPopularTools, toolMachine } from '../machines/ToolMachine';
import type { Tool } from '../types';


const PopularPage = () => {
    const [state] = useMachine(toolMachine);
    const tools = state.context.tools;
    const popularTools: Tool[] = selectPopularTools(tools, 20);

  return (
    <div className='h-full'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>Popular</h3>
        <ToolsGrid tools={popularTools} />
    </div>
  );
};

export default PopularPage;