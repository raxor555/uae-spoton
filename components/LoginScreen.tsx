import React, { useState } from 'react';

interface LoginScreenProps {
    onLogin: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200 dark:bg-black">
            <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Welcome to UAE Spoton</h1>
                <p className="text-gray-600 dark:text-gray-500 mb-6">Enter your name to start chatting.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-4 py-2 mb-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-300"
                    >
                        Join Chat
                    </button>
                </form>
            </div>
        </div>
    );
};