import { User, Contact, Chat, Message } from '../types';

export const currentUser: User = {
  id: 'user1',
  name: 'You',
  avatar: '', // This will be set on login
};

export const contacts: Contact[] = [
  { id: 'uae-spoton', name: 'UAE Spoton', avatar: 'https://cdn-icons-png.freepik.com/256/17085/17085477.png?semt=ais_white_label' },
];

// Using a template and reconstructing the object ensures a true deep copy for each session.
const chatTemplate = {
    id: 'chat1',
    contactId: 'uae-spoton',
    unreadCount: 1,
};

const messageTemplate = {
    text: 'Hello! Welcome to UAE Spoton support. How can I help you today?', 
    senderId: 'uae-spoton', 
    status: 'read' as Message['status']
};

export const getInitialChats = (): Chat[] => ([
  {
    ...chatTemplate,
    messages: [
      { 
        ...messageTemplate,
        id: `msg_${Date.now()}`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      },
    ],
  },
]);