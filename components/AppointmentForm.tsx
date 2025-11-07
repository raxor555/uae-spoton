
import React, { useState } from 'react';
import { AppointmentFormData } from '../hooks/useChat';

interface AppointmentFormProps {
    onSubmit: (data: AppointmentFormData) => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && address.trim() && time.trim()) {
            onSubmit({ name, address, time });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700 space-y-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Please provide your details below:</div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                required
            />
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="w-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                required
            />
            <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Best time to arrive"
                className="w-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                required
            />
            <button
                type="submit"
                className="w-full px-3 py-1.5 text-sm font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200"
            >
                Send Details
            </button>
        </form>
    );
};
