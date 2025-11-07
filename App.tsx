
import React, { useState, useMemo, useEffect } from 'react';
import { User, Chat } from './types';
import { contacts } from './data/mockData';
import { useChat, SendMessagePayload } from './hooks/useChat';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { LoginScreen } from './components/LoginScreen';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { chats, sendMessage, markAsRead, resetChat } = useChat();
    const [activeChatId] = useState<string | null>('chat1');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    useEffect(() => {
        if(activeChatId) {
            markAsRead(activeChatId);
        }
    }, [chats, activeChatId, markAsRead]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleLogin = (username: string) => {
        setCurrentUser({ 
            id: 'user1',
            name: username,
            avatar: `https://res.cloudinary.com/dsscxxw0b/image/upload/v1762254834/square-image_lmbfft.png?user=${username}`
        });
    };
    
    const handleSendMessage = (chatId: string, payload: SendMessagePayload) => {
        sendMessage(chatId, payload, sessionId);
    };

    const resetSession = () => {
        if(window.confirm('Are you sure you want to start a new chat? The current conversation will be lost.')) {
            resetChat();
            setSessionId(crypto.randomUUID());
        }
    };

    const activeChat = useMemo<Chat | undefined>(
        () => chats.find(chat => chat.id === activeChatId),
        [chats, activeChatId]
    );

    const activeContact = useMemo(
        () => contacts.find(contact => contact.id === activeChat?.contactId),
        [activeChat]
    );

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen w-screen text-gray-800 dark:text-gray-200 antialiased overflow-hidden bg-gray-100 dark:bg-black">
            <div className="w-full h-full flex">
                <Sidebar 
                    currentUser={currentUser}
                    chats={chats}
                    contacts={contacts}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onResetSession={resetSession}
                />
                <ChatWindow 
                    chat={activeChat}
                    contact={activeContact}
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default App;