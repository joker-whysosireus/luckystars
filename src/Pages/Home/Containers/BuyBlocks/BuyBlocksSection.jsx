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
            onClick={() => onBuyWithStars(10, 10, 'btn2')}
            disabled={isProcessing}
          >
            {processingButton === 'btn2' ? 'Wait...' : <>10<Stars /></>}
          </button>
        </div>
        <div className="button-row">
          <button 
            className={`buy-btn ${processingButton === 'btn3' ? 'processing' : ''}`}
            onClick={() => onBuyWithStars(20, 20, 'btn3')}
            disabled={isProcessing}
          >
            {processingButton === 'btn3' ? 'Wait...' : <>20<Stars /></>}
          </button>
          <button 
            className={`buy-btn ${processingButton === 'btn4' ? 'processing' : ''}`}
            onClick={() => onBuyWithStars(50, 50, 'btn4')}
            disabled={isProcessing}
          >
            {processingButton === 'btn4' ? 'Wait...' : <>50<Stars /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyBlocksSection;