import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000/api'

const History = () => {

    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/chat`, {
                headers: authHeaders,
            })
            const data = await res.json()

            if (!res.ok) {
                console.log('Failed to fetch history:', data.message)
                return
            }

            setChats(data)
        } catch (err) {
            console.log('Fetch history error:', err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const deleteChat = async (e, chatId) => {
        e.stopPropagation()

        try {
            const res = await fetch(`${API_URL}/chat/${chatId}`, {
                method: 'DELETE',
                headers: authHeaders,
            })

            if (!res.ok) {
                console.log('Delete failed')
                return
            }

        
            setChats((prev) => prev.filter((c) => c._id !== chatId))

        } catch (err) {
            console.log('Delete error:', err.message)
        }
    }

    return (
        <div className='min-h-screen bg-[#0f0f1a]'> 
            <div className='border-b border-white/10 px-6 py-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <button className='text-gray-400 hover:text-white transition-colors' onClick={() => navigate('/chat')}
                    >{'\u2190'} Back</button>
                    <h1 className='text-white font-semibold'>Chat History</h1>
                </div>
                <span className='text-gray-500 text-sm'>{chats.length} conversations</span>
            </div>
            
            <div className='max-w-3xl mx-auto px-4 py-8'>
                {loading ? (
                    <div className='text-center text-gray-500 mt-20'>Loading...</div>

                ) : chats.length === 0 ? (
                    <div className='text-center mt-20'>
                        <p className='text-gray-500 text-lg mb-2'>No chat history yet</p>
                        <p className='text-gray-600 text-sm'>Start a conversation to see it here</p>
                        <button className='mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2.5 rounded-lg transition-colors' onClick={() => navigate('/chat')}
                        >Start Chatting</button>
                    </div>

                ) : (
                    <div className='space-y-3'>
                        {chats.map((chat) => (
                            <div
                                className='bg-[#1a1a2e] border border-white/10 rounded-xl px-5 py-4 cursor-pointer hover:border-indigo-500/40 hover:bg-[#1e1e35] transition-all group'
                                key={chat._id}
                                onClick={() => navigate('/chat')}
                            >
                                <div className='flex items-start justify-between gap-3'>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-white text-sm font-medium truncate group-hover:text-indigo-300 transition-colors'>
                                            {chat.title}
                                        </h3>
                                        <p className='text-gray-500 text-xs mt-1'>{formatDate(chat.updatedAt)} at {formatTime(chat.updatedAt)}</p>
                                    </div>
                                    <button className='opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs transition-all shrink-0 mt-0.5' onClick={(e) => deleteChat(e, chat._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default History
