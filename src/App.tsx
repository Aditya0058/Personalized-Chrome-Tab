
import './App.css';
import Goal from './components/Goal';
import Greeting from './components/Greeting';


function App() {
  

  return (  
    <>
      <div className="main">
          {/* <div className="right-top">
            <Goal /> 
          </div>  */}
          <div className="greeting-wrapper">
            <Greeting />
          </div>
      </div>
    </>
  )
}

export default App
