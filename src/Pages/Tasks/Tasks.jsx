import { useState, useEffect, useCallback } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import './Tasks.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';
import { Diamond, Box, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

// Константы для рекламных сетей
const MONETAG_ZONE_ID = "9896477";
const TARGET_TG_WIDGET_ID = "ВАШ_WIDGET_ID"; // Замените на ваш widget_id

function Tasks({ isActive, userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monetagAdCounts, setMonetagAdCounts] = useState(() => {
    const storedCounts = localStorage.getItem('monetagAdCounts');
    return storedCounts ? JSON.parse(storedCounts) : {
      1: 0, // Watch 10 Ads
      8: 0, // Watch 50 Ads
      9: 0  // Watch 100 Ads
    };
  });
  const [monetagCooldowns, setMonetagCooldowns] = useState(() => {
    const storedCooldowns = localStorage.getItem('monetagCooldowns');
    return storedCooldowns ? JSON.parse(storedCooldowns) : {
      1: 0, // Watch 10 Ads
      8: 0, // Watch 50 Ads
      9: 0  // Watch 100 Ads
    };
  });
  const [isMonetagLoading, setIsMonetagLoading] = useState({
    1: false, // Watch 10 Ads
    8: false, // Watch 50 Ads
    9: false  // Watch 100 Ads
  });
  const [monetagAdAvailable, setMonetagAdAvailable] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState({
    1: 0, // Watch 10 Ads
    8: 0, // Watch 50 Ads
    9: 0  // Watch 100 Ads
  });
  const [claimedTasks, setClaimedTasks] = useState(() => {
    const stored = localStorage.getItem('claimedTasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [dailyLoginCooldown, setDailyLoginCooldown] = useState(() => {
    const stored = localStorage.getItem('dailyLoginCooldown');
    return stored ? parseInt(stored) : 0;
  });
  const [dailyLoginRemainingTime, setDailyLoginRemainingTime] = useState(0);
  const [targetTgAds, setTargetTgAds] = useState([]);
  const [isTargetTgLoading, setIsTargetTgLoading] = useState(false);
  const [targetTgError, setTargetTgError] = useState(null);
  const [targetTgLogs, setTargetTgLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Сохранение состояний в localStorage
  useEffect(() => {
    localStorage.setItem('monetagAdCounts', JSON.stringify(monetagAdCounts));
    localStorage.setItem('monetagCooldowns', JSON.stringify(monetagCooldowns));
    localStorage.setItem('claimedTasks', JSON.stringify(claimedTasks));
    localStorage.setItem('dailyLoginCooldown', dailyLoginCooldown.toString());
  }, [monetagAdCounts, monetagCooldowns, claimedTasks, dailyLoginCooldown]);

  // Вычисление оставшегося времени для Monetag задач
  useEffect(() => {
    const calculateRemainingTimes = () => {
      const now = Date.now();
      const newRemainingTimes = {};
      
      Object.keys(monetagCooldowns).forEach(taskId => {
        const timeLeft = monetagCooldowns[taskId] > now ? 
          Math.floor((monetagCooldowns[taskId] - now) / 1000) : 0;
        newRemainingTimes[taskId] = timeLeft;
      });
      
      setRemainingTimes(newRemainingTimes);
    };

    calculateRemainingTimes();
    const interval = setInterval(calculateRemainingTimes, 1000);
    return () => clearInterval(interval);
  }, [monetagCooldowns]);

  // Вычисление оставшегося времени для ежедневного входа
  useEffect(() => {
    const calculateDailyLoginRemainingTime = () => {
      const now = Date.now();
      const timeLeft = dailyLoginCooldown > now ? Math.floor((dailyLoginCooldown - now) / 1000) : 0;
      setDailyLoginRemainingTime(timeLeft);
    };

    calculateDailyLoginRemainingTime();
    const interval = setInterval(calculateDailyLoginRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [dailyLoginCooldown]);

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

  // Функция для добавления логов
  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const newLog = { timestamp, message, type };
    setTargetTgLogs(prev => [newLog, ...prev].slice(0, 20)); // Храним только последние 20 логов
  }, []);

  // Загрузка рекламы Target.TG
  const loadTargetTgAds = useCallback(async () => {
    setIsTargetTgLoading(true);
    setTargetTgError(null);
    
    try {
      // Формируем URL согласно новой документации
      const url = new URL('https://tg-adsnet-core.target.tg/api/ads/creatives/');
      
      // Добавляем обязательные параметры
      url.searchParams.append('tg_id', userData?.telegram_user_id || '');
      url.searchParams.append('widget_size', '5'); // Запрашиваем до 5 креативов
      url.searchParams.append('tg_premium', 'false'); // По умолчанию false
      url.searchParams.append('widget_id', TARGET_TG_WIDGET_ID);
      
      addLog(`Starting request to: ${url.toString()}`, 'info');
      
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      addLog(`Received response with status: ${response.status}`, 'info');
      
      if (response.status === 204) {
        // Нет контента - это нормальная ситуация
        addLog('No ads available (204 No Content)', 'info');
        setTargetTgAds([]);
      } else if (response.ok) {
        const data = await response.json();
        addLog(`Successfully loaded ads from Target.TG`, 'success');
        
        // Обрабатываем ответ (может быть массивом или одним объектом)
        if (Array.isArray(data)) {
          setTargetTgAds(data);
        } else if (data && typeof data === 'object') {
          setTargetTgAds([data]);
        } else {
          setTargetTgAds([]);
          addLog('Unexpected response format', 'warning');
        }
      } else if (response.status === 429) {
        const errorMsg = "Too many requests. Please try again later.";
        addLog(errorMsg, 'warning');
        setTargetTgError(errorMsg);
      } else {
        const errorMsg = `Server error: ${response.status}`;
        addLog(errorMsg, 'error');
        setTargetTgError(errorMsg);
      }
    } catch (error) {
      const errorMsg = `Network error: ${error.message}`;
      addLog(errorMsg, 'error');
      console.error('Error loading Target.TG ads:', error);
      setTargetTgError(errorMsg);
    } finally {
      addLog('Request completed', 'info');
      setIsTargetTgLoading(false);
    }
  }, [userData, addLog]);

  useEffect(() => {
    addLog('Component mounted, loading Target.TG ads...', 'info');
    loadTargetTgAds();
  }, [loadTargetTgAds, addLog]);

  const dailyTasks = [
    { 
      id: 10, 
      title: 'Daily Login', 
      reward: 10, 
      rewardType: 'diamonds',
      progress: 1, 
      total: 1, 
      completed: dailyLoginRemainingTime === 0,
      type: 'dailyLogin'
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
      progress: monetagAdCounts[1] || 0, 
      total: 10, 
      completed: (monetagAdCounts[1] || 0) >= 10,
      type: 'monetag'
    },
    { 
      id: 8, 
      title: 'Watch 50 Ads', 
      reward: 25, 
      rewardType: 'blocks',
      progress: monetagAdCounts[8] || 0, 
      total: 50, 
      completed: (monetagAdCounts[8] || 0) >= 50,
      type: 'monetag'
    },
    { 
      id: 9, 
      title: 'Watch 100 Ads', 
      reward: 50, 
      rewardType: 'blocks',
      progress: monetagAdCounts[9] || 0, 
      total: 100, 
      completed: (monetagAdCounts[9] || 0) >= 100,
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

  // Обработка показа рекламы Monetag для конкретной задачи
  const handleMonetagAd = useCallback((taskId) => {
    if (!monetagAdAvailable || isMonetagLoading[taskId] || remainingTimes[taskId] > 0) return;
    
    setIsMonetagLoading(prev => ({ ...prev, [taskId]: true }));
    
    const showAdFunction = window[`show_${MONETAG_ZONE_ID}`];
    
    if (typeof showAdFunction !== 'function') {
      console.error('Monetag show function not available');
      setIsMonetagLoading(prev => ({ ...prev, [taskId]: false }));
      return;
    }
    
    showAdFunction({ 
      ymid: userData.telegram_user_id || 'anonymous'
    })
    .then(() => {
      const newCount = (monetagAdCounts[taskId] || 0) + 1;
      setMonetagAdCounts(prev => ({ ...prev, [taskId]: newCount }));
      
      // Устанавливаем кулдаун 3 секунды после каждого просмотра
      const cooldownEnd = Date.now() + 3000;
      setMonetagCooldowns(prev => ({ ...prev, [taskId]: cooldownEnd }));
    })
    .catch((error) => {
      console.error('Monetag ad error:', error);
    })
    .finally(() => {
      setIsMonetagLoading(prev => ({ ...prev, [taskId]: false }));
    });
  }, [monetagAdAvailable, isMonetagLoading, remainingTimes, userData, monetagAdCounts]);

  // Обработка ежедневного входа
  const handleDailyLogin = useCallback(async () => {
    try {
      const response = await fetch('https://lucky-stars-backend.netlify.app/.netlify/functions/increment-shards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_user_id: userData.telegram_user_id,
          amount: 10
        })
      });

      const result = await response.json();

      if (response.ok) {
        updateUserData({ ...userData, shards: result.newShards });
        setClaimedTasks(prev => [...prev, 10]);
        
        // Устанавливаем кулдаун 12 часов
        const cooldownEnd = Date.now() + 12 * 60 * 60 * 1000;
        setDailyLoginCooldown(cooldownEnd);
        
        alert('Daily reward claimed successfully!');
      } else {
        alert('Error claiming daily reward: ' + result.error);
      }
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      alert('Error claiming daily reward');
    }
  }, [userData, updateUserData]);

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
        
        // Помечаем задачу как выполненную
        setClaimedTasks(prev => [...prev, task.id]);
        
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
    return `${seconds}s`;
  };

  const formatDailyLoginTime = (seconds) => {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return `${h}h ${m}m`;
    } else {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}m ${s}s`;
    }
  };

  const renderTaskItem = (task, section) => {
    const progressPercentage = (task.progress / task.total) * 100;
    const isClaimed = claimedTasks.includes(task.id);
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
        {task.type === 'monetag' ? (
          isClaimed ? (
            <button className="claim-btn done" disabled>
              Done!
            </button>
          ) : (
            <button 
              className={`claim-btn ${remainingTimes[task.id] > 0 ? 'disabled' : ''}`}
              onClick={() => handleMonetagAd(task.id)}
              disabled={remainingTimes[task.id] > 0 || isMonetagLoading[task.id] || !monetagAdAvailable}
            >
              {!monetagAdAvailable ? "Unavailable" : 
               remainingTimes[task.id] > 0 ? formatTime(remainingTimes[task.id]) : 
               isMonetagLoading[task.id] ? "Loading..." : 
               `${task.progress}/${task.total}`}
            </button>
          )
        ) : task.type === 'dailyLogin' ? (
          isClaimed || dailyLoginRemainingTime > 0 ? (
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
          )
        ) : (
          <button 
            className={`claim-btn ${canClaim ? 'active' : isClaimed ? 'done' : 'disabled'}`}
            onClick={() => canClaim && handleClaimReward(task, section)}
            disabled={isClaimed || !canClaim}
          >
            {isClaimed ? 'Done!' : canClaim ? 'Claim' : `${task.progress}/${task.total}`}
          </button>
        )}
      </div>
    );
  };

  const renderTargetTgAd = (ad) => {
    return (
      <div key={ad.creative_id} className="target-tg-ad">
        <div className="ad-content">
          {ad.icon && (
            <img src={ad.icon} alt={ad.title} className="ad-icon" />
          )}
          <div className="ad-text">
            <h4 className="ad-title">{ad.title || 'Sponsored Offer'}</h4>
            <p className="ad-description">{ad.description || 'Special offer for our users'}</p>
          </div>
        </div>
        <a 
          href={ad.click_link || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ad-link"
        >
          Participate
        </a>
      </div>
    );
  };

  const renderLogItem = (log, index) => {
    const logTime = new Date(log.timestamp).toLocaleTimeString();
    return (
      <div key={index} className={`log-item log-${log.type}`}>
        <span className="log-time">[{logTime}]</span>
        <span className="log-message">{log.message}</span>
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

        {/* Блок рекламы Target.TG */}
        <div className="tasks-section">
          <div className="section-header">
            <h2>Sponsored Offers</h2>
            <button 
              className="refresh-btn"
              onClick={loadTargetTgAds}
              title="Refresh ads"
              disabled={isTargetTgLoading}
            >
              <RefreshCw size={16} className={isTargetTgLoading ? "spinner" : ""} />
            </button>
          </div>
          
          {isTargetTgLoading ? (
            <div className="empty-state">
              <p>Loading sponsored offers...</p>
            </div>
          ) : targetTgError ? (
            <div className="empty-state">
              <p>{targetTgError}</p>
            </div>
          ) : targetTgAds.length > 0 ? (
            <div className="target-tg-ads">
              {targetTgAds.map(ad => renderTargetTgAd(ad))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No sponsored offers available at the moment</p>
            </div>
          )}

          {/* Блок логов Target.TG */}
          <div className="target-tg-logs">
            <div 
              className="logs-header" 
              onClick={() => setShowLogs(!showLogs)}
            >
              <h3>Target.TG Logs</h3>
              {showLogs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {showLogs && (
              <div className="logs-content">
                {targetTgLogs.length > 0 ? (
                  targetTgLogs.map((log, index) => renderLogItem(log, index))
                ) : (
                  <div className="empty-state">
                    <p>No logs available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </div>
  );
}

export default Tasks;