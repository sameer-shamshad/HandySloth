import Sidebar from './Sidebar';
import { useMachine } from '@xstate/react';
import SlothIcon from '../../assets/SlothIcon';
import { sidebarMachine } from '../../machines/SidebarMachine';

const MobileSidebar = () => {
  const [state, send] = useMachine(sidebarMachine, { input: { isSidebarOpen: true } });
  const isSidebarOpen = state.context.isSidebarOpen;

  return (
    <nav className='md:hidden flex items-center justify-between py-3'>
        <button 
            className="material-symbols-outlined"
            onClick={() => send({ type: 'TOGGLE_SIDEBAR' })}
        >menu</button>
        <Sidebar />

        <SlothIcon />

    </nav>
  )
}

export default MobileSidebar;