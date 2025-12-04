import { useAuth } from './index';
import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import type { EventFrom, StateFrom } from 'xstate';
import myToolMachine from '../machines/tool-machines/MyToolMachine';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

type MyToolsContextValue = {
  state: StateFrom<typeof myToolMachine>;
  send: (event: EventFrom<typeof myToolMachine>) => void;
};

const MyToolsContext = createContext<MyToolsContextValue | undefined>(undefined);

export const MyToolsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [state, send] = useMachine(myToolMachine);

  // Watch Redux auth state and trigger MyToolMachine events
  useEffect(() => {
    if (isAuthenticated) { // User is authenticated - fetch their tools
      send({ type: 'USER_AUTHENTICATED' });
    } else { // User logged out - clear tools
      send({ type: 'USER_LOGGED_OUT' });
    }
  }, [isAuthenticated, send]);

  const value = useMemo(() => {
    return { state, send };
  }, [state, send]);

  return (
    <MyToolsContext.Provider value={value}>
      {children}
    </MyToolsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMyTools = (): MyToolsContextValue => {
  const context = useContext(MyToolsContext);
  if (!context) {
    throw new Error('useMyTools must be used within a MyToolsProvider');
  }

  return context;
};

