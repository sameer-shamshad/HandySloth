import { useModal } from '../../context/ModalProvider';
import Modal from './Modal';

const ModalContainer = () => {
  const { isOpen, content, closeModal } = useModal();

  if (!content) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={content.title}
      size={content.size}
    >
      {content.component}
    </Modal>
  );
};

export default ModalContainer;