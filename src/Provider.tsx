import { store } from './store/store';
import type { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ToolsProvider } from './context/ToolsProvider';
import { ModalProvider } from './context/ModalProvider';
import { MyToolsProvider } from './context/MyToolsProvider';
import { SessionChecker } from './components/SessionChecker';

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <SessionChecker>
        <ToolsProvider>
          <MyToolsProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </MyToolsProvider>
        </ToolsProvider>
      </SessionChecker>
    </ReduxProvider>
  );
}

export default Provider;