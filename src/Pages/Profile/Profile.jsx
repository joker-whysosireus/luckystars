import { useState } from "react";
import Menu from "../Menus/Menu/Menu";
import "./Profile.css";
import FixedTopSection from "../Home/Containers/TopSection/FixedTopSection";
import InfoModal from "../../Assets/Modal/InfoModal";

function Profile({ userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section className="profile-page">
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

export default Profile;