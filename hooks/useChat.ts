
import { useState, useCallback } from 'react';
import { Chat, Message } from '../types';
import { getInitialChats } from '../data/mockData';
import { currentUser } from '../data/mockData';

const WEBHOOK_URL = "https://n8n.srv1040836.hstgr.cloud/webhook/uae-client";

export type AppointmentFormData = {
    name: string;
    address: string;
    time: string;
};

export type SendMessagePayload = string | {
    form: 'appointment';
    data: AppointmentFormData;
    messageId: string;
};

export const useChat = () => {
    const [chats, setChats] = useState<Chat[]>(getInitialChats());
    const [appointmentFormShown, setAppointmentFormShown] = useState(false);

    const sendMessage = useCallback(async (chatId: string, payload: SendMessagePayload, sessionId: string) => {
        let text: string;
        let isFormSubmission = typeof payload !== 'string';
        
        if (isFormSubmission) {
            const formPayload = payload as { form: 'appointment', data: AppointmentFormData, messageId: string };
            // POST form data to a webhook
            try {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form: 'appointment', data: formPayload.data, chatId: sessionId }),
                });
            } catch (error) {
                console.error("Failed to submit form data to webhook:", error);
                // Optionally handle webhook submission failure
            }
            text = `I've submitted the following details:\n- Name: ${formPayload.data.name}\n- Address: ${formPayload.data.address}\n- Best time: ${formPayload.data.time}`;
        } else {
            text = payload as string;
        }

        if (!text.trim()) return;

        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            text,
            senderId: currentUser.id,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
        };

        // Optimistically update UI with user's message and mark form as submitted if applicable
        setChats(prevChats => {
            let updatedChats = prevChats;
            if (isFormSubmission) {
                const messageId = (payload as any).messageId;
                updatedChats = updatedChats.map(c =>
                    c.id === chatId ? {
                        ...c,
                        messages: c.messages.map(m =>
                            m.id === messageId ? { ...m, formSubmitted: true } : m
                        )
                    } : c
                );
            }
            return updatedChats.map(c =>
                c.id === chatId ? { ...c, messages: [...c.messages, newMessage] } : c
            );
        });

        // Show typing indicator
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, isTyping: true } : c));

        try {
            // Send message to webhook to get a reply
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, chatId: sessionId }),
            });
            
            if (!response.ok) throw new Error(`Webhook responded with status ${response.status}`);
            const responseText = await response.text();
            if (!responseText) throw new Error("Webhook returned an empty response.");

            let responseData;
            try { responseData = JSON.parse(responseText); } catch (error) { responseData = responseText; }

            const messagesToAdd: Message[] = [];
            let items: any[] = [];
            if (typeof responseData === 'string') items = [responseData];
            else if (Array.isArray(responseData)) items = responseData;
            else if (typeof responseData === 'object' && responseData !== null) {
                if (Array.isArray(responseData.messages)) items = responseData.messages;
                else if (Array.isArray(responseData.data)) items = responseData.data;
                else items = [responseData];
            }
            
            items.forEach((item, index) => {
                let replyText: string | null = null;
                if (typeof item === 'string' && item.trim().length > 0) replyText = item;
                else if (item && typeof item === 'object' && (item.text || item.message || item.output)) replyText = item.text || item.message || item.output;

                if (replyText) {
                    const botMessage: Message = {
                        id: `msg_${Date.now() + index + 1}`,
                        text: replyText,
                        senderId: chats.find(c => c.id === chatId)?.contactId || 'uae-spoton',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'delivered',
                    };

                    const lowerReplyText = replyText.toLowerCase();
                    if (
                        !appointmentFormShown &&
                        lowerReplyText.includes("name") &&
                        (lowerReplyText.includes("address") || lowerReplyText.includes("location")) &&
                        lowerReplyText.includes("time")
                    ) {
                        botMessage.formType = 'appointment';
                        setAppointmentFormShown(true);
                    }

                    messagesToAdd.push(botMessage);
                }
            });

            setChats(prev => prev.map(c => c.id === chatId ? { ...c, isTyping: false } : c));

            if (messagesToAdd.length > 0) {
                const typeMessagesSequentially = async () => {
                    for (const message of messagesToAdd) {
                        setChats(prev => prev.map(c => 
                            c.id === chatId ? { ...c, messages: [...c.messages, message] } : c
                        ));
                        const typingDuration = message.text.length * 30 + 500;
                        await new Promise(resolve => setTimeout(resolve, typingDuration));
                    }
                };
                typeMessagesSequentially();
            } else {
                const fallbackMessage: Message = {
                    id: `msg_${Date.now() + 1}`, text: "Sorry, I couldn't process that.", senderId: chats.find(c => c.id === chatId)?.contactId || 'uae-spoton', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'delivered',
                };
                setChats(prev => prev.map(c => 
                    c.id === chatId ? { ...c, messages: [...c.messages, fallbackMessage], isTyping: false } : c
                ));
            }

        } catch (error) {
            console.error("Failed to send message:", error);
             const errorMessage: Message = {
                id: `msg_${Date.now() + 1}`, text: "Sorry, I couldn't connect to the server. Please try again later.", senderId: chats.find(c => c.id === chatId)?.contactId || 'uae-spoton', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'delivered',
            };
             setChats(prev => prev.map(c => 
                c.id === chatId ? { ...c, messages: [...c.messages, errorMessage], isTyping: false } : c
            ));
        }

    }, [chats, appointmentFormShown]);
    
    const markAsRead = useCallback((chatId: string) => {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
            )
        );
    }, []);

    const resetChat = useCallback(() => {
        setChats(getInitialChats());
        setAppointmentFormShown(false);
    }, []);

    return { chats, sendMessage, markAsRead, resetChat };
};
