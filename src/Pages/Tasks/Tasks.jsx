import Menu from '../Menus/Menu/Menu';
import './Tasks.css';
import Hight from './Containers/Hight-section/Hight';

function Tasks({ isActive, userData, updateUserData }) {

  return (
      <section className='bodytaskspage'>
        <Hight userData={userData} updateUserData={updateUserData} />
        <Menu />
      </section>
  );
}

export default Tasks;