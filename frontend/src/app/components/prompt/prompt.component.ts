import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { SocketService } from "../../services/services/socket.service";
import { InitializationService } from "../../services/services/initialization.service";
import { PromptService } from "../../services/prompt.service";

@Component({
	selector: 'app-prompt',
	templateUrl: './prompt.component.html',
	styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit, OnDestroy {

	private conversationHistory: Message[] = [];
	@ViewChild('inputText', { static: true }) inputText!: ElementRef;
	@ViewChild('output', { static: true }) output!: ElementRef;

	public messages: Message[] = [];

	constructor(
		private socketService: SocketService,
		private initService: InitializationService,
		private promptService: PromptService
	) { }

	ngOnInit(): void {
		this.initService.initializeMarked();
		this.initService.initializeClipboard();
		this.promptService.initializeServices();
		this.fetchMessages();
	}

	ngOnDestroy(): void {
		this.socketService.disconnectSocket();
	}

	private fetchMessages(): void {
		this.promptService.fetchMessages().then((messages: Message[]) => {
			messages.forEach(msg => {
				const message = this.promptService.handleIncomingMessage(msg.content);
				this.addToConversationHistory(message);
				this.appendMessage(message.role, message.content);
			});
		});
	}

	public sendToServer(): void {
		const userMessage = this.inputText.nativeElement.value;
		const message = this.promptService.appendMessage("user", userMessage);
		this.addToConversationHistory(message);
		this.appendMessage(message.role, message.content);
		const compressedHistory = this.promptService.emitCompressedHistory(this.conversationHistory);
		this.socketService.emitMessage(compressedHistory);
	}

	private addToConversationHistory(message: Message): void {
		this.promptService.addToConversationHistory(this.conversationHistory, message);
	}

	private appendMessage(role: string, content: string): void {
		const message = this.promptService.appendMessage(role, content);
		this.messages.push(message);
	}

	copyCode(event: Event): void {
		const buttonElement = event.target as HTMLElement;
		const parentMessageDiv = buttonElement.closest('.message');
		if (parentMessageDiv) {
			const codeBlock = parentMessageDiv.querySelector('pre code');
			if (codeBlock) {
				const textArea = document.createElement('textarea');
				textArea.value = codeBlock.textContent || '';
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				console.log('Code copié avec succès !');
			}
		}
	}
}
