import { useEffect, useState, useRef } from 'react';
import './Home.css';
import Menu from '../../Assets/Menus/Menu/Menu';
import axios from 'axios';
import FixedTopSection from './Containers/TopSection/FixedTopSection';
import BuyBlocksSection from './Containers/BuyBlocks/BuyBlocksSection';
import InfoModal from '../../Assets/Modal/InfoModal';
import { Diamond, Box } from 'lucide-react';

// УНИФИЦИРОВАННАЯ КОНФИГУРАЦИЯ ТОВАРОВ
const itemConfigs = {
  blocks_5: {
    item_id: "blocks_5",
    title: "5 Blocks Pack",
    description: "Purchase 5 blocks to unlock more treasures in the game",
    price: 5,
    currency: "XTR",
    amount: 5
  },
  blocks_25: {
    item_id: "blocks_25",
    title: "25 Blocks Pack",
    description: "Purchase 25 blocks to unlock more treasures in the game",
    price: 25,
    currency: "XTR",
    amount: 25
  },
  blocks_75: {
    item_id: "blocks_75",
    title: "75 Blocks Pack",
    description: "Purchase 75 blocks to unlock more treasures in the game",
    price: 75,
    currency: "XTR",
    amount: 75
  },
  blocks_125: {
    item_id: "blocks_125",
    title: "125 Blocks Pack",
    description: "Purchase 125 blocks to unlock more treasures in the game",
    price: 125,
    currency: "XTR",
    amount: 125
  }
};

