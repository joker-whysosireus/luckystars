import { useState, useEffect, useCallback } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import './Tasks.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';
import { Diamond, Box } from 'lucide-react';

// Константа для зоны Monetag
const MONETAG_ZONE_ID = "9896477";

function Tasks({ isActive, userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monetagAdCount, setMonetagAdCount] = useState(() => {
    const storedCount = localStorage.getItem('monetagAdCount');
    return storedCount ? parseInt(storedCount) : 0;
  });
  const [monetagCooldownEnd, setMonetagCooldownEnd] = useState(() => {
    const storedEnd = localStorage.getItem('monetagCooldownEnd');
    return storedEnd ? parseInt(storedEnd) : 0;
  });
  const [isMonetagLoading, setIsMonetagLoading] = useState(false);
  const [monetagAdAvailable, setMonetagAdAvailable] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Сохранение состояний Monetag
  useEffect(() => {
    localStorage.setItem('monetagAdCount', monetagAdCount.toString());
    localStorage.setItem('monetagCooldownEnd', monetagCooldownEnd.toString());
  }, [monetagAdCount, monetagCooldownEnd]);

  // Вычисление оставшегося времени
  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = Date.now();
      const timeLeft = monetagCooldownEnd > now ? Math.floor((monetagCooldownEnd - now) / 1000) : 0;
      setRemainingTime(timeLeft);
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [monetagCooldownEnd]);

  // Проверка доступности функции Monetag
  useEffect(() => {
    const checkMonetagFunction = () => {
      if (window[`show_${MONETAG_ZONE_ID}`] && typeof window[`show_${MONETAG_ZONE_ID}`] === 'function') {
        setMonetagAdAvailable(true);
      } else {
        setMonetagAdAvailable(false);
      }
    };
    
    checkMonetagFunction();
    const intervalId = setInterval(checkMonetagFunction, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const dailyTasks = [
    { 
      id: 10, 
      title: 'Daily Login', 
      reward: 10, 
      rewardType: 'diamonds',
      progress: 1, 
      total: 1, 
      completed: true,
    }
  ];

  const mainTasks = [
    { 
      id: 0, 
      title: 'Join Telegram Channel', 
      reward: 50, 
      rewardType: 'diamonds',
      progress: 1, 
      total: 1, 
      completed: true,
    },
    { 
      id: 1, 
      title: 'Watch 10 Ads', 
      reward: 5, 
      rewardType: 'blocks',
      progress: monetagAdCount, 
      total: 10, 
      completed: monetagAdCount >= 10,
      type: 'monetag'
    },
    { 
      id: 8, 
      title: 'Watch 50 Ads', 
      reward: 25, 
      rewardType: 'blocks',
      progress: monetagAdCount, 
      total: 50, 
      completed: monetagAdCount >= 50,
      type: 'monetag'
    },
    { 
      id: 9, 
      title: 'Watch 100 Ads', 
      reward: 50, 
      rewardType: 'blocks',
      progress: monetagAdCount, 
      total: 100, 
      completed: monetagAdCount >= 100,
      type: 'monetag'
    },
    { 
      id: 2, 
      title: 'Open 10 Blocks', 
      reward: 25, 
      rewardType: 'diamonds',
      progress: userData?.open_blocks || 0, 
      total: 10, 
      completed: (userData?.open_blocks || 0) >= 10
    },
    { 
      id: 3, 
      title: 'Open 50 Blocks', 
      reward: 50, 
      rewardType: 'diamonds',
      progress: userData?.open_blocks || 0, 
      total: 50, 
      completed: (userData?.open_blocks || 0) >= 50
    },
    { 
      id: 4, 
      title: 'Open 100 Blocks', 
      reward: 100, 
      rewardType: 'diamonds',
      progress: userData?.open_blocks || 0, 
      total: 100, 
      completed: (userData?.open_blocks || 0) >= 100
    },
    { 
      id: 5, 
      title: 'Invite 5 Friends', 
      reward: 50, 
      rewardType: 'diamonds',
      progress: userData?.invited_friends || 0, 
      total: 5, 
      completed: (userData?.invited_friends || 0) >= 5
    },
    { 
      id: 6, 
      title: 'Invite 15 Friends', 
      reward: 150, 
      rewardType: 'diamonds',
      progress: userData?.invited_friends || 0, 
      total: 15, 
      completed: (userData?.invited_friends || 0) >= 15
    },
    { 
      id: 7, 
      title: 'Invite 50 Friends', 
      reward: 500, 
      rewardType: 'diamonds',
      progress: userData?.invited_friends || 0, 
      total: 50, 
      completed: (userData?.invited_friends || 0) >= 50
    }
  ];

  const partnersTasks = [];

  // Обработка показа рекламы Monetag
  const handleMonetagAd = useCallback(() => {
    if (!monetagAdAvailable || isMonetagLoading || remainingTime > 0) return;
    
    setIsMonetagLoading(true);
    
    const showAdFunction = window[`show_${MONETAG_ZONE_ID}`];
    
    if (typeof showAdFunction !== 'function') {
      console.error('Monetag show function not available');
      setIsMonetagLoading(false);
      return;
    }
    
    showAdFunction({ 
      ymid: userData.telegram_user_id || 'anonymous'
    })
    .then(() => {
      const newCount = monetagAdCount + 1;
      setMonetagAdCount(newCount);
      
      // Устанавливаем кулдаун 30 минут после каждого просмотра
      const cooldownEnd = Date.now() + 30 * 60 * 1000;
      setMonetagCooldownEnd(cooldownEnd);
    })
    .catch((error) => {
      console.error('Monetag ad error:', error);
    })
    .finally(() => {
      setIsMonetagLoading(false);
    });
  }, [monetagAdAvailable, isMonetagLoading, remainingTime, userData, monetagAdCount]);

  const handleClaimReward = async (task, section) => {
    try {
      let response;
      let endpoint;
      
      if (task.rewardType === 'diamonds') {
        endpoint = 'https://lucky-stars-backend.netlify.app/.netlify/functions/increment-shards';
      } else if (task.rewardType === 'blocks') {
        endpoint = 'https://lucky-stars-backend.netlify.app/.netlify/functions/increment-blocks';
      } else {
        console.error('Unknown reward type');
        return;
      }

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_user_id: userData.telegram_user_id,
          amount: task.reward
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Обновляем userData
        if (task.rewardType === 'diamonds') {
          updateUserData({ ...userData, shards: result.newShards });
        } else if (task.rewardType === 'blocks') {
          updateUserData({ ...userData, bloks_count: result.newBloksCount });
        }
        alert('Reward claimed successfully!');
      } else {
        alert('Error claiming reward: ' + result.error);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Error claiming reward');
    }
  };

  const renderRewardText = (reward, rewardType) => {
    return (
      <span className="reward-text">
        {reward} 
        {rewardType === 'diamonds' ? <Diamond size={16} /> : <Box size={16} />}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderTaskItem = (task, section) => {
    const progressPercentage = (task.progress / task.total) * 100;
    const canClaim = task.completed || progressPercentage >= 100;
    
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
        {task.type === 'monetag' ? (
          <button 
            className={`claim-btn ${remainingTime > 0 ? 'disabled' : ''}`}
            onClick={handleMonetagAd}
            disabled={remainingTime > 0 || isMonetagLoading || !monetagAdAvailable}
          >
            {!monetagAdAvailable ? "Unavailable" : 
             remainingTime > 0 ? formatTime(remainingTime) : 
             isMonetagLoading ? "Loading..." : 
             "Watch Ad"}
          </button>
        ) : (
          <button 
            className={`claim-btn ${canClaim ? 'active' : 'disabled'}`}
            onClick={() => canClaim && handleClaimReward(task, section)}
            disabled={!canClaim}
          >
            {canClaim ? 'Claim' : `${task.progress}/${task.total}`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="tasks-page dark-theme">
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />
      
      <div className="tasks-content">
        <div className="tasks-section">
          <div className="section-header">
            <h2>Daily Tasks</h2>
          </div>
          
          {dailyTasks.length > 0 ? (
            dailyTasks.map(task => renderTaskItem(task, 'daily'))
          ) : (
            <div className="empty-state">
              <p>No daily tasks available</p>
            </div>
          )}
        </div>
        
        <div className="tasks-section">
          <div className="section-header">
            <h2>Main Tasks</h2>
          </div>
          
          {mainTasks.length > 0 ? (
            mainTasks.map(task => renderTaskItem(task, 'main'))
          ) : (
            <div className="empty-state">
              <p>No tasks available</p>
            </div>
          )}
        </div>
        
        <div className="tasks-section">
          <div className="section-header">
            <h2>Partners Tasks</h2>
          </div>
          
          {partnersTasks.length > 0 ? (
            partnersTasks.map(task => renderTaskItem(task, 'partners'))
          ) : (
            <div className="empty-state">
              <p>No partner tasks available</p>
            </div>
          )}
        </div>
      </div>
      
      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </div>
  );
}

export default Tasks;