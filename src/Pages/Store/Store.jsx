import { useState, useEffect } from "react";
import Confetti from 'react-confetti';
import Menu from '../../Assets/Menus/Menu/Menu';
import "./Store.css";
import FixedTopSection from "../Home/Containers/TopSection/FixedTopSection";
import InfoModal from "../../Assets/Modal/InfoModal";
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
  const [userGifts, setUserGifts] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const gifts = [
    { id: 1, component: Bear, price: 15, name: "bear", displayName: "Bear" },
    { id: 5, component: Heart, price: 15, name: "heart", displayName: "Heart" },
    { id: 4, component: Gift, price: 25, name: "gift", displayName: "Gift" },
    { id: 3, component: Flower, price: 25, name: "flower", displayName: "Flower" },
    { id: 6, component: Tort, price: 50, name: "tort", displayName: "Tort" },
    { id: 2, component: Bucket, price: 50, name: "bucket", displayName: "Bucket" }
  ];

  // Загрузка данных о подарках пользователя
  useEffect(() => {
    if (userData && userData.telegram_user_id) {
      fetchUserGifts();
    }
  }, [userData]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setConfettiKey(prev => prev + 1);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const fetchUserGifts = async () => {
    try {
      const response = await axios.post(
        'https://functions-user.online/.netlify/functions/get-user-gifts',
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

  const handleBuyGift = async (gift) => {
    if (isProcessing) return;
    
    // Проверяем, достаточно ли алмазов
    if ((userData?.shards || 0) < gift.price) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showPopup({
          title: "Not Enough Diamonds",
          message: `You need ${gift.price} diamonds to buy this ${gift.displayName}.`,
          buttons: [{ type: "ok" }]
        });
      }
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(
        'https://functions-user.online/.netlify/functions/buy-gift',
        {
          telegram_user_id: userData.telegram_user_id,
          gift_name: gift.name,
          gift_price: gift.price
        }
      );

      if (response.data.success) {
        // Обновляем данные пользователя
        updateUserData({
          ...userData,
          shards: response.data.newShards,
          [gift.name]: (userData[gift.name] || 0) + 1
        });
        
        // Обновляем список подарков
        setUserGifts(prev => ({
          ...prev,
          [gift.name]: (prev[gift.name] || 0) + 1
        }));

        // Запускаем конфетти
        triggerConfetti();

        // Показываем сообщение об успехе
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showPopup({
            title: "Success!",
            message: `You've successfully purchased a ${gift.displayName}.`,
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
    }
  };

  return (
    <section className="profile-page">
      {showConfetti && (
        <Confetti
          key={confettiKey}
          recycle={true}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
        />
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
                  className={`buy-button ${isProcessing ? 'processing' : ''}`}
                  onClick={() => handleBuyGift(gift)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Buy for ${gift.price}`} <Diamond size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
             
      <Menu />
    </section>
  );
}

export default Store;