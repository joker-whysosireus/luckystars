import { useState } from 'react';
import Menu from '../Menus/Menu/Menu';
import FlyFR from './Containers-fr/img-jsx-fr/FlyFR';
import './Friends.css';
import Bonus from './Containers-fr/Bonuses/Bonus';

function Friends({ userData, updateUserData }) {

  return (
    <section className='bodyfriendspage'>
      <div className="friends-banner">
        <div className="friends-text">
          <h1 className="friends-title">Invite friends and Earn!</h1>
          <p className="friends-subtitle">For each friend you get +5✨</p>
        </div>
        <div className="friends-visual">
          <FlyFR />
        </div>
      </div>
      
      {/* Блок с статистикой приглашений */}
      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">Your Statistic</h2>
          <div className="stats-underline"></div>
        </div>
        <div className="stats-content">
          <div className="stat-column">
            <div className="stat-number">{userData?.invited_count || 0}</div>
            <div className="stat-label">Invited friends</div>
          </div>
          <div className="stat-column">
            <div className="stat-number">{userData?.shards_received || 0}</div>
            <div className="stat-label">Shards received</div>
          </div>
        </div>
      </div>
      
      {/* Блок с бонусами */}
      <Bonus />
      
      <div className='Container-button'>
        <button className='Invite-button'>Invite Friends</button>
      </div>
      
      <Menu />
    </section>
  );
}

export default Friends;