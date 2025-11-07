import React from 'react';
import { Chat, Contact } from '../types';

interface ChatListItemProps {
  chat: Chat;
  contact: Contact;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, contact }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <div
      className="flex items-center p-3 bg-gray-200 dark:bg-gray-700"
    >
      <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-md font-semibold text-gray-800 dark:text-gray-100 truncate">{contact.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{lastMessage?.timestamp}</p>
        </div>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {chat.isTyping ? <span className="text-teal-400 italic">typing...</span> : lastMessage?.text}
          </p>
          {chat.unreadCount > 0 && (
            <span className="bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};