import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Gợi ý: interface Promotion nên được định nghĩa ở file riêng (promotion.model.ts)
// Nhưng bạn không cần copy nó ở đây theo yêu cầu

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private API = 'http://localhost:5000/api/promotions';

  constructor(private http: HttpClient) {}

  // Lấy tất cả khuyến mãi
  getAllPromotions(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  // Lấy khuyến mãi theo ID
  getPromotionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  // Lấy khuyến mãi theo mã code
  getPromotionByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.API}/code/${code}`);
  }

  // Thêm khuyến mãi (cần xác thực)
  createPromotion(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(this.API, data, { headers });
  }

  // Cập nhật khuyến mãi (cần xác thực)
  updatePromotion(id: string, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.API}/${id}`, data, { headers });
  }

  // Xoá khuyến mãi (cần xác thực)
  deletePromotion(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.API}/${id}`, { headers });
  }

  // Đánh dấu mã khuyến mãi đã sử dụng (cần xác thực)
  markPromotionUsed(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.API}/${id}/mark-used`, {}, { headers });
  }
}
