import React from 'react';
import './PartnersTasks.css';

const PartnersTasks = ({ tasks }) => {
  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2>Partners Tasks</h2>
      </div>
      
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.id} className="task">
            <div className="task-content">
              <div className="task-title">{task.title}</div>
              <div className="task-reward">
                Reward: {task.reward} {task.rewardType === 'diamonds' ? '💎' : '📦'}
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(task.progress / task.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <button className="claim-btn disabled" disabled>
              {task.progress}/{task.total}
            </button>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <p>No partner tasks available</p>
        </div>
      )}
    </div>
  );
};

export default PartnersTasks;