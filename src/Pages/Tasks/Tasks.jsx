import Menu from '../Menus/Menu/Menu';
import './Tasks.css';
import Hight from './Containers/Hight-section/Hight';

function Tasks({ isActive, userData, updateUserData }) {

  return (
      <section className='bodytaskspage'>
        <div className="market-gradient-bg"></div>
            
            {/* Частицы для фона */}
            <div className="market-particles">
                {[...Array(24)].map((_, i) => (
                    <div key={i} className={`market-particle p${(i % 8) + 1}`}></div>
                ))}
            </div>
        <Hight userData={userData} updateUserData={updateUserData} />
        <Menu />
      </section>
  );
}

export default Tasks;