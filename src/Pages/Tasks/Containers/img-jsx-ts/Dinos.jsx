import dinos from './dinos.jpg';

function Dinos() {

  return(
    <div>
      <img src={dinos} alt="Star" style={{ width: '40px', height: '40px', borderRadius: '25px', marginTop: '5px'}}/>
    </div>
  );
}

export default Dinos;