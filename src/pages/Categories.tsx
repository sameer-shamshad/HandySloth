import { useEffect, useState } from 'react';
import type { CategoryStats } from '../types';
import CategoryStatInstance from '../components/CategoryStatInstance';
import { fetchCategoryStats } from '../services/tools.service';

const CategoriesPage = () => {
    const [categories, setCategories] = useState<CategoryStats[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategoryStats = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const stats = await fetchCategoryStats();
                setCategories(stats);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load category stats';
                setError(errorMessage);
                console.error('Failed to fetch category stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategoryStats();
    }, []);

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
                {isLoading ? (
                    <p className='text-center text-secondary-color py-8'>Loading categories...</p>
                ) : error ? (
                    <p className='text-center text-red-500 py-8'>{error}</p>
                ) : categories.length > 0 ? (
                    categories.map((category, index) => (
                        <CategoryStatInstance key={category.name} category={category} index={index} />
                    ))
                ) : (
                    <p className='text-center text-secondary-color py-8'>No categories found</p>
                )}
            </div>
        </section>
    );
};

export default CategoriesPage;