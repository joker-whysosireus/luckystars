import walk from './walk.jpg'; 

function WalkLogo() {

  return(
    <div>
      <img src={walk} alt="Star" style={{ width: '40px', height: '40px', marginTop: '5px', borderRadius: '15px'}}/>
    </div>
  );
}

export default WalkLogo;