
import './App.css';
import Goal from './components/Goal';
import Greeting from './components/Greeting';


function App() {
  

  return (  
    <>
      <div className="main">
          <div className="top-bar"> 
          <div className="greeting-wrapper">
            <Greeting />
          </div>
          <div className="goal">
            <Goal /> 
          </div> 

          </div>
      </div>
    </>
  )
}

export default App
