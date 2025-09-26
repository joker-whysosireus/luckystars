import { useState, useEffect } from "react";
import Confetti from 'react-confetti';
import Menu from '../../Assets/Menus/Menu/Menu';
import "./Store.css";
import FixedTopSection from "../Home/Containers/TopSection/FixedTopSection";
import InfoModal from "../../Assets/Modal/InfoModal";
import ConfirmModal from "./Containers/Modal/ConfirmModal";
import Bear from "./Containers/img-jsx/Bear";
import Bucket from "./Containers/img-jsx/Bucket";
import Flower from "./Containers/img-jsx/Flower";
import Gift from "./Containers/img-jsx/Gift";
import Heart from "./Containers/img-jsx/Heart";
import Tort from "./Containers/img-jsx/Tort";
import Stars from "./Containers/img-jsx/Stars";
import { Diamond } from "lucide-react";
import axios from 'axios';

function Store({ userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userGifts, setUserGifts] = useState({});
  const [selectedGift, setSelectedGift] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [confettiOpacity, setConfettiOpacity] = useState(1);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openConfirmModal = (gift) => {
    setSelectedGift(gift);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedGift(null);
  };

  const gifts = [
    { id: 1, component: Bear, price: 15, name: "bear", displayName: "Bear" },
    { id: 5, component: Heart, price: 15, name: "heart", displayName: "Heart" },
    { id: 4, component: Gift, price: 25, name: "gift", displayName: "Gift" },
    { id: 3, component: Flower, price: 25, name: "flower", displayName: "Flower" },
    { id: 6, component: Tort, price: 50, name: "tort", displayName: "Cake" },
    { id: 2, component: Bucket, price: 50, name: "bucket", displayName: "Bouquet" }
  ];

  // Загрузка данных о подарках пользователя
  useEffect(() => {
    if (userData && userData.telegram_user_id) {
      fetchUserGifts();
    }
  }, [userData]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setConfettiOpacity(1);
    setConfettiKey(prev => prev + 1);
    
    // Плавное исчезновение конфетти
    const fadeOutInterval = setInterval(() => {
      setConfettiOpacity(prev => Math.max(0, prev - 0.05));
    }, 200);
    
    // Полное отключение конфетти через 5 секунд
    setTimeout(() => {
      clearInterval(fadeOutInterval);
      setShowConfetti(false);
      setConfettiOpacity(1);
    }, 5000);
  };

  const fetchUserGifts = async () => {
    try {
      const response = await axios.post(
        'https://giftsblocksbackend.store/.netlify/functions/get-user-gifts',
        {
          telegram_user_id: userData.telegram_user_id
        }
      );

      if (response.data.success) {
        setUserGifts(response.data.gifts);
      }
    } catch (error) {
      console.error("Error fetching user gifts:", error);
    }
  };

  const handleBuyClick = (gift) => {
    openConfirmModal(gift);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedGift) return;
    
    // Проверяем, достаточно ли алмазов
    if ((userData?.shards || 0) < selectedGift.price) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup({
          title: "Not Enough Diamonds",
          message: `You need ${selectedGift.price} diamonds to buy this ${selectedGift.displayName}.`,
          buttons: [{ type: "ok" }]
        });
      }
      closeConfirmModal();
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(
        'https://giftsblocksbackend.store/.netlify/functions/buy-gift',
        {
          telegram_user_id: userData.telegram_user_id,
          gift_name: selectedGift.name,
          gift_price: selectedGift.price
        }
      );

      if (response.data.success) {
        // Обновляем данные пользователя
        updateUserData({
          ...userData,
          shards: response.data.newShards,
          [selectedGift.name]: (userData[selectedGift.name] || 0) + 1
        });
        
        // Обновляем список подарков
        setUserGifts(prev => ({
          ...prev,
          [selectedGift.name]: (prev[selectedGift.name] || 0) + 1
        }));

        // Запускаем конфетти
        triggerConfetti();

        // Показываем сообщение об успехе
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showPopup({
            title: "Success!",
            message: `You've successfully purchased a ${selectedGift.displayName}.`,
            buttons: [{ type: "ok" }]
          });
        }
      } else {
        throw new Error(response.data.error || "Purchase failed");
      }
    } catch (error) {
      console.error("Error buying gift:", error);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup({
          title: "Error",
          message: "Failed to purchase gift. Please try again.",
          buttons: [{ type: "ok" }]
        });
      }
    } finally {
      setIsProcessing(false);
      closeConfirmModal();
    }
  };

  return (
    <section className="profile-page">
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: confettiOpacity,
          transition: 'opacity 2s ease-in-out',
          zIndex: 10000,
        }}>
          <Confetti
            key={confettiKey}
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
          />
        </div>
      )}
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />
      
      <div className="store-content">
        <div className="gifts-grid">
          {gifts.map((gift) => {
            const GiftComponent = gift.component;
            const userGiftCount = userGifts[gift.name] || 0;
            
            return (
              <div key={gift.id} className="gift-card">
                <div className="gift-header">
                  <div className="price-badge">
                    {gift.price} <Stars />
                  </div>
                  <div className="user-count">You: {userGiftCount}</div>
                </div>
                
                <div className="gift-image">
                  <GiftComponent />
                </div>
                
                <button 
                  className="buy-button"
                  onClick={() => handleBuyClick(gift)}
                >
                  <span className="button-content">
                    Buy for {gift.price} <Diamond size={14} />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        gift={selectedGift}
        onConfirm={handleConfirmPurchase}
        isProcessing={isProcessing}
      />

      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
             
      <Menu />
    </section>
  );
}

export default Store;