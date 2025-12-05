interface ToolItem {
    name: string;
    logo: string;
}

interface ToolListProps {
    tools: ToolItem[];
    label: 'My Bookmarks' | 'Recently Viewed';
}

const ToolList = ({ tools, label }: ToolListProps) => {
    return (
        <div className='w-full flex flex-col gap-4 bg-primary-bg px-4 py-8 2xl:p-8 rounded-3xl'>
            <h3 className='text-primary-color text-md font-bold'>{label}</h3>
            {
                tools.length > 0 ? tools.map((tool, index) => (
                    <div 
                        key={`${tool.name}-${index}`}
                        className='flex items-center gap-2 border-b border-border-color last:border-b-0 pb-4'
                    >
                        <span className='text-secondary-color text-xs ml-4'>{index + 1}</span>
                        <img 
                            src={tool?.logo || "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"} 
                            alt={tool.name} 
                            className='w-7 h-7 md:w-10 md:h-10 rounded-full object-contain ml-10'
                        />
                        <h4 className='text-primary-color text-sm font-bold ml-4'>{tool.name}</h4>
                    </div>
                )) : (
                    <p>No {label.toLowerCase()} found</p>
                )
            }
        </div>
    );
};

export default ToolList;

