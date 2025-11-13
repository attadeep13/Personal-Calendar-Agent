import React from 'react';
import { CalendarOperation } from '../types';

interface SidebarButtonProps {
  operation: CalendarOperation;
  onClick: (operation: CalendarOperation) => void;
  isSelected: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ operation, onClick, isSelected }) => {
  const baseClasses = `w-full py-3 px-4 text-center text-lg font-medium rounded-lg 
                 transition-all duration-200 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-yellow-500`;
  
  const selectedClasses = 'bg-yellow-400 text-gray-900 font-bold';
  const unselectedClasses = `text-gray-300 border-2 border-transparent hover:border-yellow-400 hover:text-white`;

  return (
    <button
      onClick={() => onClick(operation)}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {operation}
    </button>
  );
};

export default SidebarButton;