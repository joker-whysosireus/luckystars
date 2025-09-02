import rock from './rock.jpg';

function Rock() {

  return(
    <div>
      <img src={rock} alt="Star" style={{ width: '40px', height: '40px', marginTop: '5px', borderRadius: '15px'}}/>
    </div>
  );
}

export default Rock;