function HomePage({ userData, updateUserData, isActive }) {
  const [blocks, setBlocks] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState(null);
  const [processingButton, setProcessingButton] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingBlocks, setProcessingBlocks] = useState(new Set());
  const [isCooldown, setIsCooldown] = useState(false);
  
  // Получаем экземпляр WebApp Telegram
  const webApp = window.Telegram?.WebApp || null;
  const blocksRef = useRef(blocks);

  // Обновляем ref при изменении blocks
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // Инициализация данных из userData
  useEffect(() => {
    // Загрузка блоков из localStorage или инициализация новых
    const initializeGame = () => {
      try {
        const savedBlocks = localStorage.getItem(`userBlocks_${userData?.telegram_user_id}`);
        if (savedBlocks) {
          const parsedBlocks = JSON.parse(savedBlocks);
          
          // Проверяем, что все блоки имеют правильную структуру
          const validatedBlocks = parsedBlocks.map(block => ({
            id: block.id || `${block.row}-${block.col}`,
            row: block.row,
            col: block.col,
            isOpened: block.isOpened || false,
            shards: block.shards || 0,
            isLoading: false,
            recentlyOpened: false
          }));
          
          setBlocks(validatedBlocks);
        } else {
          initializeBlocks();
        }
      } catch (error) {
        console.error("Error loading blocks:", error);
        initializeBlocks();
      }
    };

    if (userData) {
      initializeGame();
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
          isLoading: false,
          recentlyOpened: false
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
      
      // Через 1 секунду просто сбрасываем все блоки без начисления награды
      setTimeout(() => {
        resetAllBlocks();
        setIsResetting(false);
      }, 1000);
    }
  }, [blocks, isResetting]);

  const updateShardsOnServer = async (shardsToAdd) => {
    try {
      const response = await axios.post(
        'https://giftsblocksbackend.store/.netlify/functions/update-shards',
        {
          telegram_user_id: userData.telegram_user_id,
          shards: shardsToAdd
        }
      );

      if (response.data.success) {
        // Обновляем локальные данные
        updateUserData({
          ...userData,
          shards: response.data.newShards
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating shards:", error);
      return false;
    }
  };

  const useBlockOnServer = async () => {
    try {
      const response = await axios.post(
        'https://giftsblocksbackend.store/.netlify/functions/use-block',
        {
          telegram_user_id: userData.telegram_user_id
        }
      );

      if (response.data.success) {
        // Обновляем локальные данные
        updateUserData({
          ...userData,
          bloks_count: response.data.newBlocksCount
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error using block:", error);
      return false;
    }
  };

  const updateBlocksOnServer = async (blocksToAdd) => {
    try {
      const response = await axios.post(
        'https://lucky-stars-backend.netlify.app/.netlify/functions/update-blocks',
        {
          telegram_user_id: userData.telegram_user_id,
          blocks: blocksToAdd
        }
      );

      if (response.data.success) {
        // Обновляем локальные данные
        updateUserData({
          ...userData,
          bloks_count: response.data.newBlocksCount
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating blocks:", error);
      return false;
    }
  };

  // НОВАЯ ФУНКЦИЯ: Увеличивает счетчик открытых блоков
  const incrementOpenBlocksOnServer = async () => {
    try {
      const response = await axios.post(
        'https://giftsblocksbackend.store/.netlify/functions/increment-open-blocks',
        {
          telegram_user_id: userData.telegram_user_id
        }
      );

      if (response.data.success) {
        // Обновляем локальные данные
        updateUserData({
          ...userData,
          open_blocks: response.data.newOpenBlocksCount
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error incrementing open blocks:", error);
      return false;
    }
  };

  const handleSquareClick = async (blockId) => {
    // Если происходит сброс блоков, анимация, задержка или блок уже в обработке, игнорируем клики
    if (isResetting || isAnimating || isCooldown || processingBlocks.has(blockId)) return;
    
    // Получаем актуальное состояние блока
    const currentBlock = blocksRef.current.find(b => b.id === blockId);
    
    // Если блок уже открыт или анимируется, ничего не делаем
    if (!currentBlock || currentBlock.isOpened || currentBlock.isLoading) return;
    
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
    
    // Блокируем все блоки во время анимации
    setIsAnimating(true);
    
    // Добавляем блок в обработку
    setProcessingBlocks(prev => new Set(prev).add(blockId));
    
    // Обновляем UI - сразу показываем лоадер
    const updatedBlocks = blocksRef.current.map(block => 
      block.id === blockId 
        ? { ...block, isLoading: true }
        : block
    );
    setBlocks(updatedBlocks);
    
    // Уменьшаем счетчик блоков на сервере
    const blockUsed = await useBlockOnServer();
    if (!blockUsed) {
      console.error("Failed to use block on server");
      // Восстанавливаем состояние блока при ошибке
      const errorBlocks = blocksRef.current.map(block => 
        block.id === blockId 
          ? { ...block, isLoading: false }
          : block
      );
      setBlocks(errorBlocks);
      
      setProcessingBlocks(prev => {
        const newSet = new Set(prev);
        newSet.delete(blockId);
        return newSet;
      });
      setIsAnimating(false);
      return;
    }
    
    // Случайное количество осколков с повышенной вероятностью 1 и 5
    const shardValues = [1, 1, 1, 1, 5, 5, 5, 10, 15, 25];
    const randomShards = shardValues[Math.floor(Math.random() * shardValues.length)];
    
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // После завершения анимации устанавливаем значения
    const finalizedBlocks = blocksRef.current.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            isOpened: true, 
            isLoading: false, 
            shards: randomShards,
            recentlyOpened: true
          }
        : block
    );
    
    setBlocks(finalizedBlocks);
    
    // Обновляем алмазы на сервере
    const shardsUpdated = await updateShardsOnServer(randomShards);
    if (!shardsUpdated) {
      // Если не удалось обновить на сервере, обновляем локально
      const newShards = (userData?.shards || 0) + randomShards;
      updateUserData({
        ...userData,
        shards: newShards
      });
    }
    
    // НОВЫЙ ВЫЗОВ: Увеличиваем счетчик открытых блоков (вызываем без задержки)
    await incrementOpenBlocksOnServer();
    
    // Убираем блок из обработки и разблокируем другие блоки
    setProcessingBlocks(prev => {
      const newSet = new Set(prev);
      newSet.delete(blockId);
      return newSet;
    });
    
    setIsAnimating(false);
    
    // Устанавливаем задержку на 2 секунды для анимации
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
      
      // Убираем флаг недавно открытого блока только у текущего блока
      setBlocks(prevBlocks => 
        prevBlocks.map(block => 
          block.id === blockId 
            ? { ...block, recentlyOpened: false }
            : block
        )
      );
    }, 2000);
  };

  const resetAllBlocks = () => {
    // Сбрасываем состояние блоков
    const resetBlocks = blocks.map(block => ({
      ...block,
      isOpened: false,
      isLoading: false,
      shards: 0,
      recentlyOpened: false
    }));
    
    setBlocks(resetBlocks);
  };

  // Функция для принудительного сброса зависших блоков
  const resetStuckBlocks = () => {
    const resetBlocks = blocks.map(block => ({
      ...block,
      isLoading: false,
      recentlyOpened: false
    }));
    
    setBlocks(resetBlocks);
    setIsAnimating(false);
    setIsCooldown(false);
    setProcessingBlocks(new Set());
  };

  const handleBuyWithStars = async (amount, price, buttonId) => {
    setIsProcessing(true);
    setProcessingMethod('stars');
    setProcessingButton(buttonId);
    
    try {
      if (!webApp) {
        throw new Error("WebApp not initialized");
      }

      // Находим конфиг по количеству блоков
      const itemId = `blocks_${amount}`;
      const itemConfig = itemConfigs[itemId];
      
      if (!itemConfig) {
        throw new Error(`No configuration found for amount: ${amount}`);
      }

      const invoiceData = {
        title: itemConfig.title,
        description: itemConfig.description,
        payload: JSON.stringify({ 
          item_id: itemConfig.item_id, 
          user_id: webApp.initDataUnsafe.user.id 
        }),
        currency: itemConfig.currency,
        prices: [{ amount: itemConfig.price, label: itemConfig.title }],
      };

      const response = await axios.post(
        'https://giftsblocksbackend.store/.netlify/functions/create-invoice',
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
              'https://giftsblocksbackend.store/.netlify/functions/verify-payment',
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
                  // Получаем количество блоков из конфига
                  const blocksToAdd = itemConfig.amount;
                  
                  // Увеличиваем количество блоков на сервере
                  const blocksUpdated = await updateBlocksOnServer(blocksToAdd);
                  if (!blocksUpdated) {
                    // Если не удалось обновить на сервере, обновляем локально
                    const newBlocksCount = (userData?.bloks_count || 0) + blocksToAdd;
                    updateUserData({
                      ...userData,
                      bloks_count: newBlocksCount
                    });
                  }
                  
                  // Показываем уведомление об успешной покупке
                  if (webApp) {
                    webApp.showPopup({
                      title: "Purchase Successful",
                      message: `You have successfully purchased ${blocksToAdd} blocks!`,
                      buttons: [{ type: "ok" }]
                    });
                  }
                } else {
                  console.error("Duplicate payment or already owned");
                  if (webApp) {
                    webApp.showPopup({
                      title: "Payment Error",
                      message: "This payment has already been processed.",
                      buttons: [{ type: "ok" }]
                    });
                  }
                }
              } else {
                console.error("Payment verification failed");
                if (webApp) {
                  webApp.showPopup({
                    title: "Payment Error",
                    message: "Payment verification failed. Please try again.",
                    buttons: [{ type: "ok" }]
                  });
                }
              }
            }
          } catch (verificationError) {
            console.error("Verification Error", verificationError);
            if (webApp) {
              webApp.showPopup({
                title: "Payment Error",
                message: "An error occurred during payment verification.",
                buttons: [{ type: "ok" }]
              });
            }
          }
        } else {
          console.error("Payment cancelled or failed");
          if (webApp) {
            webApp.showPopup({
              title: "Payment Cancelled",
              message: "Payment was cancelled or failed. Please try again.",
              buttons: [{ type: "ok" }]
            });
          }
        }
        
        setIsProcessing(false);
        setProcessingMethod(null);
        setProcessingButton(null);
      });
    } catch (error) {
      console.error("Invoice Creation Error", error);
      if (webApp) {
        webApp.showPopup({
          title: "Payment Error",
          message: "An error occurred while creating the invoice.",
          buttons: [{ type: "ok" }]
        });
      }
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
        const isProcessing = processingBlocks.has(blockId);
        
        row.push(
          <div 
            key={blockId} 
            className={`square ${block?.isLoading ? 'loading' : ''} ${block?.isOpened ? 'opened' : ''} ${block?.recentlyOpened ? 'recently-opened' : ''} ${isProcessing ? 'processing' : ''}`}
            onClick={() => handleSquareClick(blockId)}
            data-id={blockId}
          >
            <div className="square-front">
              {!block?.isOpened && !block?.isLoading && <Box size={24} color="#3a3a3a" style={{ opacity: 0.7 }} />}
            </div>
            <div className="square-back">
              {block?.isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                block?.isOpened && <span className="shards-count">{block.shards}  <Diamond size={14} color="#3b82f6" /></span>
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

  // Добавляем кнопку для принудительного сброса блоков (для отладки)
  const renderDebugButton = () => {
    if (process.env.NODE_ENV === 'development') {
      return (
        <button 
          onClick={resetStuckBlocks}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 1000,
            padding: '10px',
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reset Stuck Blocks
        </button>
      );
    }
    return null;
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
      <div className={`squares-container ${isAnimating ? 'disabled' : ''} ${isCooldown ? 'cooldown' : ''}`}>
        {renderBlocks()}
      </div>
      
      {/* Общее модальное окно */}
      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
      
      {renderDebugButton()}
      
      <Menu />
    </section>
  );
}

export default HomePage;