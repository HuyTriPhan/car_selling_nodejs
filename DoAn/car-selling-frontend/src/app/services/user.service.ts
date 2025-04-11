import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  // Lấy danh sách user từ MongoDB
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  // Phương thức khóa/mở khóa tài khoản: gọi PUT đến /api/users/lock/:id
  lockUser(id: string, lock: boolean): Observable<any> {
    // Gửi dữ liệu lock: true để khóa, false để mở khóa
    return this.http.put(`${this.API}/lock/${id}`, { lock });
  }
  getProfile(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.API}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  
  updateProfile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${this.API}/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  
  changePassword(data: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    return this.http.put(`${this.API}/password`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  
}
