import { useState } from 'react';
import Menu from '../Menus/Menu/Menu';
import FlyFR from './Containers-fr/img-jsx-fr/FlyFR';
import './Friends.css';
import DiamondGifFr from './Containers-fr/img-jsx-fr/DiamondGifFr';

function Friends({ userData, updateUserData }) {

  return (
    <section className='bodyfriendspage'>

      
            
            {/* Частицы для фона */}
            <div className="market-particles">
                {[...Array(24)].map((_, i) => (
                    <div key={i} className={`market-particle p${(i % 8) + 1}`}></div>
                ))}
            </div>


      <div className="friends-banner">
        <div className="friends-text">
          <h1 className="friends-title">Invite Friends and Earn!</h1>
          <p className="friends-subtitle">For each friend you get +5✨</p>
        </div>
        <div className="friends-visual">
          <FlyFR />
        </div>
      </div>
      
      {/* Два отдельных блока статистики */}
      <div className="stats-separate-container">
        <div className="stat-block">
          <div className="stat-number">{userData?.invited_count || 0}</div>
          <div className="stat-label">Invited friends</div>
        </div>
        <div className="stat-block">
          <div className="stat-number">{userData?.shards_received || 0}</div>
          <div className="stat-label">Shards received</div>
        </div>
      </div>
      
      {/* Блок с бонусами */}
      <article className='right-section-bonus-fr'>
          <section className='text-section-bonus-fr'>
            <span class="title-how-it-works">How it works?</span>
            <div className='block-text'>
              <span>Share your refferal link!</span>
              <span className='second-span-bonus'>Tap the button bellow</span>
            </div>
            <div className='block-text'>
              <span>Your friends join Lucky Stars</span>
              <span className='second-span-bonus'>And thay start playing</span>
            </div>
            <div className='block-text'>
              <span>Learn & Earn Together!</span>
              <span className='second-span-bonus'>Get shards to refferals</span>
            </div>
          </section>
          <section className='left-section-gif-bonus-fr'>
            <DiamondGifFr />
          </section>
        </article>
      
      <div className='Container-button'>
        <button className='get-reward-button'>Read information</button>
        <button className='Invite-button'>Invite Friends</button>
      </div>
      
      <Menu />
    </section>
  );
}

export default Friends;