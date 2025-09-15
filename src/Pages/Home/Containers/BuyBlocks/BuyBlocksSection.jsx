import Stars from '../img-jsx/Stars';
import './BuyBlocksSection.css';

function BuyBlocksSection({ 
  isProcessing, 
  processingButton, 
  onBuyWithStars 
}) {
  return (
    <div className="blocks-info-section">
      <div className="blocks-info">
        <div className="blocks-title">Blocks cost</div>
        <div className="blocks-description">Choose how many blocks you want to buy</div>
        <div className="blocks-note">P.S 5<Stars /> = 5 blocks</div>
      </div>
      <div className={`buy-buttons ${isProcessing ? 'processing' : ''}`}>
        <div className="button-row">
          <button 
            className={`buy-btn ${processingButton === 'btn1' ? 'processing' : ''}`}
            onClick={() => onBuyWithStars(5, 5, 'btn1')}
            disabled={isProcessing}
          >
            {processingButton === 'btn1' ? 'Wait...' : <>5<Stars /></>}
          </button>
          <button 
            className={`buy-btn ${processingButton === 'btn2' ? 'processing' : ''}`}
            onClick={() => onBuyWithStars(25, 25, 'btn2')} // Исправлено: 25 вместо 10
            disabled={isProcessing}
          >
            {processingButton === 'btn2' ? 'Wait...' : <>25<Stars /></>} // Исправлено: 25 вместо 10
          </button>
        </div>
        <div className="button-row">
          <button 
            className={`buy-btn ${processingButton === 'btn3' ? 'processing' : ''}`}
            onClick={() => onBuyWithStars(75, 75, 'btn3')} // Исправлено: 75 вместо 20
            disabled={isProcessing}
          >
            {processingButton === 'btn3' ? 'Wait...' : <>75<Stars /></>} // Исправлено: 75 вместо 20
          </button>
          <button 
            className={`buy-btn ${processingButton === 'btn4' ? 'processing' : ''}`}
            onClick={() => onBuyWithStars(125, 125, 'btn4')} // Исправлено: 125 вместо 50
            disabled={isProcessing}
          >
            {processingButton === 'btn4' ? 'Wait...' : <>125<Stars /></>} // Исправлено: 125 вместо 50
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyBlocksSection;