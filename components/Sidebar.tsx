import React from 'react';
import { User, Chat, Contact } from '../types';
import { ChatList } from './ChatList';
import { MoreVertIcon, SearchIcon, SunIcon, MoonIcon, ReloadIcon } from './icons';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  contacts: Contact[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onResetSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, chats, contacts, theme, toggleTheme, onResetSession }) => {
  return (
    <div className="w-full md:w-[35%] lg:w-[30%] xl:w-[25%] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      {/* Sidebar Header */}
      <header className="p-3 bg-gray-100 dark:bg-gray-800 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
        <div className="flex items-center space-x-2">
            <button onClick={onResetSession} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" title="New Chat">
                <ReloadIcon />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500" title="Toggle Theme">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <MoreVertIcon />
            </button>
        </div>
      </header>
      
      {/* Search Bar */}
      <div className="p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
            <input 
                type="text" 
                placeholder="Search or start new chat"
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList 
            chats={chats} 
            contacts={contacts} 
        />
      </div>
    </div>
  );
};