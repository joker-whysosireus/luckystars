import { useState, useEffect, useCallback } from 'react';
import CheckIconGetTon from '../img-jsx-ts/CheckIconGetTon';
import Telegram from "../img-jsx-ts/Telegram";
import TGcenterLogo from "../img-jsx-ts/TGcenterLogo";
import './Hight.css';
import Xlogotip from '../img-jsx-ts/Xlogotip';
import Monetag from '../img-jsx-ts/Monetag';

// Константа для зоны Monetag
const MONETAG_ZONE_ID = "9797587";

function Hight({ userData, updateUserData }) {
    // Состояния для отслеживания выполнения задач
    const [tasks, setTasks] = useState(() => {
        const storedTasksString = localStorage.getItem('tasks');
        const defaultTasks = {
            task1: false,
            task2: false
        };
        
        if (storedTasksString) {
            try {
                const parsedTasks = JSON.parse(storedTasksString);
                return { ...defaultTasks, ...parsedTasks };
            } catch (error) {
                console.error('Error parsing tasks from localStorage:', error);
                return defaultTasks;
            }
        }
        return defaultTasks;
    });

    // Состояния для Monetag (стандартные задачи)
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

    // Состояния для бустеров (50 реклам)
    const REQUIRED_ADS_BOOST = 50;
    const [boostAdCount, setBoostAdCount] = useState(() => {
        const stored = localStorage.getItem('boostAdCount');
        return stored ? parseInt(stored, 10) : REQUIRED_ADS_BOOST;
    });
    const [isCooldownBoost, setIsCooldownBoost] = useState(false);
    const [cooldownTimerBoost, setCooldownTimerBoost] = useState(0);
    const [bothBoostsGranted, setBothBoostsGranted] = useState(
        userData?.sol_boost && userData?.near_boost
    );
    const [isProcessingBoost, setIsProcessingBoost] = useState(false);
    const [grantErrorBoost, setGrantErrorBoost] = useState(false);

    // Ссылки для задач
    const TELEGRAM_CHANNEL_1 = "https://t.me/liquid_coin_channel";
    const X_URL = "https://x.com/liquid_coin_io?s=21";

    // Обновление localStorage при изменении задач
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Сохранение состояний Monetag
    useEffect(() => {
        localStorage.setItem('monetagAdCount', monetagAdCount.toString());
        localStorage.setItem('monetagCooldownEnd', monetagCooldownEnd.toString());
        localStorage.setItem('boostAdCount', boostAdCount.toString());
    }, [monetagAdCount, monetagCooldownEnd, boostAdCount]);

    // Вычисление оставшегося времени при загрузке и обновление каждую секунду
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

    // Таймер задержки для бустеров
    useEffect(() => {
        let interval;
        if (isCooldownBoost && cooldownTimerBoost > 0) {
            interval = setInterval(() => {
                setCooldownTimerBoost(prev => prev - 1000);
            }, 1000);
        } else if (cooldownTimerBoost <= 0) {
            setIsCooldownBoost(false);
        }
        return () => clearInterval(interval);
    }, [isCooldownBoost, cooldownTimerBoost]);

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

    // Синхронизация бустеров с userData
    useEffect(() => {
        const boostsGranted = userData?.sol_boost && userData?.near_boost;
        setBothBoostsGranted(boostsGranted);
    }, [userData]);

    // Форматирование времени для таймера
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Обработка показа рекламы Monetag для стандартных задач
    const handleMonetagAd = () => {
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
            
            if (newCount >= 5) {
                addPoints(500);
                const cooldownEnd = Date.now() + 1800 * 1000;
                setMonetagCooldownEnd(cooldownEnd);
                setMonetagAdCount(0);
            }
        })
        .catch((error) => {
            console.error('Monetag ad error:', error);
        })
        .finally(() => {
            setIsMonetagLoading(false);
        });
    };

    // Обработка показа рекламы Monetag для бустеров
    const handleMonetagBoostAd = () => {
        if (!monetagAdAvailable || isCooldownBoost || bothBoostsGranted || boostAdCount === 0) return;

        setIsProcessingBoost(true);

        const showAdFunction = window[`show_${MONETAG_ZONE_ID}`];
        if (typeof showAdFunction !== 'function') {
            console.error('Monetag show function not available');
            setIsProcessingBoost(false);
            return;
        }

        showAdFunction({ 
            ymid: userData.telegram_user_id || 'anonymous'
        })
        .then(() => {
            setBoostAdCount(prev => {
                const newCount = prev - 1;
                localStorage.setItem('boostAdCount', newCount.toString());
                
                if (newCount === 0) {
                    grantBothBoosts();
                }
                
                return newCount;
            });
            
            setIsCooldownBoost(true);
            setCooldownTimerBoost(15000);
        })
        .catch((error) => {
            console.error('Monetag ad error:', error);
        })
        .finally(() => {
            setIsProcessingBoost(false);
        });
    };

    // Выдача бустеров
    const grantBothBoosts = useCallback(async () => {
        if (isProcessingBoost || bothBoostsGranted) return;
        
        setIsProcessingBoost(true);
        setGrantErrorBoost(false);
        
        try {
            const response = await fetch('https://functions-user.online/.netlify/functions/grantTonBoost', {
                method: 'POST',
                mode: 'cors',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    userId: userData.telegram_user_id.toString()
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText
                });
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data && data.success) {
                setBothBoostsGranted(true);
                // Обновляем данные пользователя после получения бустеров
                updateUserData();
            } else {
                throw new Error(data?.message || 'Failed to grant boosts');
            }
        } catch (error) {
            console.error('Error granting boosts:', error);
            setGrantErrorBoost(true);
            // В случае ошибки восстанавливаем счетчик
            setBoostAdCount(REQUIRED_ADS_BOOST);
            localStorage.setItem('boostAdCount', REQUIRED_ADS_BOOST.toString());
        } finally {
            setIsProcessingBoost(false);
        }
    }, [bothBoostsGranted, isProcessingBoost, updateUserData, userData]);

    // Добавление очков на сервер
    const addPoints = async (points) => {
        try {
            const response = await fetch('https://functions-user.online/.netlify/functions/points-tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.telegram_user_id,
                    pointsToAdd: points,
                }),
            });

            const data = await response.json();

            if (data.success) {
                updateUserData();
            } else {
                console.error('Failed to add points:', data.error);
            }
        } catch (error) {
            console.error('Error calling addPoints function:', error);
        }
    };

    // Обработка выполнения других задач
    const handleTaskCompletion = async (channel, points, taskKey) => {
        const updatedTasks = { ...tasks, [taskKey]: true };
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        
        window.open(channel, '_blank');
        
        try {
            const response = await fetch('https://functions-user.online/.netlify/functions/points-tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.telegram_user_id,
                    pointsToAdd: points,
                }),
            });

            const data = await response.json();

            if (data.success) {
                updateUserData();
            } else {
                const revertedTasks = { ...tasks };
                setTasks(revertedTasks);
                localStorage.setItem('tasks', JSON.stringify(revertedTasks));
            }
        } catch (error) {
            const revertedTasks = { ...tasks };
            setTasks(revertedTasks);
            localStorage.setItem('tasks', JSON.stringify(revertedTasks));
        }
    };

    // Определение текста и состояния кнопки для блока бустеров
    let buttonTextBoost = "Start";
    let disabledBoost = false;
    
    if (bothBoostsGranted) {
        buttonTextBoost = <CheckIconGetTon />;
        disabledBoost = true;
    } else if (isCooldownBoost) {
        buttonTextBoost = `Wait ${Math.ceil(cooldownTimerBoost / 1000)}s`;
        disabledBoost = true;
    } else if (grantErrorBoost && boostAdCount === 0) {
        buttonTextBoost = 'Retry';
        disabledBoost = false;
    } else if (boostAdCount === 0) {
        buttonTextBoost = 'Processing...';
        disabledBoost = true;
    }

    return (
        <div className="mine-tasks-container">
            <div className="scrollable-tasks-container">
                <section className='vertical-tasks-chanels'>

                    {/* Блок Monetag для бустеров (50 реклам) */}
                    <article className='background-tasks'>
                        <div className='left-section-tasks'>
                            <div className='monetag-bk'>
                                <Monetag />
                            </div>
                        </div>
                        <div className='middle-section-tasks-mtb'>
                            {/* Отображаем 50 после получения бустеров вместо 0 */}
                            <span className='first-span-mid-sec'>Watch the ad {bothBoostsGranted ? REQUIRED_ADS_BOOST : boostAdCount} times</span>
                            <span className='second-span-mid-sec'>NEAR and SOL boosters</span>
                        </div>
                        <div className='right-section-tasks'>
                            <button 
                                className={`button-ads ${bothBoostsGranted ? 'completed' : ''}`}
                                onClick={grantErrorBoost && boostAdCount === 0 ? grantBothBoosts : handleMonetagBoostAd}
                                disabled={disabledBoost || !monetagAdAvailable || isProcessingBoost}
                                style={
                                    bothBoostsGranted ? { 
                                        backgroundColor: '#1c1c1e', 
                                        color: 'var(--background-color)',
                                        cursor: 'default'
                                    } :
                                    grantErrorBoost && boostAdCount === 0 ? { 
                                        backgroundColor: '#ff6b6b', 
                                        color: 'white' 
                                    } :
                                    isCooldownBoost ? { 
                                        backgroundColor: 'var(--green-color)' 
                                    } : {}
                                }
                            >
                                {!monetagAdAvailable ? "Unavailable" : 
                                 isProcessingBoost ? "Loading..." : buttonTextBoost}
                            </button>
                        </div>
                    </article>

                    {/* Стандартный блок Monetag (5 реклам) */}
                    <article className='background-tasks'>
                        <div className='left-section-tasks'>
                            <div className='monetag-bk'>
                                <Monetag />
                            </div>
                        </div>
                        <div className='middle-section-tasks-mt'>
                            <span className='first-span-mid-sec'>Watch the ad {5 - monetagAdCount} times</span>
                            <span className='second-span-mid-sec'>+500 LC, Cooldown 30 min</span>
                        </div>
                        <div className='right-section-tasks'>
                            <button 
                                className={`button-ads ${remainingTime > 0 ? 'completed' : ''}`}
                                onClick={handleMonetagAd}
                                disabled={remainingTime > 0 || isMonetagLoading || !monetagAdAvailable}
                            >
                                {!monetagAdAvailable ? "Unavailable" : 
                                 remainingTime > 0 ? formatTime(remainingTime) : 
                                 isMonetagLoading ? "Loading..." : 
                                 "Start"}
                            </button>
                        </div>
                    </article>


                    {/* Остальные задачи остаются без изменений */}
                    <article className='background-tasks'>
                        <div className='left-section-tasks'>
                            <Telegram />
                        </div>
                        <div className='middle-section-tasks-tg'>
                            <span className='first-span-mid-sec'>Follow Liquid Official</span>
                            <span className='second-span-mid-sec'>+149 LC</span>
                        </div>
                        <div className='right-section-tasks'>
                            <button 
                                className={`button-ads ${tasks.task1 ? 'completed' : ''}`} 
                                onClick={() => handleTaskCompletion(TELEGRAM_CHANNEL_1, 149, 'task1')} 
                                disabled={tasks.task1}
                            >
                                {tasks.task1 ? <CheckIconGetTon /> : "Start"} 
                            </button>
                        </div>
                    </article>

                     {/* Остальные задачи остаются без изменений */}
                    <article className='background-tasks'>
                        <div className='left-section-tasks'>
                            <Xlogotip />
                        </div>
                        <div className='middle-section-tasks-twitter'>
                            <span className='first-span-mid-sec'>Follow us on X</span>
                            <span className='second-span-mid-sec'>+149 LC</span>
                        </div>
                        <div className='right-section-tasks'>
                            <button 
                                className={`button-ads ${tasks.task2 ? 'completed' : ''}`} 
                                onClick={() => handleTaskCompletion(X_URL, 149, 'task2')} 
                                disabled={tasks.task2}
                            >
                                {tasks.task2 ? <CheckIconGetTon /> : "Start"} 
                            </button>
                        </div>
                    </article>
                    
                </section>
            </div>
        </div>
    );
}

export default Hight;