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

    useEffect(() => {
        console.log("App.jsx: useEffect triggered");

        // Проверяем, что находимся в Telegram WebApp
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
                
                // Основные настройки WebApp
                webApp.setHeaderColor('#ffa500');
                webApp.expand();
                
                // Отключаем закрытие свайпом
                if (webApp.disableSwipeToClose) {
                    webApp.disableSwipeToClose();
                }
                
                // Включаем подтверждение закрытия
                if (webApp.enableClosingConfirmation) {
                    webApp.enableClosingConfirmation();
                }
                
                console.log("Telegram WebApp initialized successfully");
                setTelegramReady(true);
            } catch (error) {
                console.error("Error initializing Telegram WebApp:", error);
                setTelegramReady(true); // Все равно продолжаем, даже если есть ошибки
            }
        } else {
            console.warn("Not in Telegram WebApp environment, running in standalone mode");
            setTelegramReady(true); // Продолжаем работу вне Telegram
        }

        return () => {
            // Cleanup
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
            
            // Функция для безопасного получения initData
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
                
                // Добавляем таймаут для запроса
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

    // Если приложение не в среде Telegram, показываем заглушку
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