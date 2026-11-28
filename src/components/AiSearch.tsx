import './AiSearch.css'


function AiSearch() {
  

  return (  
    <>
      <div className="container">
        <div className="input-section">
            {/* <input type="text" placeholder='Ask anything' id="ask-input" /> */}
            <textarea placeholder='Ask anything' id="ask-input"></textarea>
        </div>
        <div className="container-bottom">
            <div className="selector-btn"><button>ChatGPT</button></div>
            <div className="search-btn"><button>GO</button></div>
        </div>
        
      </div>
    </>
  )
}

export default AiSearch