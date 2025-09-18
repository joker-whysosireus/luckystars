import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, gift, onConfirm, isProcessing }) => {
  return (
    <div className={`modal-overlay confirm-modal-overlay ${isOpen && gift ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        {gift && (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Are you sure?</h2>
            </div>
            <div className="modal-scrollable">
              <div className="confirm-message">
                <p>Do you want to buy {gift.displayName} for {gift.price} diamonds?</p>
              </div>
              <button 
                className={`confirm-button ${isProcessing ? 'processing' : ''}`}
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm purchase'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;