import React from 'react';
import { Contact } from '../types';
import { MoreVertIcon } from './icons';

interface ChatHeaderProps {
  contact: Contact;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <header className="p-3 bg-gray-100 dark:bg-gray-800 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="flex items-center">
        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{contact.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">online</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <MoreVertIcon />
      </div>
    </header>
  );
};