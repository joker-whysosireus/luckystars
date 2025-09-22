import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import PageTransition from './Assets/Transition/PageTransition.jsx';
import Loader from './Assets/Loader/Loader.jsx';
import Store from './Pages/Store/Store.jsx';

const AUTH_FUNCTION_URL = 'https://lucky-stars-backend.netlify.app/.netlify/functions/auth';

const App = () => {
    const location = useLocation();
    const [isActive, setIsActive] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);
    const [telegramReady, setTelegramReady] = useState(false);
    const adIntervalRef = useRef(null);

    // Инициализация рекламы
    useEffect(() => {
        console.log("App.jsx: Инициализация рекламных SDK");

        // Функция для показа рекламы
        window.showAd = function() {
            if (window.adexiumAds) {
                console.log('Показ рекламы через Adexium');
                // Adexium автоматически показывает рекламу в autoMode
            } else if (window.gigaOfferWallSDK) {
                console.log('Показ рекламы через Offer Wall');
                window.openOfferWall();
            } else {
                console.log('Рекламные SDK не загружены');
                // Попытка переинициализации
                initializeAdexium();
            }
        };

        // Инициализация Adexium
        const initializeAdexium = () => {
            if (typeof AdexiumWidget === 'undefined') {
                console.error('AdexiumWidget не загружен');
                return false;
            }

            try {
                window.adexiumAds = new AdexiumWidget({
                    wid: 'e279c53e-42c1-42b9-93be-a535d900a92e',
                    adFormat: 'push-like',
                    firstAdImpressionIntervalInSeconds: 30,
                    adImpressionIntervalInSeconds: 30,
                    debug: false,
                    isFullScreen: true
                });

                // Обработчики событий Adexium
                window.adexiumAds.on('adReceived', function(ad) {
                    console.log('Adexium: Реклама получена', ad);
                });
                
                window.adexiumAds.on('noAdFound', function() {
                    console.log('Adexium: Реклама недоступна');
                });
                
                window.adexiumAds.on('adDisplayed', function() {
                    console.log('Adexium: Реклама показана');
                });

                window.adexiumAds.autoMode();
                console.log('Adexium инициализирован успешно');
                return true;
                
            } catch (error) {
                console.error('Ошибка инициализации Adexium:', error);
                return false;
            }
        };

        // Инициализация Offer Wall
        const initializeOfferWall = () => {
            (window.loadGigaSDKCallbacks || (window.loadGigaSDKCallbacks = [])).push(() => {
                window.loadOfferWallSDK({
                    projectId: '3186'
                })
                .then(sdk => {
                    console.log('Offer Wall SDK загружен успешно');
                    window.gigaOfferWallSDK = sdk;
                    
                    sdk.on('rewardClaim', async (data) => {
                        console.log('Награда получена:', data);
                        const confirmationHash = await verifyWithYourBackend(data);
                        if (confirmationHash) {
                            sdk.confirmReward(data.rewardId, confirmationHash);
                        }
                    });
                    
                    window.openOfferWall = function() {
                        if (window.gigaOfferWallSDK) {
                            window.gigaOfferWallSDK.open();
                        }
                    };
                })
                .catch(error => {
                    console.error('Ошибка загрузки Offer Wall SDK:', error);
                });
            });
        };

        // Функция проверки наград
        const verifyWithYourBackend = async (reward) => {
            try {
                const response = await fetch('/api/verify-reward', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reward)
                });
                
                const result = await response.json();
                return result.success ? result.confirmationHash : null;
            } catch (error) {
                console.error('Ошибка проверки награды:', error);
                return null;
            }
        };

        // Инициализируем рекламные SDK
        initializeAdexium();
        initializeOfferWall();

        return () => {
            // Очистка при размонтировании
            if (adIntervalRef.current) {
                clearInterval(adIntervalRef.current);
            }
        };
    }, []);

    // Запуск автоматического показа рекламы после аутентификации
    useEffect(() => {
        if (!authCheckLoading && userData) {
            console.log('Запуск автоматического показа рекламы');

            // Первый показ через 10 секунд после загрузки
            const initialTimeout = setTimeout(() => {
                if (window.showAd) {
                    window.showAd();
                }
            }, 10000);

            // Интервал каждые 30 секунд
            adIntervalRef.current = setInterval(() => {
                if (window.showAd) {
                    console.log('Автоматический показ рекламы (30 секунд)');
                    window.showAd();
                }
            }, 30000);

            return () => {
                clearTimeout(initialTimeout);
                if (adIntervalRef.current) {
                    clearInterval(adIntervalRef.current);
                }
            };
        }
    }, [authCheckLoading, userData]);

    // Обработчик изменения видимости страницы
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Страница неактивна - приостанавливаем рекламу
                if (adIntervalRef.current) {
                    clearInterval(adIntervalRef.current);
                    console.log('Реклама приостановлена (страница неактивна)');
                }
            } else if (!authCheckLoading && userData) {
                // Страница снова активна - возобновляем рекламу
                adIntervalRef.current = setInterval(() => {
                    if (window.showAd) {
                        window.showAd();
                    }
                }, 30000);
                console.log('Реклама возобновлена (страница активна)');
                
                // Показываем рекламу сразу после возвращения
                setTimeout(() => {
                    if (window.showAd) {
                        window.showAd();
                    }
                }, 2000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [authCheckLoading, userData]);

    // Оригинальный useEffect для Telegram WebApp
    useEffect(() => {
        console.log("App.jsx: useEffect triggered");

        const isTelegramWebApp = () => {
            try {
                return window.Telegram && window.Telegram.WebApp;
            } catch (e) {
                return false;
            }
        };

        if (isTelegramWebApp()) {
            try {
                const webApp = window.Telegram.WebApp;
                console.log("Telegram WebApp detected, initializing...");
                
                webApp.setHeaderColor('#ffa500');
                webApp.expand();
                
                if (webApp.disableSwipeToClose) {
                    webApp.disableSwipeToClose();
                }
                
                if (webApp.enableClosingConfirmation) {
                    webApp.enableClosingConfirmation();
                }
                
                console.log("Telegram WebApp initialized successfully");
                setTelegramReady(true);
            } catch (error) {
                console.error("Error initializing Telegram WebApp:", error);
                setTelegramReady(true);
            }
        } else {
            console.warn("Not in Telegram WebApp environment, running in standalone mode");
            setTelegramReady(true);
        }

        return () => {
            if (isTelegramWebApp() && window.Telegram.WebApp.disableClosingConfirmation) {
                window.Telegram.WebApp.disableClosingConfirmation();
            }
        };
    }, []);

    useEffect(() => {
        if (['/', '/friends', '/tasks'].includes(location.pathname)) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [location.pathname]);

    useEffect(() => {
        if (telegramReady) {
            console.log("App.jsx: Starting authentication check");
            
            const getInitData = () => {
                try {
                    return window.Telegram?.WebApp?.initData || '';
                } catch (e) {
                    return '';
                }
            };

            const initData = getInitData();
            console.log("App.jsx: initData available:", !!initData);

            if (initData) {
                console.log("App.jsx: Sending authentication request");
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Authentication timeout")), 10000)
                );
                
                const authPromise = fetch(AUTH_FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ initData }),
                });

                Promise.race([authPromise, timeoutPromise])
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("App.jsx: Authentication response received");
                        if (data.isValid) {
                            console.log("App.jsx: Authentication successful");
                            setUserData(data.userData);
                        } else {
                            console.error("App.jsx: Authentication failed");
                            setUserData(null);
                        }
                    })
                    .catch(error => {
                        console.error("App.jsx: Authentication error:", error);
                        setUserData(null);
                    })
                    .finally(() => {
                        console.log("App.jsx: Authentication process completed");
                        setAuthCheckLoading(false);
                    });
            } else {
                console.warn("App.jsx: No initData available");
                setAuthCheckLoading(false);
            }
        }
    }, [telegramReady]);

    const updateUserData = async () => {
        try {
            const initData = window.Telegram?.WebApp?.initData || '';
            const response = await axios.post(AUTH_FUNCTION_URL, { initData });
            setUserData(response.data.userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    if (!telegramReady && !window.Telegram) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#000',
                color: '#fff'
            }}>
                <div>
                    <h1>Это приложение работает только в Telegram</h1>
                    <p>Откройте его через Telegram-бота</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {authCheckLoading ? (
                <Loader success={userData !== null} />
            ) : (
                <PageTransition location={location}>
                    <Routes location={location}>
                        <Route path="/" element={<HomePage isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
                        <Route path="/friends" element={<Friends isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
                        <Route path="/tasks" element={<Tasks isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
                        <Route path="/store" element={<Store isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
                    </Routes>
                </PageTransition>
            )}
        </>
    );
};

const Main = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default Main;