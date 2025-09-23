import React from 'react';
import { Box, Diamond } from 'lucide-react';

const DailyTasks = ({ 
  tasks, 
  dailyLoginRemainingTime, 
  handleDailyLogin, 
  formatDailyLoginTime, 
  isClaiming 
}) => {
  if (!tasks || tasks.length === 0) return null;

  // Функция форматирования времени в формат 12:00
  const formatTimer = (seconds) => {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    } else {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2>Daily Tasks</h2>
      </div>
      
      {tasks.map(task => {
        const progressPercentage = dailyLoginRemainingTime === 0 ? 100 : 0;

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
                <span>{dailyLoginRemainingTime === 0 ? 1 : 0}/1</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            
            <button 
              className={`claim-btn daily-login ${
                dailyLoginRemainingTime > 0 || isClaiming ? 'disabled' : 'active'
              }`}
              onClick={() => handleDailyLogin(task)}
              disabled={dailyLoginRemainingTime > 0 || isClaiming}
            >
              {dailyLoginRemainingTime > 0 
                ? formatTimer(dailyLoginRemainingTime) 
                : 'Claim'
              }
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DailyTasks;