export type MessageType = MessageTypePopup | MessageTypeContent;

export interface Message {
  type: MessageType;
}

export enum MessageTypePopup {
  PopupTest,
}

export interface MessagePopup extends Message {
  type: MessageTypePopup.PopupTest;
  message: string;
}

export enum MessageTypeContent {
  ContentTest,
}

export interface MessageContent extends Message {
  type: MessageTypeContent.ContentTest;
  active: boolean;
}
