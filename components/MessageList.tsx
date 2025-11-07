
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { SendMessagePayload } from '../hooks/useChat';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isTyping?: boolean;
  contactAvatar?: string;
  onSendMessage: (payload: SendMessagePayload) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, isTyping, contactAvatar, onSendMessage }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isSentByCurrentUser={message.senderId === currentUserId}
          onSendMessage={onSendMessage}
        />
      ))}
      {isTyping && (
         <div className="flex items-end">
            {contactAvatar && <img src={contactAvatar} alt="typing" className="w-8 h-8 rounded-full mr-2"/>}
            <div className="bg-white dark:bg-gray-800 rounded-lg rounded-bl-none p-3 shadow-md max-w-xs lg:max-w-md">
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse delay-300"></span>
                </div>
            </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
