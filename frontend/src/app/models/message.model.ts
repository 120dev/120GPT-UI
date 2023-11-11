import { ElementRef } from '@angular/core';

export interface Message {
	role: string;
	content: string;
	elementRef?: ElementRef;
	isCode?: boolean;
}