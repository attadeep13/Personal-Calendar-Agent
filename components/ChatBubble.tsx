import React from 'react';
import { ChatMessage, ChatMessageType } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.type === ChatMessageType.USER;
  const isSystem = message.type === ChatMessageType.SYSTEM;
  const isN8n = message.type === ChatMessageType.N8N;

  let bubbleClasses = 'max-w-[80%] p-4 rounded-xl shadow-md text-white';
  let containerClasses = 'flex mb-4';

  if (isUser) {
    bubbleClasses += ' bg-blue-600';
    containerClasses += ' justify-end';
  } else if (isSystem) {
    bubbleClasses += ' bg-transparent border border-gray-700 text-gray-400 italic text-sm w-full text-center';
    containerClasses += ' justify-center';
  } else if (isN8n) {
    bubbleClasses += ' bg-[#1D1E3A]';
    containerClasses += ' justify-start';
  }

  return (
    <div className={`${containerClasses} w-full`}>
      <div className={bubbleClasses}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
