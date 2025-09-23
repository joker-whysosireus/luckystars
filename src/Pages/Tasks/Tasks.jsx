import { useState, useEffect, useCallback } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import './Tasks.css';
import FixedTopSection from '../Home/Containers/TopSection/FixedTopSection';
import InfoModal from '../../Assets/Modal/InfoModal';
import DailyTasks from './Containers/Day/DailyTasks';
import MainTasks from './Containers/Main/MainTasks';
import PartnersTasks from './Containers/Partners/PartnersTasks';

function Tasks({ isActive, userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gigapubAdCounts, setGigapubAdCounts] = useState(() => {
    const storedCounts = localStorage.getItem('gigapubAdCounts');
    return storedCounts ? JSON.parse(storedCounts) : {
      1: 0, // Watch 10 Ads
      8: 0, // Watch 50 Ads
      9: 0  // Watch 100 Ads
    };
  });
  const [gigapubCooldowns, setGigapubCooldowns] = useState(() => {
    const storedCooldowns = localStorage.getItem('gigapubCooldowns');
    return storedCooldowns ? JSON.parse(storedCooldowns) : {
      1: 0, // Watch 10 Ads
      8: 0, // Watch 50 Ads
      9: 0  // Watch 100 Ads
    };
  });
  const [isGigapubLoading, setIsGigapubLoading] = useState({
    1: false, // Watch 10 Ads
    8: false, // Watch 50 Ads
    9: false  // Watch 100 Ads
  });
  const [gigapubAdAvailable, setGigapubAdAvailable] = useState(false);
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
  const [isClaiming, setIsClaiming] = useState(false); // Защита от двойного клика

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Автоматический показ рекламы Adexium каждые 30 секунд
  useEffect(() => {
    const adexiumInterval = setInterval(() => {
      console.log("Adexium реклама должна показываться автоматически");
      
      // Дополнительная проверка и ручной вызов если нужно
      if (window.showAd && typeof window.showAd === 'function') {
        try {
          window.showAd();
        } catch (error) {
          console.error("Ошибка при автоматическом показе Adexium:", error);
        }
      }
    }, 30000); // 30 секунд

    return () => clearInterval(adexiumInterval);
  }, []);

  // Сохранение состояний в localStorage
  useEffect(() => {
    localStorage.setItem('gigapubAdCounts', JSON.stringify(gigapubAdCounts));
    localStorage.setItem('gigapubCooldowns', JSON.stringify(gigapubCooldowns));
    localStorage.setItem('claimedTasks', JSON.stringify(claimedTasks));
    localStorage.setItem('dailyLoginCooldown', dailyLoginCooldown.toString());
  }, [gigapubAdCounts, gigapubCooldowns, claimedTasks, dailyLoginCooldown]);

  // Вычисление оставшегося времени для GigaPub задач
  useEffect(() => {
    const calculateRemainingTimes = () => {
      const now = Date.now();
      const newRemainingTimes = {};
      
      Object.keys(gigapubCooldowns).forEach(taskId => {
        const timeLeft = gigapubCooldowns[taskId] > now ? 
          Math.floor((gigapubCooldowns[taskId] - now) / 1000) : 0;
        newRemainingTimes[taskId] = timeLeft;
      });
      
      setRemainingTimes(newRemainingTimes);
    };

    calculateRemainingTimes();
    const interval = setInterval(calculateRemainingTimes, 1000);
    return () => clearInterval(interval);
  }, [gigapubCooldowns]);

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

  // Проверка доступности функции GigaPub
  useEffect(() => {
    const checkGigapubFunction = () => {
      if (window.showGiga && typeof window.showGiga === 'function') {
        setGigapubAdAvailable(true);
      } else {
        setGigapubAdAvailable(false);
        // Fallback логика: если GigaPub недоступен, используйте резервный метод
        if (window.AdGigaFallback && typeof window.AdGigaFallback === 'function') {
          // Создаем fallback функцию
          window.showGiga = () => window.AdGigaFallback();
          setGigapubAdAvailable(true);
        }
      }
    };
    
    // Проверяем сразу при монтировании
    checkGigapubFunction();
    
    // Периодически проверяем доступность (каждые 5 секунд)
    const intervalId = setInterval(checkGigapubFunction, 5000);
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
      type: 'url',
      url: 'https://t.me/your_channel' // Замените на реальный URL
    },
    { 
      id: 1, 
      title: 'Watch 10 Ads', 
      reward: 5, 
      rewardType: 'blocks',
      progress: gigapubAdCounts[1] || 0, 
      total: 10, 
      completed: (gigapubAdCounts[1] || 0) >= 10,
      type: 'gigapub'
    },
    { 
      id: 8, 
      title: 'Watch 50 Ads', 
      reward: 25, 
      rewardType: 'blocks',
      progress: gigapubAdCounts[8] || 0, 
      total: 50, 
      completed: (gigapubAdCounts[8] || 0) >= 50,
      type: 'gigapub'
    },
    { 
      id: 9, 
      title: 'Watch 100 Ads', 
      reward: 50, 
      rewardType: 'blocks',
      progress: gigapubAdCounts[9] || 0, 
      total: 100, 
      completed: (gigapubAdCounts[9] || 0) >= 100,
      type: 'gigapub'
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

  const partnersTasks = [
    { 
      id: 11, 
      title: 'Join Liquid Coin', 
      reward: 5, 
      rewardType: 'diamonds',
      progress: 1, 
      total: 1, 
      completed: claimedTasks.includes(11),
      type: 'url',
      url: 'https://t.me/liquid_coin_bot?startapp=ref_7465408366' // Замените на реальный URL
    }
  ];

  // Обработка показа рекламы GigaPub для конкретной задачи
  const handleGigapubAd = useCallback((taskId) => {
    if (!gigapubAdAvailable || isGigapubLoading[taskId] || remainingTimes[taskId] > 0) {
      console.log(`GigaPub недоступен: available=${gigapubAdAvailable}, loading=${isGigapubLoading[taskId]}, cooldown=${remainingTimes[taskId]}`);
      return;
    }
    
    setIsGigapubLoading(prev => ({ ...prev, [taskId]: true }));
    
    if (typeof window.showGiga !== 'function') {
      console.error('GigaPub show function not available');
      setIsGigapubLoading(prev => ({ ...prev, [taskId]: false }));
      return;
    }
    
    window.showGiga()
      .then(() => {
        console.log(`GigaPub реклама успешно показана для задачи ${taskId}`);
        const newCount = (gigapubAdCounts[taskId] || 0) + 1;
        setGigapubAdCounts(prev => ({ ...prev, [taskId]: newCount }));
        
        // Устанавливаем кулдаун 3 секунды
        const cooldownEnd = Date.now() + 3000;
        setGigapubCooldowns(prev => ({ ...prev, [taskId]: cooldownEnd }));
        
        console.log(`Счетчик задачи ${taskId} увеличен до ${newCount}`);
        
        // Сбрасываем счетчик при достижении максимума (цикл заново)
        const taskTotals = { 1: 10, 8: 50, 9: 100 };
        if (newCount >= taskTotals[taskId]) {
          setTimeout(() => {
            setGigapubAdCounts(prev => ({ ...prev, [taskId]: 0 }));
            console.log(`Счетчик задачи ${taskId} сброшен`);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error('GigaPub ad error:', error);
        
        // Пробуем использовать fallback
        if (window.AdGigaFallback && typeof window.AdGigaFallback === 'function') {
          console.log('Пытаемся использовать резервный метод...');
          window.AdGigaFallback()
            .then(() => {
              const newCount = (gigapubAdCounts[taskId] || 0) + 1;
              setGigapubAdCounts(prev => ({ ...prev, [taskId]: newCount }));
              const cooldownEnd = Date.now() + 3000;
              setGigapubCooldowns(prev => ({ ...prev, [taskId]: cooldownEnd }));
              console.log(`Резервный метод успешен для задачи ${taskId}`);
              
              // Сбрасываем счетчик при достижении максимума
              const taskTotals = { 1: 10, 8: 50, 9: 100 };
              if (newCount >= taskTotals[taskId]) {
                setTimeout(() => {
                  setGigapubAdCounts(prev => ({ ...prev, [taskId]: 0 }));
                  console.log(`Счетчик задачи ${taskId} сброшен`);
                }, 1000);
              }
            })
            .catch((fallbackError) => {
              console.error('Fallback ad error:', fallbackError);
              alert('Реклама временно недоступна. Попробуйте позже.');
            });
        } else {
          alert('Реклама временно недоступна. Попробуйте позже.');
        }
      })
      .finally(() => {
        setIsGigapubLoading(prev => ({ ...prev, [taskId]: false }));
      });
  }, [gigapubAdAvailable, isGigapubLoading, remainingTimes, gigapubAdCounts]);

  // Обработка ежедневного входа
  const handleDailyLogin = useCallback(async () => {
    if (isClaiming || dailyLoginRemainingTime > 0) return;
    
    setIsClaiming(true);
    
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
    } finally {
      setIsClaiming(false);
    }
  }, [userData, updateUserData, dailyLoginRemainingTime, isClaiming]);

  const handleClaimReward = async (task, section) => {
    if (isClaiming) return;
    
    setIsClaiming(true);

    try {
      // Для URL задач открываем ссылку
      if (task.type === 'url' && task.url) {
        window.open(task.url, '_blank', 'noopener,noreferrer');
      }

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
    } finally {
      setIsClaiming(false);
    }
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

  return (
    <div className="tasks-page dark-theme">
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />
      
      <div className="tasks-content">
        <DailyTasks 
          tasks={dailyTasks}
          claimedTasks={claimedTasks}
          dailyLoginRemainingTime={dailyLoginRemainingTime}
          handleDailyLogin={handleDailyLogin}
          formatDailyLoginTime={formatDailyLoginTime}
          isClaiming={isClaiming}
        />
        
        <MainTasks 
          tasks={mainTasks}
          claimedTasks={claimedTasks}
          gigapubAdAvailable={gigapubAdAvailable}
          remainingTimes={remainingTimes}
          isGigapubLoading={isGigapubLoading}
          handleGigapubAd={handleGigapubAd}
          handleClaimReward={handleClaimReward}
          formatTime={formatTime}
          isClaiming={isClaiming}
        />
        
        <PartnersTasks 
          tasks={partnersTasks}
          claimedTasks={claimedTasks}
          handleClaimReward={handleClaimReward}
          isClaiming={isClaiming}
        />
      </div>
      
      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </div>
  );
}

export default Tasks;