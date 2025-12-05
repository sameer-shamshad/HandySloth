import { memo } from 'react';
import type { CategoryStats } from '../types';
import { formatNumber } from '../utils/number';

const CategoryStatInstance = memo(({ category, index }: { category: CategoryStats, index: number }) => {
    return (
        <div className='grid grid-cols-[45px_1fr_1fr_1fr_1fr] xl:grid-cols-[100px_1fr_1fr_1fr_1fr] auto-rows-fr 
            py-5 border-t sm:last:border-b auto-cols-fr
            border-border-color *:text-[13px] *:text-primary-color *:w-full *:text-center *:lg:text-[14px]'>
            <span className='text-xs text-secondary-color! text-left! px-3 *:lg:px-5'>{index + 1}.</span>
            <h4 className='font-bold! text-sm text-left! xl:text-left!'>{category.name}</h4>
            <p>{formatNumber(category.totalTools)}</p>
            <p>{formatNumber(category.totalVotes)}</p>
            <p>{formatNumber(category.totalBookmarks)}</p>
        </div>
    )
});

export default CategoryStatInstance;