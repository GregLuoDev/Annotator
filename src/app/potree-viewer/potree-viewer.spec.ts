import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { PotreeViewer } from './potree-viewer';
import { AnnotationsService } from '../services/annotations';
import { Scene, Vector3, Object3D } from 'three';

/* ---------------- MOCKS ---------------- */

class MockAnnotationsService {
  scene = new Scene();
  clickableAnnotations: Object3D[] = [];

  addAnnotationOnScene = () => {};
}

describe('PotreeViewer', () => {
  let component: PotreeViewer;
  let fixture: ComponentFixture<PotreeViewer>;
  let annotationService: MockAnnotationsService;

  beforeEach(async () => {
    // await TestBed.configureTestingModule({
    //   declarations: [PotreeViewer],
    //   providers: [{ provide: AnnotationsService, useClass: MockAnnotationsService }],
    // }).compileComponents();
    // fixture = TestBed.createComponent(PotreeViewer);
    // component = fixture.componentInstance;
    // annotationService = TestBed.inject(AnnotationsService) as unknown as MockAnnotationsService;
    // // Mock container element
    // const div = document.createElement('div');
    // div.style.width = '800px';
    // div.style.height = '600px';
    // component.container = new ElementRef(div);
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
