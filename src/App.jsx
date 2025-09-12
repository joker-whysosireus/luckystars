import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './Pages/Home/HomePage.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import PageTransition from './Assets/Transition/PageTransition.jsx';
import Loader from './Assets/Loader/Loader.jsx';
import Store from './Pages/Store/Store.jsx';
import telegramAnalytics from '@telegram-apps/analytics'; 

const AUTH_FUNCTION_URL = 'https://lucky-stars-backend.netlify.app/.netlify/functions/auth';

const App = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);
    const [telegramReady, setTelegramReady] = useState(false);
    const previousPathRef = useRef('/'); // Храним предыдущий путь

    useEffect(() => {
        console.log("App.jsx: useEffect triggered");

        // Устанавливаем цвет заголовка в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#ffa500');
        }

        // Обновляем предыдущий путь при изменении location
        previousPathRef.current = location.pathname;

        if (typeof window.Telegram !== 'undefined' && typeof window.Telegram.WebApp !== 'undefined') {
            try {
                window.Telegram.WebApp.enableClosingConfirmation();
                console.log("Telegram WebApp initialized");
                setTelegramReady(true);
            } catch (error) {
                console.error("App.jsx: Error initializing Telegram WebApp:", error);
                setTelegramReady(false); 
            }
        } else {
            console.warn("Telegram WebApp not found");
            setTelegramReady(false); 
        }

        return () => {
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.disableClosingConfirmation();
                window.Telegram.WebApp.BackButton.offClick();
            }
        };
    }, [location]); // Добавляем location в зависимости

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
            console.log("App.jsx: Auth useEffect triggered");
            const initData = window.Telegram?.WebApp?.initData || '';
            console.log("App.jsx: initData:", initData);

            const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe || {};
            console.log("App.jsx: initDataUnsafe:", initDataUnsafe);

            console.log("App.jsx: AUTH_FUNCTION_URL:", AUTH_FUNCTION_URL);

            if (initData) {
                console.log("App.jsx: initData exists, sending request");
                console.log("App.jsx: Sending initData:", initData);

                fetch(AUTH_FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ initData }),
                })
                    .then(response => {
                        console.log("App.jsx: Response status:", response.status);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("App.jsx: Auth data:", data);
                        if (data.isValid) {
                            console.log("App.jsx: Авторизация прошла успешно , поздравляем!");
                            setUserData(data.userData);
                            
                            setTimeout(() => {
                                setAuthCheckLoading(false);
                            }, 2000);
                        } else {
                            console.error("App.jsx: Ошибка авторизации: Недействительные данные Telegram.");
                            setUserData(null);
                            setAuthCheckLoading(false); 
                        }
                    })
                    .catch(error => {
                        console.error("App.jsx: Ошибка при запросе к Netlify Function:", error);
                        setUserData(null);
                        setAuthCheckLoading(false); 
                    })
                    .finally(() => {
                        console.log("App.jsx: Auth check complete");
                    });
            } else {
                console.warn("App.jsx: Нет данных инициализации Telegram.");
                setAuthCheckLoading(false);
            }
        } else {
            console.log("App.jsx: Telegram WebApp not ready yet, skipping auth");
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
                        <Route path="/profile" element={<Store isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
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