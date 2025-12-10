import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface ToolItem {
    name: string;
    logo: string;
    _id: string; // Optional ID for clickable tools
}

interface ToolListItemsProps {
    tools: ToolItem[];
    clickable: boolean;
    onToolClick?: () => void;
}

const ToolListItems = memo(({ tools, clickable, onToolClick }: ToolListItemsProps) => {
    const navigate = useNavigate();
    const baseClasses = 'flex items-center gap-2 rounded-none! border-b border-border-color last:border-b-0 pb-4! text-left w-full';
    const interactiveClasses = clickable ? 'hover:bg-secondary-bg transition-colors cursor-pointer' : '';

    if (tools.length === 0) {
        return <p className='text-secondary-color text-sm text-center'>No tools found</p>;
    }

    const handleToolClick = (toolId?: string) => {
        if (clickable && toolId) {
            navigate(`/tool/${toolId}`);
            if (onToolClick) {
                onToolClick();
            }
        }
    };

    return (
        <>
            {tools.map((tool, index) => {
                if (clickable) {
                    return (
                        <button
                            type="button"
                            key={`${tool._id}`}
                            disabled={!tool._id}
                            onClick={() => handleToolClick(tool._id)}
                            className={`${baseClasses} ${interactiveClasses} disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <span className='text-secondary-color text-xs ml-4'>{index + 1}</span>
                            <img 
                                src={tool?.logo || "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"} 
                                alt={tool.name} 
                                className='w-7 h-7 md:w-10 md:h-10 rounded-full object-contain ml-10'
                            />
                            <h4 className='text-primary-color text-sm font-bold ml-4'>{tool.name}</h4>
                        </button>
                    );
                }

                return (
                    <div 
                        key={`${tool._id}`}
                        className={baseClasses}
                    >
                        <span className='text-secondary-color text-xs ml-4'>{index + 1}</span>
                        <img 
                            src={tool?.logo || "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"} 
                            alt={tool.name} 
                            className='w-7 h-7 md:w-10 md:h-10 rounded-full object-contain ml-10'
                        />
                        <h4 className='text-primary-color text-sm font-bold ml-4'>{tool.name}</h4>
                    </div>
                );
            })}
        </>
    );
});

ToolListItems.displayName = 'ToolListItems';

interface ToolListProps {
    tools: ToolItem[];
    label?: string; // Made optional to support SearchBar usage
    clickable?: boolean; // If true, tools are clickable with hover effects
    onToolClick?: () => void; // Optional callback when tool is clicked (for SearchBar)
}

const ToolList = memo(({ tools, label, clickable = false, onToolClick }: ToolListProps) => {
    return (
        <div className='w-full flex flex-col gap-4 bg-primary-bg px-4 py-8 xl:px-6 2xl:p-8 rounded-3xl'>
            {label && <h3 className='text-primary-color text-md font-bold'>{label}</h3>}
            <ToolListItems tools={tools} clickable={clickable} onToolClick={onToolClick} />
        </div>
    );
});

ToolList.displayName = 'ToolList';

export default ToolList;

