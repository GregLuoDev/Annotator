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
  showPopup = false;

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

      const text = value;
      const x = this.hitPoint.x;
      const y = this.hitPoint.y;
      const z = this.hitPoint.z;
      this.annotationService.addAnnotation({ text, x, y, z }).subscribe(() => {
        if (this.hitPoint) {
          this.annotationService.addAnnotationOnScene(value, this.hitPoint);
        }
      });
    }
  }
}
