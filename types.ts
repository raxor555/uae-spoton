
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Contact extends User {}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  status: 'sent' | 'delivered' | 'read';
  formType?: 'appointment';
  formSubmitted?: boolean;
}

export interface Chat {
  id: string;
  contactId: string;
  messages: Message[];
  isTyping?: boolean;
  unreadCount: number;
}