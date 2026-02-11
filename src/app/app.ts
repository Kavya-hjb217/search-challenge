import { Component } from '@angular/core';

import { SearchBarComponent } from './components/search-bar/search-bar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ SearchBarComponent],
  template:`<app-search-bar></app-search-bar>`,
  styleUrl: './app.css'
})
export class App {
  
}
