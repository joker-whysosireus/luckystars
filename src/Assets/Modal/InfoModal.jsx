import './InfoModal.css';
import { Box, Diamond } from 'lucide-react';

function InfoModal({ isOpen, onClose }) {
  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">About Blocks & Diamonds</div>
        </div>
        
        <div className="modal-scrollable">
          <div className="resource-explanation">
            <div className="resource-item">
              <Box size={20} color="#b9bbbc" />
              <span>Number of blocks you can open</span>
            </div>
            <div className="resource-item">
              <Diamond size={20} color="#3b82f6" />
              <span>Diamonds collected to redeem for Telegram gifts</span>
            </div>
          </div>
          
          <div className="modal-text">
            Each block contains a random amount of diamonds when opened.
            You can get 1, 5, 10, 15, or 25 diamonds from each block.
          </div>
          
          <div className="modal-text">
            When you open all blocks on the field all blocks will reset for you to open again.
          </div>
          
          <div className="modal-text">
            Use diamonds to redeem exclusive gifts in Telegram! The more diamonds you collect,
            the better gifts you can unlock.
          </div>
          <div className="modal-text">
            <strong>Friend Invitation:</strong><br />
            Invite friends to play and earn bonus blocks and diamonds when they join.
          </div>
          
          <div className="modal-text">
            <strong>Daily Rewards:</strong><br />
            Check back daily to claim free blocks and complete tasks for extra diamonds.
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;