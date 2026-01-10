import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnotationsService {
  private apiUrl = 'https://bbujl0wc39.execute-api.ap-southeast-2.amazonaws.com/PROD/annotations';

  constructor(private http: HttpClient) {}

  /** GET data */
  getAnnotations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** POST data */
  addAnnotation(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, { httpMethod: 'POST', body: payload });
  }
}
