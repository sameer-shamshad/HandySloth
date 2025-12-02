import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

interface ModalContent {
  component: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface ModalContextValue {
  isOpen: boolean;
  content: ModalContent | null;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ModalContent | null>(null);

  const openModal = useCallback((modalContent: ModalContent) => {
    setContent(modalContent);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 200); // Clear content after animation completes
  }, []);

  const value = useMemo(() => {
    return {
      isOpen,
      content,
      openModal,
      closeModal,
    }
  }, [isOpen, content, openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};

