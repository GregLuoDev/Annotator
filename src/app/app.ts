import { AfterViewInit, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { PotreeViewer } from './potree-viewer/potree-viewer';
import { InputPopup } from './input-popup/input-popup';
import {
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from 'three';
import { AnnotationsService } from './services/annotations';
import { IAnnotation } from './services/types';

@Component({
  selector: 'app-root',
  imports: [PotreeViewer, InputPopup],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected readonly title = signal('Annotator1');
  showPopup = false;
  scene = new Scene();
  hitPoint?: Vector3;

  readonly annotationService = inject(AnnotationsService);
  annotations: IAnnotation[] = [];
  cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.annotationService.getAnnotations().subscribe((data: any) => {
      this.annotations = JSON.parse(data.body);
      this.cdr.detectChanges();
    });
  }

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

      const label = this.createTextLabel(value);
      label.position.set(0, 0.35, 0);
      sphere.add(label);

      this.scene.add(sphere);

      const text = value;
      const x = this.hitPoint.x;
      const y = this.hitPoint.y;
      const z = this.hitPoint.z;
      this.annotationService.addAnnotation({ text, x, y, z }).subscribe();
    }
  }

  createTextLabel(text: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = 256;
    canvas.height = 128;

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new CanvasTexture(canvas);
    const material = new SpriteMaterial({ map: texture });
    const sprite = new Sprite(material);

    sprite.scale.set(1, 0.5, 1);
    return sprite;
  }
}
