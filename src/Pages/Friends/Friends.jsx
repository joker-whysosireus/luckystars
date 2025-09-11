import { useState } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import './Friends.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';
import InviteStats from './InviteStats';
import ViewSection from './ViewSection';

function Friends({ userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInviteFriends = () => {
    const telegramUserId = userData?.telegram_user_id;
    if (!telegramUserId) {
      console.warn("Telegram User ID not found.");
      return;
    }

    const message = "Join me in Lucky Stars and let's earn together! Use my invite link to join🎉";
    const startAppValue = `ref_${telegramUserId}`; 
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/LuckyStarsOfficialBot?startapp=${startAppValue}`)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <section className='bodyfriendspage'>
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />

      <div className="friends-content">
        <InviteStats userData={userData} />
        
        <ViewSection userData={userData} />

        <div className='Button-container'>
          <button className="invite-friends-btn" onClick={handleInviteFriends}>
            <span className="btn-icon">👥</span>
            Invite Friends
            <span className="btn-badge">+3 🧱 +10 💎</span>
          </button>
        </div>
      </div>

      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </section>
  );
}

export default Friends;