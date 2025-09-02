import { useEffect, useState, useRef } from 'react';
import './Home.css';
import Menu from '../Menus/Menu/Menu';
import MoomDay from './Containers/img-jsx/MoomDay';
import PlantFR from './Containers/img-jsx/PlantFR';

function HomePage({ userData, updateUserData, isActive }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
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

  const handleSquareClick = (rowIndex, squareIndex) => {
    console.log(`Clicked square at row ${rowIndex}, position ${squareIndex}`);
    // Здесь можно добавить логику обработки клика
  };

  // Создаем массив квадратов для контейнера
  const rows = 6;
  const cols = 5;
  const squares = [];
  
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(
        <div 
          key={`${i}-${j}`} 
          className="square"
          onClick={() => handleSquareClick(i, j)}
        ></div>
      );
    }
    squares.push(
      <div key={i} className="square-row">
        {row}
      </div>
    );
  }

  return (
    <section className='bodyhomepage'>
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
        <div className="user-points">
          0✨
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
        {squares}
      </div>
      
      <Menu />
    </section>
  );
}

export default HomePage;