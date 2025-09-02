import pepelogo from './pepelogo.jpg'; 

function Villian() {

  return(
    <div>
      <img src={pepelogo} alt="Star" style={{ width: '40px', height: '40px', marginTop: '5px', borderRadius: '15px'}}/>
    </div>
  );
}

export default Villian;