import { Injectable } from '@angular/core';
import * as pako from 'pako';
import { marked } from 'marked';
import {SocketService} from "./services/socket.service";
import {Message} from "../models/message.model";


declare var hljs: any;

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private socketService: SocketService) { }

  initializeServices(): void {
    this.socketService.initializeSocket();
    this.socketService.onMessage().subscribe(data => this.handleIncomingMessage(data));
  }

  handleIncomingMessage(data: string): Message {
    const message: Message = { role: "system", content: data };
    return message;
  }

  addToConversationHistory(conversationHistory: Message[], message: Message): void {
    conversationHistory.push(message);
  }

  async fetchMessages(): Promise<Message[]> {
    try {
      const response = await fetch('http://chatgpt.intra:3000/getMessages');
      if (!response.ok) throw new Error('Network response was not ok');
      const messages: Message[] = await response.json();
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return [];
    }
  }

  emitCompressedHistory(conversationHistory: Message[]): string {
    const compressedData = pako.deflate(JSON.stringify(conversationHistory));
    return btoa(String.fromCharCode.apply(null, Array.from(compressedData)));
  }

  appendMessage(role: string, content: string): Message {
    const parsedContent = marked.parse(content);
    const message: Message = { role, content: parsedContent };

    // Détecter si le contenu analysé contient un bloc de code
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = parsedContent;
    const codeBlocks = tempDiv.querySelectorAll('pre code');
    if (codeBlocks.length > 0) {
      message.isCode = true;
    }

    return message;
  }
}
