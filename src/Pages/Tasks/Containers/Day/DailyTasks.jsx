import React from 'react';
import { Box, Diamond } from 'lucide-react';

const DailyTasks = ({ 
  tasks, 
  claimedTasks, 
  dailyLoginRemainingTime, 
  handleDailyLogin, 
  formatDailyLoginTime, 
  isClaiming 
}) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2>Daily Tasks</h2>
      </div>
      
      {tasks.map(task => {
        const isClaimed = claimedTasks.includes(task.id);
        const progressPercentage = (task.progress / task.total) * 100;

        return (
          <div key={task.id} className="task">
            <div className="task-content">
              <div className="task-title">{task.title}</div>
              <div className="task-reward">
                Reward: <span className="reward-text">
                  +{task.reward} 
                  {task.rewardType === 'diamonds' ? (
                    <Diamond size={16} className="reward-icon" />
                  ) : task.rewardType === 'blocks' ? (
                    <Box size={16} className="reward-icon" />
                  ) : null}
                </span>
              </div>
              <div className="progress-container">
                <div 
                  className={`progress-bar ${progressPercentage > 0 ? 'filled' : ''}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="task-info">
                <span>{task.progress}/{task.total}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            
            <button 
              className={`claim-btn daily-login ${
                dailyLoginRemainingTime > 0 || isClaiming ? 'disabled' : 'active'
              }`}
              onClick={() => handleDailyLogin(task)}
              disabled={dailyLoginRemainingTime > 0 || isClaiming || isClaimed}
            >
              {dailyLoginRemainingTime > 0 
                ? formatDailyLoginTime(dailyLoginRemainingTime) 
                : isClaimed ? 'Done!' : 'Claim'
              }
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DailyTasks;