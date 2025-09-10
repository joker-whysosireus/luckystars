import './InfoModal.css';

function InfoModal({ isOpen, onClose }) {
  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">About Blocks & Rewards</div>
        <div className="modal-text">
          Each block contains a random amount of diamonds (shards) when opened.
          You can get 1, 5, 10, 15, or 25 diamonds from each block.
        </div>
        <div className="modal-text">
          When you open all blocks on the field, you'll receive +1 free block as a reward,
          and all blocks will reset for you to open again.
        </div>
        <div className="modal-text">
          Use diamonds to purchase more blocks and continue playing to earn even more diamonds!
        </div>
        <div className="modal-text">
          <strong>Packages:</strong><br />
          5 ⭐ = 5 blocks<br />
          10 ⭐ = 10 blocks<br />
          20 ⭐ = 20 blocks<br />
          50 ⭐ = 50 blocks
        </div>
        <div className="modal-text">
          <strong>Friend Invitation:</strong><br />
          For each friend you invite, you receive 3 blocks and 10 diamonds as a bonus.
        </div>
        <div className="modal-text">
          <strong>Task Rewards:</strong><br />
          Complete tasks to earn 2 blocks, and watch 5 ads to get 1 free block.
        </div>
      </div>
    </div>
  );
}

export default InfoModal;