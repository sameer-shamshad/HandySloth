import ToolsGrid from './ToolsGrid';
import type { Tool } from '../../types';
import { useMachine } from '@xstate/react';
import { toolMachine, selectRecentTools } from '../../machines/ToolMachine';

const RecentlyAdded = () => {
  const [state] = useMachine(toolMachine);
  const tools = state.context.tools;
  const recentTools: Tool[] = selectRecentTools(tools, 6);
  return (
    <section className="bg-group-bg">
      <h2 className="text-xl font-extrabold text-primary-color px-3 pt-5">Recently Added</h2>
      <ToolsGrid tools={recentTools} />
    </section>
  );
};

export default RecentlyAdded;