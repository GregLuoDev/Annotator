import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class AnnotationsService {
  private apiUrl = 'https://bbujl0wc39.execute-api.ap-southeast-2.amazonaws.com/PROD/annotations';
  scene = new Scene();

  constructor(private http: HttpClient) {}

  /** GET data */
  getAnnotations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** POST data */
  addAnnotation(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, { httpMethod: 'POST', body: payload });
  }

  addAnnotationOnScene(text: string, hitPoint: Vector3) {
    const geometry = new SphereGeometry(0.2, 32, 32);
    const material = new MeshBasicMaterial({ color: Math.random() * 0xaa4444 });
    const sphere = new Mesh(geometry, material);

    sphere.position.copy(hitPoint);

    const label = this.createTextLabel(text);
    label.position.set(0, 0.35, 0);
    sphere.add(label);

    this.scene.add(sphere);
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
