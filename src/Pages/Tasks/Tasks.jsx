import { useState } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import './Tasks.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';

function Tasks({ isActive, userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section className='bodytaskspage'>
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />
      
     
      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </section>
  );
}

export default Tasks;