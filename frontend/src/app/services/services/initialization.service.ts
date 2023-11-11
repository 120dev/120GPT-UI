import {Injectable} from '@angular/core';
import {marked} from 'marked';
import {markedHighlight} from 'marked-highlight';

declare var hljs: any;
declare var ClipboardJS: any;

@Injectable({
	providedIn: 'root'
})
export class InitializationService {

	constructor() {
	}

	initializeMarked(): void {
		marked.use(markedHighlight({
			highlight: (code: string, language: string) => {
				const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
				return hljs.highlight(code, {language: validLanguage}).value;
			}
		}));
	}

	initializeClipboard(): void {
		new ClipboardJS('.copy-btn', {
			target: (trigger: HTMLElement) => {
				return trigger.closest('.message')?.querySelector('pre code') || trigger;
			}
		}).on('success', (e: any) => {
			console.dir('Code copié avec succès !');
			e.clearSelection();
		});
	}

}

