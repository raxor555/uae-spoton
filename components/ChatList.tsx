import React from 'react';
import { Chat, Contact } from '../types';
import { ChatListItem } from './ChatListItem';

interface ChatListProps {
  chats: Chat[];
  contacts: Contact[];
}

export const ChatList: React.FC<ChatListProps> = ({ chats, contacts }) => {
  // Sorting isn't necessary for one chat but doesn't harm
  const sortedChats = [...chats].sort((a, b) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    return (lastMessageB?.timestamp || '').localeCompare(lastMessageA?.timestamp || '');
  });

  return (
    <div>
      {sortedChats.map(chat => {
        const contact = contacts.find(c => c.id === chat.contactId);
        if (!contact) return null;
        return (
          <ChatListItem
            key={chat.id}
            chat={chat}
            contact={contact}
          />
        );
      })}
    </div>
  );
};
