import ToolCard from './ToolCard';
import type { Tool } from '../../types';

interface ToolsGridProps {
  tools: Tool[];
  tag: string;
}

const ToolsGrid = ({ tools, tag }: ToolsGridProps) => {
    return (
        <div className="w-full gap-x-7 gap-y-11 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 card:grid-cols-3 bg-primary-bg px-3 lg:px-8 py-12 rounded-3xl">
            {
                tools?.length > 0 && tools.map((tool, index) => (
                    <ToolCard key={tool.id} tool={tool} tag={tag === 'NEW' ? tag : `#${index + 1 > 3 ? index + 1 : `${index + 1}🔥`}`} />
                ))
            }
        </div>
    );
};

export default ToolsGrid;