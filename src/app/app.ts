import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { PotreeViewer } from './potree-viewer/potree-viewer';
import { InputPopup } from './input-popup/input-popup';
import { Vector3 } from 'three';
import { AnnotationsService } from './services/annotations';
import { IAnnotation, IDeletedAnnotation } from './services/types';
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
  deletedAnnotation?: IDeletedAnnotation;

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
  openDeletionPopup(deletedAnnotation: string) {
    this.showDeletionPopup = true;
    this.deletedAnnotation = JSON.parse(deletedAnnotation);
  }

  onPopupClosed(inputtedText: string | null) {
    this.showInputPopup = false;

    if (inputtedText && this.hitPoint) {
      const text = inputtedText;
      const x = this.hitPoint.x;
      const y = this.hitPoint.y;
      const z = this.hitPoint.z;
      const id = crypto.randomUUID();
      this.annotationService.addAnnotation({ id, text, x, y, z }).subscribe(() => {
        if (this.hitPoint) {
          this.annotationService.addAnnotationOnScene(id, inputtedText, this.hitPoint);
        }
      });
    }
  }

  onDeletionPopupClosed(confirmed: boolean) {
    if (confirmed && this.deletedAnnotation) {
      this.annotationService.deleteAnnotation({ id: this.deletedAnnotation.id }).subscribe(() => {
        let deletedIds: number[] = [];
        this.annotationService.scene.children.forEach((c1) => {
          c1.children.forEach((c2) => {
            if (this.deletedAnnotation && c2.userData['id'] === this.deletedAnnotation.id) {
              deletedIds.push(c2.id);
              deletedIds.push(c1.id);
            }
          });
        });

        deletedIds.forEach((id) => {
          const foundObject = this.annotationService.scene.getObjectById(id);
          if (foundObject) {
            foundObject.removeFromParent();
          }
        });

        this.deletedAnnotation = undefined;
      });
    }

    this.showDeletionPopup = false;
  }
}
