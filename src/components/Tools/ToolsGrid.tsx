import ToolCard, { ToolCardSkeleton } from './ToolCard';
import type { Tool } from '../../types';
import { useTools } from '../../context/ToolsProvider';

interface ToolsGridProps {
  tools: Tool[];
  tag: "NEW" | "index";
}

const ToolsGrid = ({ tools, tag }: ToolsGridProps) => {
    const { state } = useTools();
    const machineState = state.value;
    return (
        <div className="w-full relative gap-x-7 gap-y-11 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 card:grid-cols-3 
            lg:pt-8 bg-primary-bg px-3 lg:px-8 py-12 rounded-3xl lg:rounded-tl-none lg:rounded-tr-none">
            {
                machineState === 'loading' ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <ToolCardSkeleton key={`tool-skeleton-${index}`} />
                    ))
                ) : machineState === 'idle' ? (
                    tools?.length > 0 ? tools.map((tool, index) => (
                        <ToolCard key={tool._id} tool={tool} tag={tag === 'NEW' ? tag : `#${index + 1 > 3 ? index + 1 : `${index + 1}🔥`}`} />
                    )) : (
                        <p className='w-full text-center text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>No tools found</p>
                    )
                ) : (
                    <p>Error</p>
                )
            }
        </div>
    );
};

export default ToolsGrid;