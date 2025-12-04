import { useTools } from '../context/ToolsProvider';
import ToolsGrid from '../components/Tools/ToolsGrid';

const PopularPage = () => {
    const { state } = useTools();
    const popularTools = state.context.popularTools;

  return (
    <div className='h-full'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>Popular</h3>
        <ToolsGrid tools={popularTools} tag="index" />
    </div>
  );
};

export default PopularPage;