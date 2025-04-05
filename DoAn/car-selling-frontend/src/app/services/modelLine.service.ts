import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModellineService {
  private API = 'http://localhost:5000/api/admin/modellines';

  constructor(private http: HttpClient) {}

  getAllModelLines(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  getModelLineById(id: string): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  addModelLine(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(this.API, data, { headers });
  }

  updateModelLine(id: string, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.API}/${id}`, data, { headers });
  }

  deleteModelLine(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.API}/${id}`, { headers });
  }
}
