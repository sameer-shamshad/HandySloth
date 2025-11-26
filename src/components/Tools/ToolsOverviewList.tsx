import { memo } from 'react'
import type { Tool } from '../../types';

const ToolsOverviewList = ({ tools = [], toolsLabel = "" }: { tools: Tool[], toolsLabel: string }) => {
    return (
        <div className='flex flex-col'>
            <h4 className='w-max px-2 ml-8 text-[10px] md:text-[16px] font-extrabold uppercase bg-main-color text-black-color text-center py-2 rounded-lg'>{toolsLabel}</h4>
            {
                tools?.length > 0 && tools.map((tool, index) => (
                        <div key={tool.id} className='flex items-center gap-1 py-5 border-b border-border-color last:border-b-0'>
                            <span className='text-xs font-semibold  rounded-full px-2 py-1'>{index + 1}.</span>
                            <div className='flex flex-col items-start gap-1'>
                                <img src={tool.logo} alt={tool.name} className='h-6 w-6 rounded-full object-cover' />
                                <span className='text-xs font-medium text-primary-color text-nowrap'>{tool.name}</span>
                            </div>
                        </div>
                ))
            }
        </div>
    );
};

export default memo(ToolsOverviewList);