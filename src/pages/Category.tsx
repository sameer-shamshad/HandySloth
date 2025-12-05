import type { Tool } from '../types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ToolsGrid from '../components/Tools/ToolsGrid';
import { ToolCardSkeleton } from '../components/Tools/ToolCard';
import { fetchToolsByCategory } from '../services/tools.service';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();

  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTools = async () => {
      if (!category) {
        setError('Category ID is required');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedTools = await fetchToolsByCategory(category);
        setTools(fetchedTools);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load tools';
        setError(errorMessage);
        console.error('Error fetching tools by category:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTools();
  }, [category]);

  if (isLoading) {
    return (
      <div className='h-full'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>
          {category ? `${category} Tools` : 'Loading...'}
        </h3>
        <div className="w-full relative gap-x-7 gap-y-11 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 card:grid-cols-3 
            lg:pt-8 bg-primary-bg px-3 lg:px-8 py-12 rounded-3xl lg:rounded-tl-none lg:rounded-tr-none">
          {Array.from({ length: 6 }).map((_, index) => (
            <ToolCardSkeleton key={`tool-skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='h-full'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>
          {category ? `${category} Tools` : 'Category'}
        </h3>
        <div className='w-full bg-primary-bg px-3 lg:px-8 py-12 rounded-3xl'>
          <p className='text-center text-red-500'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full'>
      <h3 className='pb-4 text-xl font-medium text-primary-color'>
        {category ? `${category} Tools` : 'Category'}
      </h3>
      <ToolsGrid tools={tools} tag="index" />
    </div>
  );
};

export default CategoryPage;