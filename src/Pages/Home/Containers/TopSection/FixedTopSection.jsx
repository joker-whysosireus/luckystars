import './FixedTopSection.css';
import { Box, Diamond } from 'lucide-react';

function FixedTopSection({ userData, onInfoClick }) {
  return (
    <div className="fixed-resources">
      <div className="resources-container">
        <div className="resource-block">
          <div className="resource-count">{userData?.bloks_count || 0} <Box size={18} color="#ffa500" /></div>
        </div>
        
        <button className="info-button" onClick={onInfoClick}>
          ℹ️
        </button>
        
        <div className="resource-block">
          <div className="resource-count">{userData?.shards || 0} <Diamond size={18} color="#3b82f6" /></div>
        </div>
      </div>
    </div>
  );
}

export default FixedTopSection;