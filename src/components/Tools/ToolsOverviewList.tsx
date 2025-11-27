import { memo } from 'react'
import type { Tool } from '../../types';

const ToolsOverviewList = ({ tools = [], toolsLabel = "" }: { tools: Tool[], toolsLabel: string }) => {
    return (
        <div className='flex flex-col'>
            <h4 className='w-max px-2 md:px-4 text-wrap lg:px-4 text-[10px] lg:text-[14px] 2xl:text-[16px] font-extrabold uppercase bg-main-color text-black-color text-center py-2 rounded-lg'>{toolsLabel}</h4>
            {
                tools?.length > 0 && tools.map((tool, index) => (
                        <div key={tool.id} className='flex items-center gap-3 py-5 border-b border-border-color last:border-b-0'>
                            <span className='text-xs font-semibold text-primary-color px-2 py-1'>{index + 1}</span>
                            <div className='flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-4 xl:ml-6 xl:gap-5'>
                                <img src={tool.logo} alt={tool.name} className='h-6 w-6 lg:h-8 lg:w-8 rounded-full object-cover' />
                                <span className='text-xs font-bold text-primary-color text-wrap'>{tool.name}</span>
                            </div>
                        </div>
                ))
            }
        </div>
    );
};

export default memo(ToolsOverviewList);