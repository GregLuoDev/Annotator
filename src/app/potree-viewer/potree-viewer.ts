import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  Input,
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

@Component({
  selector: 'app-potree-viewer',
  templateUrl: './potree-viewer.html',
  styleUrls: ['./potree-viewer.css'],
})
export class PotreeViewer implements AfterViewInit, OnInit {
  @ViewChild('viewerContainer', { static: true }) container!: ElementRef;
  @Output() openPopup = new EventEmitter<Vector3>();
  @Input() scene?: Scene;

  ngOnInit(): void {
    // @ts-ignore
    this.raycaster.params.Points.threshold = 1e-2;

    const container = this.container.nativeElement;
    this.initialize(container);
  }

  ngAfterViewInit() {
    this.load('cloud.js', 'assets/pointclouds/lion_takanawa/')
      .then((pco) => {
        // Make the lion shows up at the center of the screen.
        pco.translateX(-1);
        pco.rotateX(-Math.PI / 2);

        // The point cloud octree already comes with a material which
        // can be customized directly. Here we just set the size of the
        // points.
        pco.material.size = 1.0;
      })
      .catch((err) => console.error(err));
  }

  private targetEl: HTMLElement | undefined;
  /**
   * The ThreeJS renderer used to render the scene.
   */
  private renderer = new WebGLRenderer();
  /**
   * Our scene which will contain the point cloud.
   */

  /**
   * The camera used to view the scene.
   */
  private camera = new PerspectiveCamera(45, NaN, 0.1, 1000);
  /**
   * Controls which update the position of the camera.
   */
  private cameraControls = new CameraControls(this.camera);
  /**
   * Out potree instance which handles updating point clouds, keeps track of loaded nodes, etc.
   */
  private potree = new Potree();
  /**
   * Array of point clouds which are in the scene and need to be updated.
   */
  private pointClouds: PointCloudOctree[] = [];
  /**
   * The time (milliseconds) when `loop()` was last called.
   */
  private prevTime: number | undefined;
  /**
   * requestAnimationFrame handle we can use to cancel the viewer loop.
   */
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

  /**
   * Updates the point clouds, cameras or any other objects which are in the scene.
   *
   * @param dt
   *    The time, in milliseconds, since the last update.
   */
  update(dt: number): void {
    // Alternatively, you could use Three's OrbitControls or any other
    // camera control system.
    this.cameraControls.update(dt);

    // This is where most of the potree magic happens. It updates the
    // visiblily of the octree nodes based on the camera frustum and it
    // triggers any loads/unloads which are necessary to keep the number
    // of visible points in check.
    this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer);
  }

  /**
   * Renders the scene into the canvas.
   */
  render(): void {
    this.renderer.clear();
    if (this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * The main loop of the viewer, called at 60FPS, if possible.
   */
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

  /**
   * Triggered anytime the window gets resized.
   */
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

  onClick = (event: any) => {
    if (!this.targetEl || !this.scene) {
      return;
    }
    const mouseNdc = new Vector2();
    const rect = this.targetEl.getBoundingClientRect();
    mouseNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(mouseNdc, this.camera);

    const intersects = this.raycaster.intersectObject(this.scene, true);

    if (intersects.length > 0) {
      const geometry = new SphereGeometry(0.2, 32, 32);
      const material = new MeshBasicMaterial({ color: Math.random() * 0xaa4444 });
      const sphere = new Mesh(geometry, material);

      const hit: Intersection<Object3D<Object3DEventMap>> = intersects[0];
      this.openPopup.emit(hit.point);

      sphere.position.copy(hit.point);
      this.scene.add(sphere);

      const position = [hit.point.x, hit.point.y, hit.point.z];
      const cameraPosition = [
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
      ];
      const cameraTarget = [
        this.cameraControls.target.x,
        this.cameraControls.target.y,
        this.cameraControls.target.z,
      ];
      console.log('position : ', position);
      console.log('cameraPosition : ', cameraPosition);
      console.log('cameraTarget : ', cameraTarget);

      /*
      let aAbout1 = new Annotation({
        position: [590043.63, 231490.79, 740.78],
        title: elTitle,
        cameraPosition: [590105.53, 231541.63, 782.05],
        cameraTarget: [590043.63, 231488.79, 740.78],
        description: `<ul><li>Click on the annotation label to move a predefined view.</li> 
						<li>Click on the icon to execute the specified action.</li>
						In this case, the action will bring you to another scene and point cloud.</ul>`,
      });

      this.scene.annotations.add(aAbout1);*/
    }
  };
}
