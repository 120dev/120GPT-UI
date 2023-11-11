import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	title = '120GPTAngular';

	ngAfterViewInit(): void {
	}



}
