import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarService {
  private API_ADMIN = 'http://localhost:5000/api/admin/cars';
  private API_PUBLIC = 'http://localhost:5000/api/carlist'; 
  private API_PUBLIC_DETAIL = 'http://localhost:5000/api/detailcar'; 

  constructor(private http: HttpClient) {}

  // Dành cho admin
  getAllCars(): Observable<any[]> {
    return this.http.get<any[]>(this.API_ADMIN);
  }

  getCarById(id: string): Observable<any> {
    return this.http.get(`${this.API_ADMIN}/${id}`);
  }

  addCar(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(this.API_ADMIN, data, { headers });
  }

  updateCar(id: string, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.API_ADMIN}/${id}`, data, { headers });
  }

  deleteCar(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.API_ADMIN}/${id}`, { headers });
  }

  // Dành cho user (không cần token)
  getAllCarsPublic(): Observable<any[]> {
    return this.http.get<any[]>(this.API_PUBLIC);
  }

  getCarDetailPublic(id: string): Observable<any> {
    return this.http.get(`${this.API_PUBLIC_DETAIL}/${id}`);
  }

  getAllModelLines(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/modelLine');
  }
  
}
