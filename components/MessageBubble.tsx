

import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import { CheckIcon, DoubleCheckIcon } from './icons';
import { AppointmentForm } from './AppointmentForm';
import { SendMessagePayload, AppointmentFormData } from '../hooks/useChat';

/**
 * A custom hook for creating a typewriter effect.
 * @param text The full text to be typed out.
 * @param speed The speed of typing in milliseconds per character.
 * @returns The text that has been "typed" so far.
 */
const useTypewriter = (text: string, speed: number = 30): string => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (!text) return;

        setDisplayedText(''); // Reset when text prop changes for a new message

        let i = 0;
        const intervalId = setInterval(() => {
            i++;
            setDisplayedText(text.substring(0, i));
            if (i >= text.length) {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return displayedText;
};


interface MessageBubbleProps {
  message: Message;
  isSentByCurrentUser: boolean;
  onSendMessage: (payload: SendMessagePayload) => void;
}

const MessageStatus: React.FC<{ status: Message['status'] }> = ({ status }) => {
  if (status === 'read') {
    return <DoubleCheckIcon className="text-blue-500" />;
  }
  if (status === 'delivered') {
    return <DoubleCheckIcon className="text-gray-500 dark:text-gray-500" />;
  }
  return <CheckIcon className="text-gray-500 dark:text-gray-500" />;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSentByCurrentUser, onSendMessage }) => {
  const bubbleClasses = isSentByCurrentUser
    ? 'bg-teal-100 dark:bg-teal-800 self-end rounded-lg rounded-br-none'
    : 'bg-white dark:bg-gray-800 self-start rounded-lg rounded-bl-none';
  
  const typedText = useTypewriter(message.text);
  const displayText = isSentByCurrentUser ? message.text : typedText;
  const isTyping = !isSentByCurrentUser && displayText.length < message.text.length;
  const isTypingFinished = !isTyping || isSentByCurrentUser;

  const handleFormSubmit = (data: AppointmentFormData) => {
    onSendMessage({
        form: 'appointment',
        data,
        messageId: message.id,
    });
  }

  return (
    <div className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${bubbleClasses} p-3 shadow-md max-w-xs lg:max-w-md relative`}>
        <p className="text-gray-800 dark:text-gray-100 pr-12 whitespace-pre-wrap break-words">
          {/* The visible, animated text */}
          <span>{displayText}</span>
          {/* Blinking cursor */}
          {isTyping && <span className="inline-block align-middle w-0.5 h-4 bg-gray-800 dark:bg-gray-100 animate-pulse ml-1"></span>}
        </p>

        {message.formType === 'appointment' && !message.formSubmitted && isTypingFinished && (
            <AppointmentForm onSubmit={handleFormSubmit} />
        )}
        {message.formSubmitted && (
            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 italic">
                Form submitted. Thank you!
            </div>
        )}

        <div className="absolute bottom-1 right-2 flex items-center space-x-1">
          <p className="text-xs text-gray-400 dark:text-gray-600">{message.timestamp}</p>
          {isSentByCurrentUser && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
};