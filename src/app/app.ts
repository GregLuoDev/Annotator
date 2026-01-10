import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PotreeViewer } from './potree-viewer/potree-viewer';

// Declare Potree as a global variable
declare var Potree: any;
declare var THREE: any;

@Component({
  selector: 'app-root',
  imports: [PotreeViewer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Annotator1');

  constructor() {}
}
