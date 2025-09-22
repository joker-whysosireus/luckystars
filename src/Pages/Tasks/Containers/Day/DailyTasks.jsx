import React from 'react';
import { Diamond } from 'lucide-react';
import './DailyTasks.css';

const DailyTasks = ({ 
  tasks, 
  claimedTasks, 
  dailyLoginRemainingTime, 
  handleDailyLogin, 
  formatDailyLoginTime 
}) => {
  const renderRewardText = (reward, rewardType) => {
    return (
      <span className="reward-text">
        {reward} 
        {rewardType === 'diamonds' ? <Diamond size={16} /> : '📦'}
      </span>
    );
  };

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2>Daily Tasks</h2>
      </div>
      
      {tasks.length > 0 ? (
        tasks.map(task => {
          const isClaimed = claimedTasks.includes(task.id);
          const progressPercentage = (task.progress / task.total) * 100;
          
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
              
              {isClaimed || dailyLoginRemainingTime > 0 ? (
                <button 
                  className="claim-btn daily-login disabled"
                  disabled
                >
                  {dailyLoginRemainingTime > 0 ? formatDailyLoginTime(dailyLoginRemainingTime) : 'Done!'}
                </button>
              ) : (
                <button 
                  className="claim-btn active"
                  onClick={handleDailyLogin}
                >
                  Claim
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <p>No daily tasks available</p>
        </div>
      )}
    </div>
  );
};

export default DailyTasks;