import React from 'react';
import Sidebar from './Sidebar';
import { useMachine } from '@xstate/react';
import { sidebarMachine } from '../../machines/SidebarMachine';

const MobileSidebar = () => {
  const [state, send] = useMachine(sidebarMachine, { input: { isSidebarOpen: true } });
  const isSidebarOpen = state.context.isSidebarOpen;

  return (
    <nav className='sm:hidden'>
        <button 
            className="material-symbols-outlined"
            onClick={() => send({ type: 'TOGGLE_SIDEBAR' })}
        >menu</button>
        <Sidebar />
    </nav>
  )
}

export default MobileSidebar;