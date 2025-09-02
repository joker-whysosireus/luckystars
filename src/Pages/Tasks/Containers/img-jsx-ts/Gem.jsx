import gemlogo from './gemlogo.jpg'; 

function Gem() {

  return(
    <div>
      <img src={gemlogo} alt="Star" style={{ width: '40px', height: '40px', marginTop: '5px', borderRadius: '15px'}}/>
    </div>
  );
}

export default Gem;