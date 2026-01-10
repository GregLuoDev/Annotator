import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  Input,
  signal,
  effect,
  inject,
} from '@angular/core';
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Raycaster,
  Vector2,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Intersection,
  Object3D,
  Object3DEventMap,
} from 'three';
import { PointCloudOctree, Potree } from '@pnext/three-loader';
import { CameraControls } from './camera-controls';
import { IAnnotation } from '../services/types';
import { AnnotationsService } from '../services/annotations';

@Component({
  selector: 'app-potree-viewer',
  templateUrl: './potree-viewer.html',
  styleUrls: ['./potree-viewer.css'],
})
export class PotreeViewer implements AfterViewInit, OnInit {
  @ViewChild('viewerContainer', { static: true }) container!: ElementRef;
  @Output() openInputPopup = new EventEmitter<Vector3>();
  @Output() openDeletionPopup = new EventEmitter<string>();

  readonly annotationService = inject(AnnotationsService);
  scene?: Scene = this.annotationService.scene;

  private _annotations = signal<IAnnotation[]>([]);
  @Input()
  set annotations(value: IAnnotation[]) {
    this._annotations.set(value);
  }
  get annotations() {
    return this._annotations();
  }

  constructor() {
    effect(() => {
      this._annotations().forEach((annotation) => {
        const text = annotation.text;
        const hitPoint = { x: annotation.x, y: annotation.y, z: annotation.z } as Vector3;
        this.annotationService.addAnnotationOnScene(text, hitPoint);
      });
    });
  }

  ngOnInit(): void {
    this.raycaster.params.Points.threshold = 1e-2;

    const container = this.container.nativeElement;
    this.initialize(container);
  }

  ngAfterViewInit() {
    this.load('cloud.js', 'assets/pointclouds/lion_takanawa/')
      .then((pco) => {
        pco.translateX(-1);
        pco.rotateX(-Math.PI / 2);
        pco.material.size = 1.0;
      })
      .catch((err) => console.error(err));
  }

  private targetEl: HTMLElement | undefined;
  private renderer = new WebGLRenderer();
  private camera = new PerspectiveCamera(45, NaN, 0.1, 1000);
  private cameraControls = new CameraControls(this.camera);
  private potree = new Potree();
  private pointClouds: PointCloudOctree[] = [];
  private prevTime: number | undefined;
  private reqAnimationFrameHandle: number | undefined;

  initialize(targetEl: HTMLElement): void {
    if (this.targetEl || !targetEl) {
      return;
    }

    this.targetEl = targetEl;
    targetEl.appendChild(this.renderer.domElement);

    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('click', this.onClick);

    requestAnimationFrame(this.loop);
  }

  destroy(): void {
    if (!this.targetEl) {
      return;
    }
    this.targetEl.removeChild(this.renderer.domElement);

    this.targetEl = undefined;
    window.removeEventListener('resize', this.resize);

    // TODO: clean point clouds or other objects added to the scene.

    if (this.reqAnimationFrameHandle !== undefined) {
      cancelAnimationFrame(this.reqAnimationFrameHandle);
    }
  }

  load(fileName: string, baseUrl: string): Promise<PointCloudOctree> {
    return this.potree
      .loadPointCloud(
        // The file name of the point cloud which is to be loaded.
        fileName,
        // Given the relative URL of a file, should return a full URL.
        (url) => `${baseUrl}${url}`
      )
      .then((pco: PointCloudOctree) => {
        // Add the point cloud to the scene and to our list of
        // point clouds. We will pass this list of point clouds to
        // potree to tell it to update them.
        this.scene?.add(pco);
        this.pointClouds.push(pco);

        return pco;
      });
  }

  update(dt: number): void {
    this.cameraControls.update(dt);

    this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer);
  }

  render(): void {
    this.renderer.clear();
    if (this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  loop = (time: number): void => {
    this.reqAnimationFrameHandle = requestAnimationFrame(this.loop);

    const prevTime = this.prevTime;
    this.prevTime = time;
    if (prevTime === undefined) {
      return;
    }

    this.update(time - prevTime);
    this.render();
  };

  resize = () => {
    if (!this.targetEl) {
      return;
    }
    const { width, height } = this.targetEl.getBoundingClientRect();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private raycaster = new Raycaster();

  onClick = (event: MouseEvent) => {
    if (!this.targetEl || !this.scene) {
      return;
    }

    const normalized = new Vector2();
    const rect = this.targetEl.getBoundingClientRect();
    normalized.set((event.clientX / rect.width) * 2 - 1, -(event.clientY / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(normalized, this.camera);

    const intersectAnnotations = this.raycaster.intersectObjects(
      this.annotationService.clickableAnnotations,
      true
    );
    if (intersectAnnotations.length > 0) {
      const obj = intersectAnnotations[0].object;
      console.log('Clicked object:', obj);

      // Open popup (can be a DOM modal or alert for demo)
      alert(`You clicked annotation: ${(obj.userData as any).text}`);
      this.openDeletionPopup.emit((obj.userData as any).text);
    } else {
      const intersects = this.raycaster.intersectObject(this.scene, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        this.openInputPopup.emit(hit.point);
      }
    }
  };
}
