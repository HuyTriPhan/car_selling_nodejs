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
}
