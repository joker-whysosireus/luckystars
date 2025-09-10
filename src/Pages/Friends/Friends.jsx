import { useState } from 'react';
import Menu from '../Menus/Menu/Menu';
import './Friends.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';

function Friends({ userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section className='bodyfriendspage'>
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />

      {/* Общее модальное окно */}
      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </section>
  );
}

export default Friends;