import Menu from "../Menus/Menu/Menu";
import { useEffect } from 'react';
import ThunderBoost from "../Home/Containers/img-jsx/ThunderBoost";
import "./Profile.css";

function Profile({ userData, updateUserData }) {

    return (
        <section className="profile-page">
                    <div className="market-gradient-bg"></div>
            
            {/* Частицы для фона */}
                    <div className="market-particles">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className={`market-particle p${(i % 8) + 1}`}></div>
                        ))}
                    </div>
                    <div className="cards-container">
                        {/* Первые три карточки - синие */}
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">25 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/1000</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                        
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">49 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/900</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                        
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">99 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/800</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                        
                        {/* Остальные карточки */}
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">149 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/700</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                        
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">25 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/600</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                        
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">25 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/500</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                        
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">25 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/400</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                        
                        <div className="card blue-card">
                            <div className="card-top">
                                <div className="background-block">25 ✨</div>
                                <div className="background-block">You: 0</div>
                            </div>
                            <div className="full-width-bg">0/300</div>
                            <div className="card-center">
                                <ThunderBoost />
                                <p>Thunder NFT</p>
                            </div>
                            <div className="card-bottom">
                                <button className="buy-button">Buy</button>
                            </div>
                        </div>
                    </div>
            <Menu />
        </section>
    );
}

export default Profile;