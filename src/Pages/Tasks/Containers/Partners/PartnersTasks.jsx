import React from 'react';

const PartnersTasks = ({ tasks, claimedTasks, handleClaimReward, isClaiming }) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2>Partners Tasks</h2>
      </div>
      
      {tasks.map(task => {
        const isClaimed = claimedTasks.includes(task.id);
        const progressPercentage = (task.progress / task.total) * 100;

        return (
          <div key={task.id} className="task">
            <div className="task-content">
              <div className="task-title">{task.title}</div>
              <div className="task-reward">
                Reward: <span className="reward-text">+{task.reward} {task.rewardType}</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <button 
              className={`claim-btn ${isClaimed ? 'done' : 'active'}`}
              onClick={() => handleClaimReward(task)}
              disabled={isClaiming || isClaimed}
            >
              {isClaimed ? 'Done!' : isClaiming ? '...' : 'Start'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PartnersTasks;