import { memo } from 'react'
import type { Tool } from '../../types';

const ToolsOverviewList = ({ tools = [], toolsLabel = "" }: { tools: Tool[], toolsLabel: string }) => {
    return (
        <div className='w-full grid grid-rows-7'>
            <h4 className='w-min lg:w-max h-min px-4 text-wrap text-xs sm:text-sm lg:px-4 lg:text-md justify-self-center sm:justify-self-start xl:mx-10 2xl:mx-30
                leading-none font-bold uppercase bg-main-color text-black-color text-center py-2 rounded-lg my-auto'>
                {toolsLabel}
            </h4>

            {
                tools?.length > 0 && tools.map((tool, index) => (
                    <div key={tool._id} className='flex items-center gap-3 py-3 border-t border-border-color first:border-t-0 md:last:border-b xl:px-10 2xl:px-30'>
                        <span className='text-xs font-semibold text-primary-color px-2 py-1'>{index + 1}</span>
                        <div className='flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-4 xl:ml-3 xl:gap-5'>
                            <img src={tool.logo} alt={tool.name} className='h-6 w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 rounded-full object-cover' />
                            <span className='text-xs font-bold text-primary-color text-wrap mt-1'>{tool.name}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default memo(ToolsOverviewList);