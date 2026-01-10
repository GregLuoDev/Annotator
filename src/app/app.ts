import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PotreeViewer } from './potree-viewer/potree-viewer';
import { InputPopup } from './input-popup/input-popup';
import {
  Intersection,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Object3DEventMap,
  Scene,
  SphereGeometry,
  Vector3,
  Vector3Like,
} from 'three';

// Declare Potree as a global variable
declare var Potree: any;
declare var THREE: any;

@Component({
  selector: 'app-root',
  imports: [PotreeViewer, InputPopup],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Annotator1');
  showPopup = false;
  scene = new Scene();
  hitPoint?: Vector3;

  constructor() {}

  openPopup(hitPoint: Vector3) {
    this.showPopup = true;
    this.hitPoint = hitPoint;
  }

  onPopupClosed(value: string | null) {
    this.showPopup = false;

    if (value && this.hitPoint) {
      console.log('User input:', value);

      const geometry = new SphereGeometry(0.2, 32, 32);
      const material = new MeshBasicMaterial({ color: Math.random() * 0xaa4444 });
      const sphere = new Mesh(geometry, material);

      sphere.position.copy(this.hitPoint);
      this.scene.add(sphere);
    } else {
      console.log('Popup cancelled');
    }
  }
}
