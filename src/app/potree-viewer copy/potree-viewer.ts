import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

import * as THREE from 'three';
// import * as Potree from 'potree-core';
import { Potree, PotreeRenderer, PointCloudOctree } from 'potree-core';
import {
  AmbientLight,
  BoxGeometry,
  Euler,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

@Component({
  selector: 'app-potree-viewer',
  templateUrl: './potree-viewer.html',
  styleUrls: ['./potree-viewer.css'],
})
export class PotreeViewer implements AfterViewInit {
  @ViewChild('viewerContainer', { static: true }) container!: ElementRef;

  ngAfterViewInit() {
    this.initPotree();
  }

  async initPotree() {
    const container = this.container.nativeElement;

    // 1. Setup Three.js Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 2. Setup Scene and Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 10, 10);

    // 3. Initialize Potree
    const potree = new Potree();

    // Configure worker path - Point to where you copied the workers in assets
    // potree.workerPath = 'assets/workers/';

    // 4. Load Point Cloud
    // Replace with your cloud.js URL
    const pointcloudUrl = 'assets/pointclouds/vol_total/cloud.js';

    const pco: PointCloudOctree = await potree.loadPointCloud(pointcloudUrl, '');
    scene.add(pco);
    pco.position.set(0, 0, 0);

    //  potree.loadPointCloud(pointcloudUrl, '').then((pco) => {
    //   scene.add(pco);
    //   pco.position.set(0, 0, 0);

    //   // Add custom rendering/controls here
    // });

    // 5. Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Update potree point clouds
      potree.updatePointClouds(scene.children as PointCloudOctree[], camera, renderer);
      renderer.render(scene, camera);
    };
    animate();
  }
}
