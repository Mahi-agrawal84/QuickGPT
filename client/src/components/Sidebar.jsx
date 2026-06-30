import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import { useEffect, useRef } from 'react'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const { chats, setSelectedChat, theme, setTheme, user, logout, deleteChat, navigate, createNewChat, axios, setChats, fetchUsersChats, setToken, token } = useAppContext()
  const [search, setSearch] = useState('')

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')

  }

  const deleteChat = async (e, chatId) => {
    try{
      e.stopPropagation()
      const confirm = window.confirm('Are you sure you want to delete this chat?')
      if(!confirm) return
      const {data} = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization: token}})
      if(data.success){
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUsersChats()
        toast.success(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 bg-white dark:bg-[#09090b] border-r border-gray-200 dark:border-white/5 transition-all duration-500 max-md:fixed left-0 top-0 bottom-0 z-50 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>

      {/* Mobile Close Icon */}
      <img 
        onClick={() => setIsMenuOpen(false)} 
        src={assets.close_icon} 
        className='absolute top-5 right-5 w-5 h-5 cursor-pointer md:hidden opacity-60 hover:opacity-100 z-50 not-dark:invert' 
        alt="Close" 
      />

      {/* Logo Section */}
      <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="Logo" className='w-full max-w-[210px] mb-6' />

      {/* New Chat Button */}
      <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm font-medium rounded-lg cursor-pointer shadow-sm active:scale-95 transition-all'>
        <span className='mr-2 text-lg'>+</span> New Chat
      </button>

      {/* Search Bar */}
      <div className='flex items-center gap-3 px-4 py-2.5 mt-4 border border-gray-200 dark:border-white/10 rounded-lg'>
        <img src={assets.search_icon} className='w-4 opacity-50 not-dark:invert' alt="" />
        <input onChange={(e) => setSearch(e.target.value)} value={search} type="text"
          placeholder='Search conversations' className='text-sm bg-transparent outline-none w-full placeholder:text-gray-400' />
      </div>

      {/* --- Recent Chats Section --- */}
      <div className='mt-6 flex-1 overflow-y-auto no-scrollbar min-h-0'>
        {/* 'Recent Chats' heading ko dark mode mein White rakha hai bina extra boldness ke */}
        {chats.length > 0 && (
          <p className='text-xs font-bold text-gray-500 dark:text-white mb-3 uppercase tracking-tight'>
            Recent Chats
          </p>
        )}
        
        <div className='flex flex-col gap-2.5 pr-1'>
          {
            chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase()))
              .map((chat) => (
                <div onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }}
                  key={chat._id} className='group flex items-center justify-between px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shrink-0 relative'>
                  
                  <div className='flex flex-col overflow-hidden flex-1 mr-2'>
                    {/* Chat titles bhi dark mode mein white dikhenge */}
                    <p className='truncate text-[13px] font-medium text-gray-800 dark:text-white'>
                      {chat.messages.length > 0 ? chat.messages[0]?.content : chat.name}
                    </p>
                    <p className='text-[10px] text-gray-400 mt-0.5'>{moment(chat.updatedAt).fromNow()}</p>
                  </div>

                  <img 
                    onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
                    src={assets.bin_icon} 
                    className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-all brightness-0 dark:brightness-200' 
                    alt="Delete" 
                  />
                </div>
              ))
          }
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className='flex flex-col gap-2.5 mt-auto pt-4'>

        <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} 
          className='flex items-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-105 transition-transform duration-300'>
          <img src={assets.gallery_icon} className='w-4.5 not-dark:invert opacity-70' alt="" />
          <p className='text-sm font-medium'>Community Images</p>
        </div>

        <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} 
          className='flex items-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-105 transition-transform duration-300'>
          <img src={assets.diamond_icon} className='w-4.5 dark:invert opacity-70' alt="" />
          <div className='flex flex-col'>
            <p className='text-sm font-medium leading-tight'>Credits : {user?.credits || 0}</p>
            <p className='text-[10px] text-gray-400 mt-0.5'>Purchase credits to use quickgpt</p>
          </div>
        </div>

        <div className='flex items-center justify-between px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg'>
          <div className='flex items-center gap-3 text-sm font-medium opacity-80'>
            <img src={assets.theme_icon} className='w-4.5 not-dark:invert' alt="" />
            <p>Dark Mode</p>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-[#9333ea]' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
          </button>
        </div>

        <div className='flex items-center justify-between gap-3 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg group hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer'>
          <div className='flex items-center gap-3 overflow-hidden'>
            <img src={assets.user_icon} className='w-8 h-8 rounded-full shadow-sm' alt="" />
            <p className='text-sm font-bold text-gray-700 dark:text-gray-200 truncate'>
              {user ? user.name : 'Mahi Agrawal'}
            </p>
          </div>
          
          {user && (
            <img 
              onClick={(e) => { e.stopPropagation(); logout(); }}
              src={assets.logout_icon} 
              className='w-4.5 h-4.5 opacity-0 group-hover:opacity-100 transition-all brightness-0 dark:brightness-200' 
              alt="Logout" 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar