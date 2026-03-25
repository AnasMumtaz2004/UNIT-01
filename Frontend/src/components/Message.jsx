import React from 'react'
import ReactMarkdown from 'react-markdown'

const Message = ({ role, content }) => {
    const isUser = role === 'user';
    return (
        <div className={`message-enter flex gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
            
            {/* icon */}
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center 
                justify-center text-xs font-bold 
                ${isUser ? 'bg-indigo-600 text-white' : 'bg-[#2a2a3e] text-indigo-400 border border-indigo-500/30'}`}>
                {isUser ? 'U' : '\u2726'}
            </div>

            {/* Message  */}
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm text-gray-200 
                ${isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-[#1a1a2e] border border-white/10 rounded-tl-sm'}`}>
                {isUser ? (
                    <p className='whitespace-pre-wrap'>{content}</p>
                ) : (
                    <ReactMarkdown components={{
                        code: ({ children }) => (
                            <code className='bg-black/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs break-all'>
                                {children}
                            </code>
                        ),
                        pre: ({ children }) => (
                            <pre className='bg-black/40 rounded-lg p-3 mt-2 overflow-x-auto font-mono text-xs text-green-400 max-w-full'>
                                {children}
                            </pre>
                        ),
                        p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                        ul: ({ children }) => <ul className='list-disc list-inside mb-2 space-y-1'>{children}</ul>,
                        ol: ({ children }) => <ol className='list-decimal list-inside mb-2 space-y-1'>{children}</ol>,
                        li: ({ children }) => <li className='text-sm'>{children}</li>,
                    }}>
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    )
}

export default Message