

// FIX: Add missing CalendarOperation enum as it is used in SidebarButton.tsx
export enum CalendarOperation {
  CREATE_EVENT = 'Create Event',
  LIST_EVENTS = 'List Events',
  UPDATE_EVENT = 'Update Event',
  DELETE_EVENT = 'Delete Event',
}

export enum ChatMessageType {
  USER = 'user',
  SYSTEM = 'system',
  N8N = 'n8n',
}

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  text: string;
}