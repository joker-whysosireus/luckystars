import starii from './starii.png';

function Stars() {

  return(
    <div>
      <img 
        src={starii} 
        alt="Star" 
        style={{
                display: 'inline-block',
                width: '20px', 
                height: '20px',
                marginBottom: '1px',
                verticalAlign: 'middle'}} 
        />
    </div>
  );
}


export default Stars;