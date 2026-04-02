import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Message from '../components/Message'
import ChatInput from '../components/ChatInput'


const API_URL = import.meta.env.VITE_API_URL

const Chat = () => {

  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [topBarVisible, setTopBarVisible] = useState(true)

  const messagesEndRef = useRef(null)
  const token = localStorage.getItem('token')
  const location = useLocation()

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }

  // On mount, check if we were navigated here from History with a chatId
  useEffect(() => {
    fetchChats()
    if (location.state?.chatId) {
      loadChat(location.state.chatId)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_URL}/chat`, {
        headers: authHeaders,
      })
      const data = await res.json()

      if (!res.ok) {
        console.log('Failed to fetch chats:', data.message)
        return
      }

      setChats(data)
    } catch (err) {
      console.log('Fetch chats error:', err.message)
    }
  }

  const loadChat = async (chatId) => {
    try {
      const res = await fetch(`${API_URL}/chat/${chatId}`, {
        headers: authHeaders,
      })
      const data = await res.json()

      if (!res.ok) {
        console.log('Failed to load chat:', data.message)
        return
      }

      setCurrentChatId(chatId)
      setMessages(data.messages)
    } catch (err) {
      console.log('Load chat error:', err.message)
    }
  }

  const startNewChat = () => {
    setCurrentChatId(null)
    setMessages([])
  }

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          message: text,
          chatId: currentChatId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Server error')
      }

      setCurrentChatId(data.chatId)
      setMessages(data.messages)

      fetchChats()

    } catch (err) {
      console.log('Send message error:', err.message)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const deleteChat = async (chatId) => {
    try {
      const res = await fetch(`${API_URL}/chat/${chatId}`, {
        method: 'DELETE',
        headers: authHeaders,
      })

      if (!res.ok) {
        console.log('Delete failed')
        return
      }

      if (chatId === currentChatId) startNewChat()
      setChats((prev) => prev.filter((c) => c._id !== chatId))

    } catch (err) {
      console.log('Delete chat error:', err.message)
    }
  }

  return (
    <div className='flex h-screen bg-[#0f0f1a] overflow-hidden'>

      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={startNewChat}
        onSelectChat={loadChat}
        onDeleteChat={deleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className='flex-1 flex flex-col overflow-hidden min-w-0'>

        <div className='md:hidden flex justify-end px-3 pt-2'>
          <button
            onClick={() => setTopBarVisible((prev) => !prev)}
            className='text-gray-400 hover:text-white transition-colors p-1'
            title={topBarVisible ? 'Hide bar' : 'Show bar'}
          >
            {topBarVisible ? (
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88' />
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' />
                <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
              </svg>
            )}
          </button>
        </div>

        {topBarVisible && (
          <div className='md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0f0f1a]'>

            <button
              onClick={() => setSidebarOpen(true)}
              className='text-gray-400 hover:text-white transition-colors p-1'
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
              </svg>
            </button>

            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-xs'>{'\u2726'}</div>
              <span className='text-white text-sm font-medium truncate'>
                {currentChatId
                  ? chats.find((c) => c._id === currentChatId)?.title || 'Chat'
                  : 'AI Chat'}
              </span>
            </div>

          </div>
        )}

        {/* Message scroll area */}
        <div className='flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6'>
          <div className='max-w-3xl mx-auto'>

            {messages.length === 0 && (
              <div className='text-center mt-16 sm:mt-24 px-4'>
                <div className='w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center'>
                  <span className='text-2xl sm:text-3xl'>{'\u2726'}</span>
                </div>
                <h2 className='text-white text-lg sm:text-xl font-semibold mb-2'>What can I help with?</h2>
                <p className='text-gray-500 text-sm'>
                  Ask me anything — coding, writing, math, ideas...
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <Message key={index} role={msg.role} content={msg.content} />
            ))}

            {loading && (
              <div className='flex gap-2 sm:gap-3 mb-4'>
                <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2a2a3e] border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs shrink-0'>
                  {'\u2726'}
                </div>
                <div className='bg-[#1a1a2e] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3'>
                  <div className='flex gap-1.5 items-center h-5'>
                    <span className='dot-1 w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block' />
                    <span className='dot-2 w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block' />
                    <span className='dot-3 w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block' />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>
        </div>

        <ChatInput onSend={sendMessage} loading={loading} />

      </div>
    </div>
  )
}

export default Chat