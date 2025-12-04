import ToolsGrid from '../components/Tools/ToolsGrid';
import { useMyTools } from '../context/MyToolsProvider';

const MyToolsPage = () => {
    const { state: myToolsState } = useMyTools();
    const tools = myToolsState.context.tools;

    return (
      <div className='h-full'>
          <h3 className='pb-4 text-xl font-medium text-primary-color'>My Tools</h3>
          <ToolsGrid tools={tools} tag="index" />
      </div>
    );
};

export default MyToolsPage;