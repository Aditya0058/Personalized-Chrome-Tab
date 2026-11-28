import { useEffect, useRef, useState } from 'react'
import './AiSearch.css'

type Platform = {
  id: string
  name: string
  url: (prompt: string) => string
  autoSubmit: boolean // does ?q= actually submit on that site?
}

const PLATFORMS: Platform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`,
    autoSubmit: true,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: (p) => `https://gemini.google.com/app?q=${encodeURIComponent(p)}`,
    autoSubmit: false,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: () => 'https://chat.deepseek.com/',
    autoSubmit: false,
  },
  {
    id: 'claude',
    name: 'Claude',
    url: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}`,
    autoSubmit: true, // pre-fills the box, waits for Enter
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}`,
    autoSubmit: true,
  },
  {
    id: 'grok',
    name: 'Grok',
    url: (p) => `https://grok.com/?q=${encodeURIComponent(p)}`,
    autoSubmit: true,
  },
]

function AiSearch() {
  const [prompt, setPrompt] = useState<string>('');
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  const handleGo = () => {
    const trimmed = prompt.trim()
    if (!trimmed) return

    if (!platform.autoSubmit) {
      navigator.clipboard?.writeText(trimmed).catch(() => {})
    }

    window.location.href = platform.url(trimmed);
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
                rows={1}
            >
            </textarea>
        </div>
        <div className="container-bottom">
            <div className="selector-btn" ref={dropdownRef}>
            <button onClick={() => setOpen((o) => !o)}>
                {platform.name}
            </button>
            {open && (
                <div className="dropdown" role="menu">
                {PLATFORMS.map((p) => (
                    <button
                    key={p.id}
                    className={`dropdown-item${p.id === platform.id ? ' selected' : ''}`}
                    onClick={() => {
                        setPlatform(p)
                        setOpen(false)
                    }}
                    role="menuitem"
                    >
                    <span>{p.name}</span>
                    {p.id === platform.id && <span className="check">✓</span>}
                    </button>
                ))}
                </div>
            )}
            </div>
            <div className="search-btn"><button onClick={handleGo}>GO</button></div>
        </div>
        
      </div>
    </>
  )
}

export default AiSearch