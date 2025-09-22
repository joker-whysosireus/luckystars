import { useState, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import './Friends.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';
import InviteStats from './Containers/ViewFriends/InviteStats';
import ViewSection from './Containers/ViewSection/ViewSection';
import { Box, Diamond } from 'lucide-react';

function Friends({ userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Автоматический показ рекламы каждые 30 секунд
  useEffect(() => {
    let adInterval;

    // Запускаем рекламу не сразу, а через 5 секунд после загрузки компонента
    const initialDelay = setTimeout(() => {
      // Первый показ рекламы
      if (window.showAd) {
        console.log('Показ первой рекламы');
        window.showAd();
      }

      // Устанавливаем интервал для повторного показа каждые 30 секунд
      adInterval = setInterval(() => {
        if (window.showAd) {
          console.log('Автоматический показ рекламы (30 сек)');
          window.showAd();
        } else {
          console.warn('Функция showAd не доступна');
        }
      }, 30000); // 30 секунд

    }, 5000); // Начальная задержка 5 секунд

    // Очистка при размонтировании компонента
    return () => {
      clearTimeout(initialDelay);
      clearInterval(adInterval);
      console.log('Очистка интервала рекламы');
    };
  }, []);

  // Дополнительный эффект для показа рекламы при изменении видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && window.showAd) {
        // Если страница снова стала активной, показываем рекламу
        setTimeout(() => {
          window.showAd();
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
            <span className="btn-badge">+3 <Box size={12} color="#3a3a3a" /> +10 <Diamond size={12} color="#3b82f6" /> </span>
          </button>
        </div>
      </div>

      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </section>
  );
}

export default Friends;