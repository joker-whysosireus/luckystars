import './FixedTopSection.css';

function FixedTopSection({ userData, onInfoClick }) {
  return (
    <div className="fixed-resources">
      <div className="resources-container">
        <div className="resource-block">
          <div className="resource-count">{userData?.bloks_count || 0} 🧱</div>
        </div>
        
        <button className="info-button" onClick={onInfoClick}>
          ℹ️
        </button>
        
        <div className="resource-block">
          <div className="resource-count">{userData?.shards || 0} 💎</div>
        </div>
      </div>
    </div>
  );
}

export default FixedTopSection;