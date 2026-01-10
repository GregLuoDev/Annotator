import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { PotreeViewer } from './potree-viewer/potree-viewer';
import { InputPopup } from './input-popup/input-popup';
import { Vector3 } from 'three';
import { AnnotationsService } from './services/annotations';
import { IAnnotation } from './services/types';
import { DeletionPopup } from './deletion-popup/deletion-popup';

@Component({
  selector: 'app-root',
  imports: [PotreeViewer, InputPopup, DeletionPopup],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  showInputPopup = false;
  showDeletionPopup = false;

  hitPoint?: Vector3;
  deletionText: string = '';

  readonly annotationService = inject(AnnotationsService);
  annotations: IAnnotation[] = [];
  cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.annotationService.getAnnotations().subscribe((data: any) => {
      this.annotations = JSON.parse(data.body);
      this.cdr.detectChanges();
    });
  }

  openInputPopup(hitPoint: Vector3) {
    this.showInputPopup = true;
    this.hitPoint = hitPoint;
  }
  openDeletionPopup(text: string) {
    this.showDeletionPopup = true;
    this.deletionText = text;
  }

  onPopupClosed(value: string | null) {
    this.showInputPopup = false;

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

  onDeletionPopupClosed(value: boolean | null) {
    console.log('deletion value', value);
  }
}
