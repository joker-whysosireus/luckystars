import { Link, useLocation } from 'react-router-dom';
import './Menu.css';
import HomeIconOneMenu from '../img-jsx/HomeIconOneMenu';
import HomeIconTwoMenu from '../img-jsx/HomeIconTwoMenu';
import FriendsIconOneMenu from '../img-jsx/FriendsIconMenu';
import FriendsIconTwoMenu from '../img-jsx/FriendsIconTwoMenu';
import TasksIconOneMenu from '../img-jsx/TasksIconMenu';
import TasksIconTwoMenu from '../img-jsx/TasksIconTwoMenu';
import CrownOne from '../img-jsx/CrownOne';
import CrownTwo from '../img-jsx/CrownTwo';
import ProfileOne from '../img-jsx/ProfileOne';
import ProfileTwo from '../img-jsx/ProfileTwo';

const Menu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleClick = (path) => (event) => {
    if (currentPath === path) {
      event.preventDefault(); 
    }
  };

  return (
      <div className="menu">
        <div className="menu-item">
          <Link to="/" onClick={handleClick('/')}>
            {currentPath === '/' ? <HomeIconTwoMenu /> : <HomeIconOneMenu />}
            <span className="Name" style={{ color: currentPath === '/' ? '#FFFA8A' : 'var(--container-color-two)' }}>
              Blocks
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/friends" onClick={handleClick('/friends')}>
              {currentPath === '/friends' ? <FriendsIconTwoMenu /> :  <FriendsIconOneMenu />}
              <span className="Name" style={{ color: currentPath === '/friends' ? '#FFFA8A' : 'var(--container-color-two)' }}>
                Friends
              </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/leader" onClick={handleClick('/leader')}>
              {currentPath === '/leader' ? <CrownTwo /> : <CrownOne />}
              <span className="Name" style={{ color: currentPath === '/leader' ? '#FFFA8A' : 'var(--container-color-two)' }}>
                Leaders
              </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/tasks" onClick={handleClick('/tasks')}>
            {currentPath === '/tasks' ? <TasksIconTwoMenu /> : <TasksIconOneMenu />}
            <span className="Name" style={{ color: currentPath === '/tasks' ? '#FFFA8A' : 'var(--container-color-two)' }}>
              Tasks
            </span>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/profile" onClick={handleClick('/profile')}>
            {currentPath === '/profile' ? <ProfileTwo /> : <ProfileOne />}
            <span className="Name" style={{ color: currentPath === '/profile' ? '#FFFA8A' : 'var(--container-color-two)' }}>
              Market
            </span>
          </Link>
        </div>
      </div>
  );
};

export default Menu;

