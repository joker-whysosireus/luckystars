import React from 'react';
import { Box, Diamond } from 'lucide-react';

const MainTasks = ({ 
  tasks, 
  claimedTasks, 
  gigapubAdAvailable, 
  remainingTimes, 
  isGigapubLoading, 
  handleGigapubAd, 
  handleClaimReward, 
  handleUrlTask, // Добавлен пропс handleUrlTask
  formatTime, 
  isClaiming 
}) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h2>Main Tasks</h2>
      </div>
      
      {tasks.map(task => {
        const isCompleted = task.completed;
        const isClaimed = claimedTasks.includes(task.id);
        const progressPercentage = Math.min((task.progress / task.total) * 100, 100);

        // Определяем, является ли задача блоком или приглашением друзей
        const isProgressTask = task.id >= 2 && task.id <= 7;

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
            
            <div>
              {isClaimed ? (
                <button className="claim-btn done" disabled>Done!</button>
              ) : task.type === 'url' ? ( // Добавлена обработка URL задач
                <button 
                  className="claim-btn active" 
                  onClick={() => handleUrlTask(task)}
                  disabled={isClaiming}
                >
                  {isClaiming ? '...' : 'Join'}
                </button>
              ) : isCompleted ? (
                <button 
                  className="claim-btn active" 
                  onClick={() => handleClaimReward(task)}
                  disabled={isClaiming}
                >
                  {isClaiming ? '...' : 'Claim'}
                </button>
              ) : task.type === 'gigapub' ? (
                <button 
                  className={`claim-btn ad ${
                    !gigapubAdAvailable || remainingTimes[task.id] > 0 || isGigapubLoading[task.id] 
                      ? 'disabled' 
                      : ''
                  }`}
                  onClick={() => handleGigapubAd(task.id)}
                  disabled={!gigapubAdAvailable || remainingTimes[task.id] > 0 || isGigapubLoading[task.id]}
                >
                  {isGigapubLoading[task.id] 
                    ? '...' 
                    : remainingTimes[task.id] > 0 
                      ? formatTime(remainingTimes[task.id]) 
                      : 'Watch'
                  }
                </button>
              ) : isProgressTask ? (
                <button className="claim-btn disabled" disabled>
                  {task.progress}/{task.total}
                </button>
              ) : (
                <button className="claim-btn disabled" disabled>Start</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MainTasks;