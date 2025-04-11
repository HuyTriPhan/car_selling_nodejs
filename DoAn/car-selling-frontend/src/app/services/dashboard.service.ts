import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'; // ✅ Import AuthService để lấy token

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/dashboard';

  constructor(
    private http: HttpClient,
    private authService: AuthService // ✅ Inject vào
  ) {}

  getSummary() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<{
      totalUsers: number;
      totalOrders: number;
      totalRevenue: number;
      totalCars: number;
    }>(this.apiUrl, { headers });
  }
}
