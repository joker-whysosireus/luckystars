import { TrendingUp, Gift, Box } from 'lucide-react';
import './InviteStats.css';

function InviteStats({ userData }) {
  const invitedFriends = userData?.invited_friends || 0;
  const shardsForInvited = userData?.shards_for_invited || 0;
  const bloksForInvited = userData?.bloks_for_invited || 0;

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-yellow">
            <TrendingUp size={24} color="#FFFA8A" />
          </div>
          <div className="stat-value">{invitedFriends}</div>
          <div className="stat-label">Total Invites</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <Gift size={24} color="#3b82f6" />
          </div>
          <div className="stat-value">{shardsForInvited}</div>
          <div className="stat-label">Total Shards</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green">
            <Box size={24} color="#4ade80" />
          </div>
          <div className="stat-value">{bloksForInvited}</div>
          <div className="stat-label">Blocks from Friends</div>
        </div>
      </div>
    </div>
  );
}

export default InviteStats;