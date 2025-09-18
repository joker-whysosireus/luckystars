import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, gift, onConfirm, isProcessing }) => {
  if (!isOpen || !gift) return null;

  return (
    <div className="modal-overlay confirm-modal-overlay" onClick={onClose}>
      <div className="modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Are you sure?</h2>
        </div>
        <div className="modal-scrollable">
          <div className="confirm-message">
            <p>Would you like to buy {gift.displayName} for {gift.price} diamonds?</p>
          </div>
          <button 
            className={`confirm-button ${isProcessing ? 'processing' : ''}`}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;