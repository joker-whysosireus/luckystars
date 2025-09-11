import { TrendingUp, Gift } from 'lucide-react';
import './InviteStats.css';

function InviteStats({ totalInvites = 0, totalRewards = 0 }) {
  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-yellow">
            <TrendingUp size={24} color="#FFFA8A" />
          </div>
          <div className="stat-value">{totalInvites}</div>
          <div className="stat-label">Total Invites</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <Gift size={24} color="#3b82f6" />
          </div>
          <div className="stat-value">{totalRewards}</div>
          <div className="stat-label">Total Rewards</div>
        </div>
      </div>
    </div>
  );
}

export default InviteStats;