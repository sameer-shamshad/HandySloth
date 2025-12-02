/**
 * Modal Usage Example
 * 
 * This file demonstrates how to use the Modal component with the ModalProvider context.
 */

import { useModal } from '../../context/ModalProvider';

// Example: Opening a modal from any component
const ExampleComponent = () => {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal({
      component: (
        <div>
          <p>This is the modal content!</p>
          <button onClick={closeModal}>Close</button>
        </div>
      ),
      title: 'Example Modal',
      size: 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'full'
    });
  };

  return (
    <button onClick={handleOpenModal}>
      Open Modal
    </button>
  );
};

// Example: Opening a modal with custom content
const AnotherExample = () => {
  const { openModal } = useModal();

  const handleSubmit = () => {
    openModal({
      component: (
        <form>
          <input type="text" placeholder="Enter name" />
          <button type="submit">Submit</button>
        </form>
      ),
      title: 'Submit Form',
      size: 'lg',
    });
  };

  return <button onClick={handleSubmit}>Show Form</button>;
};

export default ExampleComponent;

