
import React from 'react';
import { Chat, Contact, User } from '../types';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { SendMessagePayload } from '../hooks/useChat';

interface ChatWindowProps {
  chat: Chat | undefined;
  contact: Contact | undefined;
  currentUser: User;
  onSendMessage: (chatId: string, payload: SendMessagePayload) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, contact, currentUser, onSendMessage }) => {
  if (!chat || !contact) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center">
        <div className="w-96 h-96 bg-contain bg-center bg-no-repeat" style={{backgroundImage: "url('https://cdn-icons-png.freepik.com/256/17085/17085477.png?semt=ais_white_label')"}}></div>
        <h2 className="mt-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Chat with UAE Spoton</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
          Loading chat...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-cover bg-center" style={{backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')"}}>
      <div className="relative flex flex-col h-full bg-white/70 dark:bg-black/80 backdrop-blur-sm">
        <ChatHeader contact={contact} />
        <MessageList 
            messages={chat.messages} 
            currentUserId={currentUser.id} 
            isTyping={chat.isTyping} 
            contactAvatar={contact.avatar}
            onSendMessage={(payload) => onSendMessage(chat.id, payload)}
        />
        <MessageInput onSendMessage={(text) => onSendMessage(chat.id, text)} />
      </div>
    </div>
  );
};
