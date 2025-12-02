import { useMachine } from '@xstate/react';
import type { EventFrom, StateFrom } from 'xstate';
import authMachine from '../machines/AuthMachine';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

type AuthContextValue = {
  state: StateFrom<typeof authMachine>;
  send: (event: EventFrom<typeof authMachine>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, send] = useMachine(authMachine);

    const value = useMemo(() => {
        return { state, send };
    }, [state, send]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

