import ToolsGrid from './ToolsGrid';
import type { Tool } from '../../types';
import { useTools } from '../../context/ToolsProvider';

const RecentlyAdded = () => {
  const { state } = useTools();
  const recentTools: Tool[] = state.context.recentTools;
  return (
    <section className="bg-group-bg">
      <h2 className="text-xl font-extrabold text-primary-color px-5 py-5 lg:px-16 lg:pt-8 lg:pb-0 lg:-mb-5 lg:bg-primary-bg lg:rounded-tl-3xl lg:rounded-tr-3xl">Recently Added</h2>
      <ToolsGrid tools={recentTools} tag="NEW" />
    </section>
  );
};

export default RecentlyAdded;