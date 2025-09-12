import { useEffect, useState } from 'react';
import './Home.css';
import Menu from '../../Assets/Menus/Menu/Menu';
import axios from 'axios';
import FixedTopSection from './Containers/TopSection/FixedTopSection';
import BuyBlocksSection from './Containers/BuyBlocks/BuyBlocksSection';
import InfoModal from '../../Assets/Modal/InfoModal';

function HomePage({ userData, updateUserData, isActive }) {
  const [blocks, setBlocks] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState(null);
  const [processingButton, setProcessingButton] = useState(null);
  const [webApp, setWebApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Получаем экземпляр WebApp Telegram
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webAppInstance = window.Telegram.WebApp;
      setWebApp(webAppInstance);
    }
  }, []);

  // Инициализация данных из userData
  useEffect(() => {
    if (userData) {
      // Загрузка блоков из localStorage или инициализация новых
      try {
        const savedBlocks = localStorage.getItem(`userBlocks_${userData.telegram_user_id}`);
        if (savedBlocks) {
          setBlocks(JSON.parse(savedBlocks));
        } else {
          initializeBlocks();
        }
      } catch (error) {
        console.error("Error loading blocks:", error);
        initializeBlocks();
      }
    } else {
      // Если userData не передан, все равно инициализируем блоки
      initializeBlocks();
    }
  }, [userData]);

  const initializeBlocks = () => {
    const rows = 6;
    const cols = 5;
    const initialBlocks = [];
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        initialBlocks.push({
          id: `${i}-${j}`,
          row: i,
          col: j,
          isOpened: false,
          shards: 0,
          isFlipping: false,
          isLoading: false
        });
      }
    }
    
    setBlocks(initialBlocks);
  };

  // Сохранение блоков в localStorage при изменении
  useEffect(() => {
    if (userData && blocks.length > 0) {
      try {
        localStorage.setItem(`userBlocks_${userData.telegram_user_id}`, JSON.stringify(blocks));
      } catch (error) {
        console.error("Error saving blocks:", error);
      }
    }
  }, [blocks, userData]);

  // Проверка, все ли блоки открыты
  useEffect(() => {
    if (blocks.length === 0) return;
    
    const allOpened = blocks.every(block => block.isOpened);
    if (allOpened && !isResetting) {
      setIsResetting(true);
      
      // Через 2 секунды сбрасываем все блоки и начисляем 1 блок
      setTimeout(() => {
        resetAllBlocks();
        const newBlocksCount = (userData?.bloks_count || 0) + 1;
        
        // Обновляем данные на сервере
        if (userData && updateUserData) {
          updateUserData({
            ...userData,
            bloks_count: newBlocksCount
          });
        }
      }, 2000);
    }
  }, [blocks, isResetting, userData, updateUserData]);

  const handleSquareClick = async (blockId) => {
    // Если происходит сброс блоков или анимация, игнорируем клики
    if (isResetting || isAnimating) return;
    
    // Если нет блоков для открытия - показываем уведомление
    if ((userData?.bloks_count || 0) <= 0) {
      if (webApp) {
        webApp.showPopup({
          title: "No Blocks",
          message: "You don't have any blocks to open. Buy more blocks to continue playing.",
          buttons: [{ type: "ok" }]
        });
      }
      return;
    }
    
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    
    // Если блок уже открыт или анимируется, ничего не делаем
    if (blockIndex === -1 || blocks[blockIndex].isOpened || blocks[blockIndex].isFlipping) return;
    
    // Уменьшаем счетчик блоков
    const newBlocksCount = (userData?.bloks_count || 0) - 1;
    
    // Обновляем данные на сервере
    if (userData && updateUserData) {
      updateUserData({
        ...userData,
        bloks_count: newBlocksCount
      });
    }
    
    // Блокируем другие блоки во время анимации
    setIsAnimating(true);
    
    // Случайное количество осколков (1, 5, 10, 15, 25)
    const shardValues = [1, 5, 10, 15, 25];
    const randomShards = shardValues[Math.floor(Math.random() * shardValues.length)];
    
    // Начинаем анимацию переворота
    const updatedBlocks = [...blocks];
    updatedBlocks[blockIndex] = {
      ...updatedBlocks[blockIndex],
      isFlipping: true,
      isLoading: true
    };
    setBlocks(updatedBlocks);
    
    // Имитируем задержку для индикатора загрузки
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // После завершения анимации устанавливаем значения
    const finalizedBlocks = [...updatedBlocks];
    finalizedBlocks[blockIndex] = {
      ...finalizedBlocks[blockIndex],
      isOpened: true,
      isFlipping: false,
      isLoading: false,
      shards: randomShards
    };
    
    setBlocks(finalizedBlocks);
    const newShards = (userData?.shards || 0) + randomShards;
    
    // Обновляем данные на сервере
    if (userData && updateUserData) {
      updateUserData({
        ...userData,
        shards: newShards
      });
    }
    
    setIsAnimating(false);
  };

  const resetAllBlocks = () => {
    // Просто сбрасываем состояние блоков без анимации
    const resetBlocks = blocks.map(block => ({
      ...block,
      isOpened: false,
      isFlipping: false,
      isLoading: false,
      shards: 0
    }));
    
    setBlocks(resetBlocks);
    setIsResetting(false);
  };

  const handleBuyWithStars = async (amount, price, buttonId) => {
    setIsProcessing(true);
    setProcessingMethod('stars');
    setProcessingButton(buttonId);
    
    try {
      if (!webApp) {
        throw new Error("WebApp not initialized");
      }

      // Создаем информацию о товаре
      const boosterInfo = {
        item_id: `blocks_${amount}`,
        title: `${amount} Blocks`,
        description: `Purchase ${amount} blocks to open more squares`,
        price: price,
        currency: "XTR"
      };

      const invoiceData = {
        title: boosterInfo.title,
        description: boosterInfo.description,
        payload: JSON.stringify({ 
          item_id: boosterInfo.item_id, 
          user_id: webApp.initDataUnsafe.user.id 
        }),
        currency: boosterInfo.currency,
        prices: [{ amount: boosterInfo.price * 1000, label: boosterInfo.title }],
      };

      const response = await axios.post(
        'https://functions-user.online/.netlify/functions/create-invoice',
        invoiceData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { invoiceLink: newInvoiceLink } = response.data;

      webApp.openInvoice(newInvoiceLink, async (status) => {
        if (status === "paid") {
          try {
            const verificationResponse = await axios.post(
              'https://functions-user.online/.netlify/functions/verify-payment',
              {
                payload: invoiceData.payload,
                user_id: webApp.initDataUnsafe.user.id
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (verificationResponse.status === 200) {
              const data = verificationResponse.data;

              if (data.success) {
                if (!data.duplicate && !data.alreadyOwned) {
                  // Увеличиваем количество блоков
                  const newBlocksCount = (userData?.bloks_count || 0) + amount;
                  
                  // Обновляем данные на сервере
                  if (userData && updateUserData) {
                    updateUserData({
                      ...userData,
                      bloks_count: newBlocksCount
                    });
                  }
                } else {
                  console.error("Duplicate payment or already owned");
                }
              } else {
                console.error("Payment verification failed");
              }
            }
          } catch (verificationError) {
            console.error("Verification Error", verificationError);
          }
        } else {
          console.error("Payment cancelled or failed");
        }
        
        setIsProcessing(false);
        setProcessingMethod(null);
        setProcessingButton(null);
      });
    } catch (error) {
      console.error("Invoice Creation Error", error);
      setIsProcessing(false);
      setProcessingMethod(null);
      setProcessingButton(null);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Функция для отображения блоков
  const renderBlocks = () => {
    const rows = 6;
    const cols = 5;
    const squares = [];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const blockId = `${i}-${j}`;
        const block = blocks.find(b => b.id === blockId);
        
        row.push(
          <div 
            key={blockId} 
            className={`square ${block?.isFlipping ? 'flipping' : ''} ${block?.isOpened ? 'opened' : ''}`}
            onClick={() => handleSquareClick(blockId)}
            data-id={blockId}
          >
            <div className="square-front"></div>
            <div className="square-back">
              {block?.isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                block?.isOpened && <span className="shards-count">{block.shards}<Diamond size={14} color="#3b82f6" /></span>
              )}
            </div>
          </div>
        );
      }
      squares.push(
        <div key={i} className="square-row">
          {row}
        </div>
      );
    }
    
    return squares;
  };

  return (
    <section className='bodyhomepage'>
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />

      <BuyBlocksSection
        isProcessing={isProcessing}
        processingButton={processingButton}
        onBuyWithStars={handleBuyWithStars}
      />
      
      {/* Игровое поле с блоками */}
      <div className="squares-container">
        {renderBlocks()}
      </div>
      
      {/* Общее модальное окно */}
      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      <Menu />
    </section>
  );
}

export default HomePage;