import { useState, useEffect } from 'react';
import Menu from '../Menus/Menu/Menu';
import './Friends.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';

function Friends({ userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userData || !userData.telegram_user_id) return;
      try {
        const response = await fetch(`https://lucky-stars-backend.netlify.app/.netlify/functions/getFriends?referrer_id=${userData.telegram_user_id}`);
        if (response.ok) {
          const friendsData = await response.json();
          setFriends(friendsData);
        } else {
          console.error('Failed to fetch friends');
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userData]);

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

      <div className="friends-header">
        <h2>My Friends</h2>
        <p>Connect with friends and earn rewards together</p>
      </div>

      {loading ? (
        <div className="loading">Loading friends...</div>
      ) : (
        <div className="friends-list">
          {friends.map(friend => (
            <div key={friend.id} className="friend-card">
              <div className="friend-avatar">
                <div className="avatar-placeholder">
                  {friend.name.charAt(0)}
                </div>
                <div className={`online-status ${friend.online ? 'online' : 'offline'}`}></div>
              </div>
              <div className="friend-info">
                <h3>{friend.name}</h3>
                <p>Level {friend.level}</p>
              </div>
              <div className="friend-actions">
                <button className="send-gift-btn">🎁</button>
              </div>
            </div>
          ))}
          
          {friends.length === 0 && (
            <div className="no-friends">
              <p>You don't have any friends yet</p>
              <p>Invite friends to start earning rewards!</p>
            </div>
          )}
        </div>
      )}

      <div className='Button-container'>
        <button className="invite-friends-btn" onClick={handleInviteFriends}>
          <span className="btn-icon">👥</span>
          Invite Friends
          <span className="btn-badge">+3 🧱 +10 💎</span>
        </button>
      </div>

      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </section>
  );
}

export default Friends;