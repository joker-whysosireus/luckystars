import viral from './viral.jpg'; 

function ViralLogo() {

  return(
    <div>
      <img src={viral} alt="Star" style={{ width: '40px', height: '40px', marginTop: '5px', borderRadius: '15px'}}/>
    </div>
  );
}

export default ViralLogo;