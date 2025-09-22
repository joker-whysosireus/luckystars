import React from 'react';
import { Diamond, Box } from 'lucide-react';
import './MainTasks.css';

const MainTasks = ({ 
  tasks, 
  claimedTasks, 
  gigapubAdAvailable, 
  remainingTimes, 
  isGigapubLoading, 
  handleGigapubAd, 
  handleClaimReward, 
  formatTime 
}) => {
  const renderRewardText = (reward, rewardType) => {
    return (
      <span className="reward-text">
        {reward} 
        {rewardType === 'diamonds' ? <Diamond size={16} /> : <Box size={16} />}
      </span>
    );
  };

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2>Main Tasks</h2>
      </div>
      
      {tasks.length > 0 ? (
        tasks.map(task => {
          const isClaimed = claimedTasks.includes(task.id);
          const progressPercentage = (task.progress / task.total) * 100;
          const canClaim = task.completed && !isClaimed;
          
          return (
            <div key={task.id} className="task">
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                <div className="task-reward">
                  Reward: {renderRewardText(task.reward, task.rewardType)}
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              
              {task.type === 'gigapub' ? (
                isClaimed ? (
                  <button className="claim-btn done" disabled>
                    Done!
                  </button>
                ) : (
                  <button 
                    className={`claim-btn ${remainingTimes[task.id] > 0 ? 'disabled' : ''}`}
                    onClick={() => handleGigapubAd(task.id)}
                    disabled={remainingTimes[task.id] > 0 || isGigapubLoading[task.id] || !gigapubAdAvailable}
                  >
                    {!gigapubAdAvailable ? "Unavailable" : 
                     remainingTimes[task.id] > 0 ? formatTime(remainingTimes[task.id]) : 
                     isGigapubLoading[task.id] ? "Loading..." : 
                     `${task.progress}/${task.total}`}
                  </button>
                )
              ) : (
                <button 
                  className={`claim-btn ${canClaim ? 'active' : isClaimed ? 'done' : 'disabled'}`}
                  onClick={() => canClaim && handleClaimReward(task, 'main')}
                  disabled={isClaimed || !canClaim}
                >
                  {isClaimed ? 'Done!' : canClaim ? 'Claim' : `${task.progress}/${task.total}`}
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <p>No tasks available</p>
        </div>
      )}
    </div>
  );
};

export default MainTasks;