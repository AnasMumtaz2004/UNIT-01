import React, { useRef } from 'react'

const ChatInput = ({ onSend, loading }) => {

  const textareaRef = useRef(null)

  const handleSend = () => {
    const textarea = textareaRef.current
    const text = textarea.value.trim()
    if (!text || loading) return
    onSend(text)
    textarea.value = ''
    textarea.style.height = 'auto'
    textarea.style.overflowY = 'hidden'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 144) + 'px'

    if (el.scrollHeight > 144) {
      el.style.overflowY = 'auto'
    } else {
      el.style.overflowY = 'hidden'
    }
  }

  return (
    <div className='border-t border-white/10 bg-[#0f0f1a] px-3 sm:px-4 py-3 sm:py-4'>
      <div className='max-w-3xl mx-auto'>
        <div className='flex items-end gap-2 sm:gap-3'>

          {/* textarea */}
          <textarea
            className='flex-1 bg-[#1a1a2e] border border-white/10 text-white rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600 disabled:opacity-50 overflow-y-hidden'
            ref={textareaRef}
            style={{
              minHeight: '44px',
              maxHeight: '144px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#3730a3 transparent',
            }}
            placeholder='Chat with AI.....'
            rows={1}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={loading}
          />

          {/* send button */}
          <button className='w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center shrink-0 transition-all' onClick={handleSend}
            disabled={loading}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4 sm:w-5 sm:h-5 text-white'>
              <path d='M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z' />
            </svg>
          </button>

        </div>
        <p className='hidden sm:block text-center text-gray-600 text-xs mt-2'>Enter to Send · Shift+Enter for new line </p>
      </div>

      <style>{`
        textarea::-webkit-scrollbar {
          width: 4px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 9999px;
          margin: 8px 0;
        }
        textarea::-webkit-scrollbar-thumb {
          background: #3730a3;
          border-radius: 9999px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: #4f46e5;
        }
      `}</style>
    </div>
  )
}

export default ChatInput