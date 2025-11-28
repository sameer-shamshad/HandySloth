import type { CategoryStats } from '../types';
import CategoryStatInstance from '../components/CategoryStatInstance';

const categories: CategoryStats[] = [
    { id: '1', name: 'Category Name', tools: 10, votes: 20095, saved: 120 },
    { id: '2', name: 'Market', tools: 6, votes: 32556, saved: 300 },
    { id: '3', name: 'News', tools: 102, votes: 73847, saved: 210 },
    // { id: '4', name: 'Developer', tools: 30, votes: 10256, saved: 10 },
];

const CategoriesPage = () => {  
    return (
        <section className="flex flex-col">
            <h3 className='text-primary-color md:text-2xl px-5 pb-8 lg:pb-5'>Categories</h3>
            <div className='grid grid-cols-[45px_1fr_1fr_1fr_1fr] xl:grid-cols-[100px_1fr_1fr_1fr_1fr] auto-rows-fr bg-primary-bg rounded-tl-3xl rounded-tr-3xl 
                pt-11 pb-7 lg:pt-18 lg:pb-0 *:w-max *:mx-auto *:rounded-xl *:bg-main-color 
                *:text-[10px] *:text-black-color *:text-center *:py-[6px] *:px-3 *:md:text-[13px] *:md:font-bold *:lg:text-[14px] 
                *:lg:px-6 *:xl:rounded-xl'>
                <span className='invisible'>#</span>
                <span>NAME</span>
                <span>NO. OF TOOLS</span>
                <span>VOTES</span>
                <span>SAVED</span>
            </div>
            <div className='flex flex-col bg-primary-bg rounded-bl-3xl rounded-br-3xl px-4 pb-7 xl:px-12 lg:pt-6 sm:pb-18'>
                {
                    categories.length > 0 ? categories.map((category, index) => (
                        <CategoryStatInstance key={category.id} category={category} index={index} />
                    )) : (
                        <p>No categories found</p>
                    )
                }
            </div>
        </section>
    );
};

export default CategoriesPage;