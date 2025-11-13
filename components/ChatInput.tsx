import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, placeholder, disabled = false }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled || !inputValue.trim()) {
      return;
    }
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-transparent w-full">
      <div
        className={`w-full flex rounded-full border overflow-hidden shadow-lg transition-all duration-300 ${
          disabled
            ? 'bg-[#1D1E3A]/50 border-gray-800 cursor-not-allowed'
            : 'bg-[#1D1E3A] border-gray-700'
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-grow p-4 text-gray-200 bg-transparent outline-none placeholder-gray-500 focus:ring-0 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={disabled}
          className={`bg-yellow-400 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center m-1
                     transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75
                     ${!disabled ? 'hover:bg-yellow-500' : ''}
                     disabled:bg-yellow-400/30 disabled:cursor-not-allowed`}
          aria-label="Send message"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.553.894l5 1.429a1 1 0 001.169-1.409l-7-14z"></path>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
