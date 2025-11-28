import { memo } from 'react'
import type { Tool } from '../types'

const ToolViewPage = memo(({ tool }: { tool: Tool }) => {
    console.log(tool);

    return (
        <div>
            <div className='flex items-center gap-5 px-4'>
                <div className='flex items-center gap-2 bg-black-color dark:bg-secondary-bg rounded-md px-2'>
                    <span className='material-symbols-outlined text-gray-400! text-lg!'>signal_cellular_alt</span>
                    <span className='text-white text-sm'>Data Analytics</span>
                </div>

                <div className='flex items-center '>
                    <span className='material-symbols-outlined text-gray-500! text-lg!'>history</span>
                    <span className='text-sm text-gray-400!'>Added 1m ago</span>
                </div>
            </div>

            
        </div>
    )
});

export default ToolViewPage;