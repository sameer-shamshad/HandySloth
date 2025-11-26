import ToolCard from './ToolCard';
import type { Tool } from '../../types';

interface ToolsGridProps {
  tools: Tool[];
}

const ToolsGrid = ({ tools }: ToolsGridProps) => {
    return (
        <div className="w-full gap-8 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 bg-primary-bg px-3 py-12 rounded-3xl">
            {
                tools?.length > 0 && tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))
            }
        </div>
    );
};

export default ToolsGrid;