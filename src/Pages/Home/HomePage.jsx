import { useEffect, useState, useRef } from 'react';
import './Home.css';
import Menu from '../Menus/Menu/Menu';
import MoomDay from './Containers/img-jsx/MoomDay';
import PlantFR from './Containers/img-jsx/PlantFR';

function HomePage({ userData, updateUserData, isActive }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [shards, setShards] = useState(0);
  const [blocksCount, setBlocksCount] = useState(0); // Переименовано из leaves
  const [blocks, setBlocks] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  
  const texts = [
    {
      line1: "Follow the news!",
      line2: "On our channel, we publish news about the project"
    },
    {
      line1: "Free blocks!",
      line2: "To unlock for free, watch ads and complete tasks"
    }
  ];
  
  const backgroundClass = currentTextIndex === 0 ? 'blue-bg' : 'yellow-bg';

  // Загрузка данных из локального хранилища
  useEffect(() => {
    const savedShards = localStorage.getItem('userShards');
    const savedBlocksCount = localStorage.getItem('userBlocksCount');
    const savedBlocks = localStorage.getItem('userBlocks');
    
    if (savedShards) setShards(parseInt(savedShards));
    if (savedBlocksCount) setBlocksCount(parseInt(savedBlocksCount));
    if (savedBlocks) setBlocks(JSON.parse(savedBlocks));
  }, []);

  // Сохранение данных в локальное хранилище при изменении
  useEffect(() => {
    localStorage.setItem('userShards', shards.toString());
    localStorage.setItem('userBlocksCount', blocksCount.toString());
    localStorage.setItem('userBlocks', JSON.stringify(blocks));
  }, [shards, blocksCount, blocks]);

  // Инициализация блоков, если они не загружены из хранилища
  useEffect(() => {
    if (blocks.length === 0) {
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
    }
  }, [blocks.length]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [texts.length]);

  // Проверка, все ли блоки открыты
  useEffect(() => {
    if (blocks.length === 0) return;
    
    const allOpened = blocks.every(block => block.isOpened);
    if (allOpened && !isResetting) {
      setIsResetting(true);
      
      // Через 2 секунды сбрасываем все блоки и начисляем 1 блок
      setTimeout(() => {
        resetAllBlocks();
        setBlocksCount(prev => prev + 1); // Начисляем 1 блок за открытие всех блоков
      }, 2000);
    }
  }, [blocks, isResetting]);

  const handleSquareClick = async (blockId) => {
    // Если происходит сброс блоков или анимация, игнорируем клики
    if (isResetting || isAnimating) return;
    
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    
    // Если блок уже открыт или анимируется, ничего не делаем
    if (blocks[blockIndex].isOpened || blocks[blockIndex].isFlipping) return;
    
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
    setShards(prev => prev + randomShards);
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

  // Функция для отображения блоков
  const renderBlocks = () => {
    const rows = 6;
    const cols = 5;
    const squares = [];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const block = blocks.find(b => b.row === i && b.col === j);
        row.push(
          <div 
            key={`${i}-${j}`} 
            className={`square ${block?.isFlipping ? 'flipping' : ''} ${block?.isOpened ? 'opened' : ''}`}
            onClick={() => handleSquareClick(block.id)}
          >
            <div className="square-front"></div>
            <div className="square-back">
              {block?.isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                block?.isOpened && <span className="shards-count">{block.shards}💎</span>
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
      {/* Частицы для фона */}
      <div className="market-particles">
        {[...Array(24)].map((_, i) => (
          <div key={i} className={`market-particle p${(i % 8) + 1}`}></div>
        ))}
      </div>
      
      {/* Секция пользователя */}
      <div className="user-section">
        <div className="user-info">
          <div className="user-avatar">
            <img 
              src={userData?.avatar_url || '/default-avatar.png'} 
              alt="Avatar" 
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>
          <div className="user-details">
            <div className="user-name">
              {userData?.first_name || 'First'} {userData?.last_name || 'Last'}
            </div>
            <div className="user-username">
              @{userData?.username || 'username'}
            </div>
          </div>
        </div>
        
        {/* Секция с ресурсами */}
        <div className="user-resources">
          <div className="resource-item">
            <div className="resource-count">{blocksCount}</div>
            <div className="resource-icon">🧱</div> {/* Иконка блоков вместо листьев */}
          </div>
          <div className="resource-item">
            <div className="resource-count">{shards}</div>
            <div className="resource-icon">💎</div>
          </div>
        </div>
      </div>

      <div className={`text-banner ${backgroundClass}`}>
        <div className="text-content">
          <div className="text-line-1">{texts[currentTextIndex].line1}</div>
          <div className="text-line-2">{texts[currentTextIndex].line2}</div>
        </div>
        <div className="icon-container">
          {currentTextIndex === 0 ? <MoomDay /> : <PlantFR />}
        </div>
      </div>
      
      <div className="squares-container">
        {renderBlocks()}
      </div>
      
      <Menu />
    </section>
  );
}

export default HomePage;