import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoot } from './app';
import { AnnotationsService } from './services/annotations';
import { ChangeDetectorRef } from '@angular/core';
import { PotreeViewer } from './potree-viewer/potree-viewer';
import { InputPopup } from './input-popup/input-popup';
import { DeletionPopup } from './deletion-popup/deletion-popup';

class MockAnnotationsService {
  scene: any = { children: [], getObjectById: () => {} };
  getAnnotations = () => {};
  addAnnotation = () => {};
  addAnnotationOnScene = () => {};
  deleteAnnotation = () => {};
}

class MockChangeDetectorRef {
  detectChanges = jasmine.createSpy('detectChanges');
}

describe('App', () => {
  let component: AppRoot;
  let fixture: ComponentFixture<AppRoot>;
  let annotationService: MockAnnotationsService;
  let cdr: MockChangeDetectorRef;

  beforeEach(async () => {
    // await TestBed.configureTestingModule({
    //   providers: [
    //     { provide: AnnotationsService, useClass: MockAnnotationsService },
    //     { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
    //   ],
    //   imports: [AppRoot, PotreeViewer, InputPopup, DeletionPopup],
    // }).compileComponents();
    // fixture = TestBed.createComponent(AppRoot);
    // component = fixture.componentInstance;
    // annotationService = TestBed.inject(AnnotationsService) as unknown as MockAnnotationsService;
    // cdr = TestBed.inject(ChangeDetectorRef) as unknown as MockChangeDetectorRef;
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
