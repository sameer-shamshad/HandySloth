import { store } from './store/store';
import type { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ToolsProvider } from './context/ToolsProvider';
import { ModalProvider } from './context/ModalProvider';
import { SessionChecker } from './components/SessionChecker';

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <SessionChecker>
        <ToolsProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </ToolsProvider>
      </SessionChecker>
    </ReduxProvider>
  );
}

export default Provider;