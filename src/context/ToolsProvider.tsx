import { useMachine } from '@xstate/react';
import type { EventFrom, StateFrom } from 'xstate';
import { toolMachine } from '../machines/tool-machines/ToolMachine';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

type ToolsContextValue = {
  state: StateFrom<typeof toolMachine>;
  send: (event: EventFrom<typeof toolMachine>) => void;
};

const ToolsContext = createContext<ToolsContextValue | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: ReactNode }) => {
    const [state, send] = useMachine(toolMachine);

    const value = useMemo(() => {
        return { state, send };
    }, [state, send]);

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTools = (): ToolsContextValue => {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider');
  }

  return context;
};