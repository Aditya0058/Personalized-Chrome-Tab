import { useState } from 'react'
import './AiSearch.css'


function AiSearch() {
  const [prompt, setPrompt] = useState<string>('');
  const handleGo = () => {
    const trimmed = prompt.trim()
    if (!trimmed) return

    const url = `https://chatgpt.com/?q=${encodeURIComponent(trimmed)}`
    window.location.href = url
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGo()
    }
  }
   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setPrompt(e.target.value)
  }
  return (  
    <>
      <div className="container">
        <div className="input-section">
            {/* <input type="text" placeholder='Ask anything' id="ask-input" /> */}
            <textarea 
                placeholder='Ask anything' 
                id="ask-input"
                value={prompt}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            >
            </textarea>
        </div>
        <div className="container-bottom">
            <div className="selector-btn"><button>ChatGPT</button></div>
            <div className="search-btn"><button onClick={handleGo}>GO</button></div>
        </div>
        
      </div>
    </>
  )
}

export default AiSearch