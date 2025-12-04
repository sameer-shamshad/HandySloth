import { useEffect, useState } from 'react';
import ToolsGrid from '../components/Tools/ToolsGrid';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUserToolsThunk } from '../store/features/userReducer';
import { fetchToolsByIds } from '../services/tools.service';
import type { Tool } from '../types';
import { useAuth } from '../hooks/useAuth';

const MyToolsPage = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const { tools: toolIds, isLoadingTools } = useAppSelector((state) => state.user);
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch tool IDs if not already loaded
    useEffect(() => {
        if (isAuthenticated && toolIds.length === 0 && !isLoadingTools) {
            dispatch(fetchUserToolsThunk());
        }
    }, [isAuthenticated, toolIds.length, isLoadingTools, dispatch]);

    // Fetch full tools by IDs when IDs are available
    useEffect(() => {
        const fetchTools = async () => {
            if (toolIds.length === 0) {
                setTools([]);
                return;
            }

            setIsLoading(true);
            try {
                const fullTools = await fetchToolsByIds(toolIds);
                setTools(fullTools);
            } catch (error) {
                console.error('Failed to fetch tools by IDs:', error);
                setTools([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTools();
    }, [toolIds]);

    return (
      <div className='h-full'>
          <h3 className='pb-4 text-xl font-medium text-primary-color'>My Tools</h3>
          {isLoading ? (
              <div>Loading...</div>
          ) : (
              <ToolsGrid tools={tools} tag="index" />
          )}
      </div>
    );
};

export default MyToolsPage;