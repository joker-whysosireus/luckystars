import starii from './starii.png';

function Stars() {

  return(
    <div>
      <img 
        src={starii} 
        alt="Star" 
        style={{
                display: 'inline-block',
                width: '25px', 
                height: '25px',
                marginBottom: '1px',
                verticalAlign: 'middle'}} 
        />
    </div>
  );
}


export default Stars;