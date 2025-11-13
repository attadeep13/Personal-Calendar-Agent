import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import { sendToN8n } from './services/n8nService';
import { ChatMessage, ChatMessageType } from './types';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    let sessionId = localStorage.getItem('calendarAgentSessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('calendarAgentSessionId', sessionId);
    }
    sessionIdRef.current = sessionId;
  }, []); // Runs only once on component mount

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDate(new Date()), 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: ChatMessageType.USER,
      text: text,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      const n8nResponseText = await sendToN8n(text, sessionIdRef.current);
      const n8nMessage: ChatMessage = {
        id: uuidv4(),
        type: ChatMessageType.N8N,
        text: n8nResponseText,
      };
      setMessages((prevMessages) => [...prevMessages, n8nMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        type: ChatMessageType.N8N,
        text: `Error contacting calendar agent: ${error instanceof Error ? error.message : String(error)}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const renderCalendar = () => {
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();
    const today = currentDate.getDate();

    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

    const days = [];
    // Blank days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="text-center p-2"></div>);
    }
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today;
      days.push(
        <div key={day} className={`text-center p-2 flex items-center justify-center`}>
          <span className={`w-10 h-10 flex items-center justify-center rounded-full ${isToday ? 'bg-yellow-400 text-gray-900 font-bold' : 'text-gray-300'}`}>
            {day}
          </span>
        </div>
      );
    }

    const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
      <aside className="w-96 bg-[#10123B]/50 backdrop-blur-sm p-8 flex flex-col hidden lg:flex">
        <h1 className="text-yellow-400 text-5xl font-bold text-center">{month.toUpperCase()}</h1>
        <div className="grid grid-cols-7 gap-2 mt-8">
          {dayHeaders.map(day => <div key={day} className="text-center font-bold text-sm text-gray-500">{day}</div>)}
          {days}
        </div>
      </aside>
    );
  };
  
  const chatPlaceholder = "Enter your prompt here...";

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#0B0C2B] text-gray-200 font-sans">
      {/* Sidebar (Left) */}
      <aside className="w-64 bg-[#10123B]/50 backdrop-blur-sm p-6 flex-col justify-between hidden sm:flex">
        {/* Top section with title */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-400 transform -skew-x-12"></div>
            <span className="text-xl font-bold">Calendar Agent</span>
          </div>
          <p className="text-sm text-gray-400">Your AI assistant for managing events.</p>
        </div>
        
        {/* Bottom section with year */}
        <div className="text-center">
          <span className="text-8xl font-bold text-yellow-400 opacity-50">{currentDate.getFullYear()}</span>
        </div>
      </aside>

      {/* Main Content (Center) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
             <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-xl shadow-md bg-[#1D1E3A] text-gray-400 italic">
                  Agent is typing...
                </div>
              </div>
          )}
        </div>
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder={chatPlaceholder}
          disabled={false}
        />
      </main>

      {/* Calendar (Right) */}
      {renderCalendar()}
    </div>
  );
}

export default App;
