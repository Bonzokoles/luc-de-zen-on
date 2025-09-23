import React, { useState, useEffect } from 'react';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Avatar
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

interface GenerationItem {
    id: number;
    prompt: string;
    imageUrl: string;
    ts: string;
    settings?: {
        model?: string;
        style?: string;
        width?: number;
        height?: number;
        steps?: number;
    };
}

interface ChatHistoryProps {
    className?: string;
    maxItems?: number;
    showInput?: boolean;
    onNewMessage?: (message: string) => void;
}

export default function ChatHistory({
    className = '',
    maxItems = 10,
    showInput = false,
    onNewMessage
}: ChatHistoryProps) {
    const [history, setHistory] = useState<GenerationItem[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Load generation history from localStorage
        const loadHistory = () => {
            try {
                const stored = localStorage.getItem('imageHistory') || '[]';
                const parsed = JSON.parse(stored) as GenerationItem[];
                setHistory(parsed.slice(0, maxItems));
            } catch (e) {
                console.error('Error loading history:', e);
                setHistory([]);
            }
        };

        // Initial load
        loadHistory();

        // Listen for refresh events
        const handleRefresh = () => {
            loadHistory();
        };

        window.addEventListener('refreshChatHistory', handleRefresh);

        return () => {
            window.removeEventListener('refreshChatHistory', handleRefresh);
        };
    }, [maxItems]);

    useEffect(() => {
        // Convert generation history to chat messages
        const chatMessages = history.map((item, index) => {
            const isUser = index % 2 === 0; // Alternate between user and AI
            const timeAgo = formatTimeAgo(item.ts);

            return {
                message: isUser ? item.prompt : "🎨 Obraz wygenerowany!",
                sentTime: timeAgo,
                sender: isUser ? "Ty" : "AI Generator",
                direction: isUser ? "outgoing" : "incoming",
                position: "single",
                type: "custom",
                payload: isUser ? null : (
                    <div className="chat-image-message">
                        <img
                            src={item.imageUrl}
                            alt="Generated"
                            className="chat-generated-image"
                            onClick={() => openImagePreview(item.imageUrl)}
                        />
                        <div className="chat-image-details">
                            <small>Model: {item.settings?.model?.split('/').pop() || 'Unknown'}</small>
                            <small>Size: {item.settings?.width}×{item.settings?.height}</small>
                        </div>
                    </div>
                )
            };
        });

        setMessages(chatMessages);
    }, [history]);

    const formatTimeAgo = (timestamp: string): string => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Teraz';
        if (diffMins < 60) return `${diffMins}min temu`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h temu`;
        return `${Math.floor(diffMins / 1440)}d temu`;
    };

    const openImagePreview = (imageUrl: string) => {
        // Integration with existing modal
        const modalImage = document.getElementById('modalImage') as HTMLImageElement;
        const imageModal = document.getElementById('imageModal');

        if (modalImage && imageModal) {
            modalImage.src = imageUrl;
            imageModal.classList.remove('hidden');
        }
    };

    const handleSendMessage = (message: string) => {
        if (onNewMessage) {
            onNewMessage(message);
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        .cyberpunk-chat-container {
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(15px);
          border-radius: 8px;
          border: 1px solid rgba(0, 188, 212, 0.3);
          overflow: hidden;
        }

        /* Cyberpunk Theme Overrides */
        .cs-main-container {
          background: transparent !important;
          border: none !important;
        }

        .cs-chat-container {
          background: transparent !important;
          border: none !important;
        }

        .cs-message-list {
          background: transparent !important;
          padding: 1rem;
        }

        .cs-message {
          margin-bottom: 1rem;
        }

        .cs-message--incoming {
          align-items: flex-start;
        }

        .cs-message--outgoing {
          align-items: flex-end;
        }

        .cs-message__content-wrapper {
          background: rgba(0, 188, 212, 0.1) !important;
          border: 1px solid rgba(0, 188, 212, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          max-width: 280px;
        }

        .cs-message--outgoing .cs-message__content-wrapper {
          background: rgba(139, 92, 246, 0.1) !important;
          border-color: rgba(139, 92, 246, 0.3);
        }

        .cs-message__content {
          color: #e5e7eb !important;
          padding: 0.75rem;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .cs-message__header {
          padding: 0.5rem 0.75rem 0 0.75rem;
        }

        .cs-message__sender-name {
          color: #00bcd4 !important;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .cs-message--outgoing .cs-message__sender-name {
          color: #8b5cf6 !important;
        }

        .cs-message__sent-time {
          color: #9ca3af !important;
          font-size: 0.625rem;
        }

        .cs-message-input {
          background: rgba(0, 0, 0, 0.5) !important;
          border: 1px solid rgba(0, 188, 212, 0.3) !important;
          border-radius: 8px;
          margin: 1rem;
        }

        .cs-message-input__content-editor {
          color: #e5e7eb !important;
          background: transparent !important;
          padding: 0.75rem;
        }

        .cs-button--send {
          background: linear-gradient(90deg, #00bcd4 0%, #8b5cf6 100%) !important;
          border: none !important;
          color: white !important;
        }

        .cs-button--send:hover {
          background: linear-gradient(90deg, #0097a7 0%, #7c3aed 100%) !important;
        }

        .chat-image-message {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 250px;
        }

        .chat-generated-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
          border: 1px solid rgba(0, 188, 212, 0.3);
        }

        .chat-generated-image:hover {
          transform: scale(1.05);
          border-color: rgba(0, 188, 212, 0.6);
        }

        .chat-image-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .chat-image-details small {
          color: #9ca3af;
          font-size: 0.625rem;
        }

        /* Scrollbar styling */
        .cs-message-list .cs-scrollbar__wrapper {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 188, 212, 0.3) transparent;
        }

        .cs-message-list .cs-scrollbar__wrapper::-webkit-scrollbar {
          width: 6px;
        }

        .cs-message-list .cs-scrollbar__wrapper::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        .cs-message-list .cs-scrollbar__wrapper::-webkit-scrollbar-thumb {
          background: rgba(0, 188, 212, 0.3);
          border-radius: 3px;
        }

        .cs-message-list .cs-scrollbar__wrapper::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 188, 212, 0.5);
        }

        /* Avatar styling */
        .cs-avatar {
          background: linear-gradient(45deg, #00bcd4, #8b5cf6) !important;
          border: 2px solid rgba(0, 188, 212, 0.3);
          width: 32px !important;
          height: 32px !important;
          font-size: 0.75rem;
        }

        /* Typing indicator styling */
        .cs-typing-indicator {
          background: rgba(0, 188, 212, 0.1) !important;
          border: 1px solid rgba(0, 188, 212, 0.3);
          backdrop-filter: blur(10px);
        }

        .cs-typing-indicator__content {
          color: #00bcd4 !important;
        }
        `
            }} />

            <div className={`cyberpunk-chat-container ${className}`}>

                <MainContainer responsive>
                    <ChatContainer>
                        <MessageList
                            autoScrollToBottom
                            autoScrollToBottomOnMount
                            scrollBehavior="smooth"
                        >
                            {messages.map((msg, index) => (
                                <Message
                                    key={index}
                                    model={{
                                        message: msg.message,
                                        sentTime: msg.sentTime,
                                        sender: msg.sender,
                                        direction: msg.direction,
                                        position: msg.position,
                                        type: msg.type,
                                        payload: msg.payload
                                    }}
                                >
                                    <Avatar
                                        name={msg.sender}
                                        status="available"
                                    />
                                </Message>
                            ))}
                        </MessageList>          {showInput && (
                            <MessageInput
                                placeholder="Opisz jaki obraz chcesz wygenerować..."
                                onSend={handleSendMessage}
                                attachButton={false}
                                sendButton={true}
                            />
                        )}
                    </ChatContainer>
                </MainContainer>
            </div>
        </>
    );
}