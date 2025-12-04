import ToolsGrid from '../components/Tools/ToolsGrid';
import { useTools } from '../context/ToolsProvider';

const TrendingPage = () => {
    const { state } = useTools();
    const trendingTools = state.context.trendingTools;

  return (
    <div className='h-full'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>Trending</h3>
        <ToolsGrid tools={trendingTools} tag="index" />
    </div>
  );
};

export default TrendingPage;