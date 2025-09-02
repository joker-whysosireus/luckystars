import pixellogo from './pixellogo.png';

function Pixel() {

  return(
    <div>
      <img src={pixellogo} alt="Star" style={{ width: '40px', height: '40px', marginTop: '5px'}}/>
    </div>
  );
}

export default Pixel;