import { Users, ArrowDown } from 'lucide-react';
import './ViewSection.css';

function ViewSection({ userData }) {
  const friendsCount = userData?.invited_friends || 0;

  return (
    <div className="view-friends-container">
      <div className="friends-card">
        <div className="friends-header">
          <div className="friends-icon">
            <Users size={28} color="#FFFA8A" />
          </div>
          <div className="friends-info">
            <div className="friends-title">Your Friends</div>
            <div className="friends-count">
              {friendsCount} friends invited
            </div>
          </div>
        </div>
        
        <div className="friends-description">
          Invite your friends to earn rewards together! Each friend who joins through your link gives you bonus blocks and diamonds.
        </div>
      </div>
      
      <div className="arrow-indicator">
        <ArrowDown className="arrow arrow-1" size={32} color="#FFFA8A" />
        <ArrowDown className="arrow arrow-2" size={32} color="#FFFA8A" />
        <ArrowDown className="arrow arrow-3" size={32} color="#FFFA8A" />
      </div>
    </div>
  );
}

export default ViewSection;