import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'


const Sidebar = ({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat, isOpen, onClose }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const handleNewChat = () => {
        onNewChat()
        onClose()
    }

    const handleSelectChat = (id) => {
        onSelectChat(id)
        onClose()
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }


    return (
        <div className={` fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#0d0d1a] border-r border-white/10 flex-col h-full transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

            <div className='p-4 border-b border-white/10'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <div className='w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center   text-sm'>
                            {'\u2726'}
                        </div>
                        <span className='text-white font-semibold text-sm'>UNIT-01</span>
                    </div>
                    <button className='md:hidden text-gray-500 hover:text-white text-lg leading-none p-1' onClick={onClose}>
                        {'\u2715'}
                    </button>
                </div>
                <button className='w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium rounded-lg px-3 py-2.5 flex items-center gap-2 transition-all' onClick={handleNewChat}>
                    <span className='text-base leading-none'>+</span>
                    New Chat
                </button>
            </div>
            <div className='flex-1 overflow-y-auto p-2'>
                <button className={`w-full text-left px-3 py-2 rounded-lg  text-sm  mb-1 flex items-center gap-2 transition-colors ${location.pathname === '/history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => { navigate('/history'); onClose() }}>
                    <span>{'\u{1F4CB}'}</span>
                    All History
                </button>

                <div className='h-px bg-white/10 my-2' />
                {chats.length === 0 ? (
                    <p className='text-gray-600 text-xs text-center mt-6 px-2'>
                        No Chats yet. Start a Conversation!
                    </p>
                ) : (
                    chats.map((chat) => (
                        <div key={chat._id} className={`group flex items-center rounded-lg mb-0 transition-colors ${currentChatId === chat._id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                            <button className='flex-1 text-left px-3 py-2.5 min-w-0' onClick={() => handleSelectChat(chat._id)}>
                                <p className={`text-sm truncate ${currentChatId === chat._id ? 'text-white' : 'text-gray-400 '}`}>
                                    {chat.title}
                                </p>
                            </button>

                            <button className='opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 pr-3 text-xs transition-opacity' onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id) }}>
                                {'\u2715'}
                            </button>
                        </div>
                    ))
                )}

            </div>
            <div className='p-4 border-t border-white/10'>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2 min-w-0'>
                        <div className='w-7 h-7 bg-indigo-900 rounded-full flex items-center justify-center text-xs text-indigo-300 font-bold shrink-0'>
                            {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className='text-gray-400 text-xs truncate'>{user.name}</span>
                    </div>
                    <button className='text-gray-600 hover:text-gray-300 text-xs transition-colors whitespace-nowrap' onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar