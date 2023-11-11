import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare var io: any;

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	private socket: any;

	constructor() { }

	public initializeSocket(): void {
		this.socket = io.connect('http://192.168.119.130.:3000');
	}

	public onMessage(): Observable<string> {
		return new Observable(observer => {
			this.socket.on('message', (data: string) => {
				observer.next(data);
			});
		});
	}

	public emitMessage(compressedHistory: string): void {
		this.socket.emit('message', compressedHistory);
	}

	public disconnectSocket(): void {
		if (this.socket) {
			this.socket.disconnect();
		}
	}
}