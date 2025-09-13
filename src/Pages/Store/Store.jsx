import { useState } from "react";
import Menu from '../../Assets/Menus/Menu/Menu';
import "./Store.css";
import FixedTopSection from "../Home/Containers/TopSection/FixedTopSection";
import InfoModal from "../../Assets/Modal/InfoModal";
import Bear from "./Containers/img-jsx/Bear";
import Bucket from "./Containers/img-jsx/Bucket";
import Flower from "./Containers/img-jsx/Flower";
import Gift from "./Containers/img-jsx/Gift";
import Heart from "./Containers/img-jsx/Heart";
import Tort from "./Containers/img-jsx/Tort";
import Stars from "./Containers/img-jsx/Stars";
import { Diamond } from "lucide-react";

function Store({ userData, updateUserData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const gifts = [
    { id: 1, component: Bear, price: 15, name: "Bear" },
    { id: 5, component: Heart, price: 15, name: "Heart" },
    { id: 4, component: Gift, price: 25, name: "Gift" },
    { id: 3, component: Flower, price: 25, name: "Flower" },
    { id: 6, component: Tort, price: 50, name: "Tort" },
    { id: 2, component: Bucket, price: 50, name: "Bucket" }
  ];

  return (
    <section className="profile-page">
      <FixedTopSection 
        userData={userData} 
        onInfoClick={toggleModal}
      />
      
      <div className="store-content">
        <div className="gifts-grid">
          {gifts.map((gift) => {
            const GiftComponent = gift.component;
            return (
              <div key={gift.id} className="gift-card">
                <div className="gift-header">
                  <div className="price-badge">
                    {gift.price} <Stars size={14} />
                  </div>
                  <div className="user-count">You: 0</div>
                </div>
                
                <div className="gift-image">
                  <GiftComponent />
                </div>
                
                <button className="buy-button">
                  Buy for {gift.price} <Diamond size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <InfoModal isOpen={isModalOpen} onClose={toggleModal} />
             
      <Menu />
    </section>
  );
}

export default Store;