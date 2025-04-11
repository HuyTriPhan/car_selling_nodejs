import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const API_ORDERS = 'http://localhost:5000/api/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Hàm lấy thông tin đơn hàng
  getOrderById(id: string): Observable<any> {
    let headers = {};
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = { Authorization: `Bearer ${token}` };
      }
    }
    return this.http.get(`${API_ORDERS}/${id}`, { headers });
  }

  // GỘP hàm createOrder từ CheckoutService
  createOrder(orderData: any): Observable<any> {
    let headers = {};
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = { Authorization: `Bearer ${token}` };
      }
    }
    return this.http.post(API_ORDERS, orderData, { headers });
  }

  checkPromotion(code: string): Observable<any> {
    return this.http.get(`http://localhost:5000/api/promotions/code/${code}`);
  }
  
  createVnpayPayment(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post('http://localhost:5000/api/vnpay/create_payment', data, { headers });
  }

  getAllOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>('http://localhost:5000/api/orders', { headers });
  }
  
  deleteOrder(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${API_ORDERS}/${id}`, { headers });
  }
  getPromotionByCode(code: string): Observable<any> {
    return this.http.get(`http://localhost:5000/api/promotions/code/${code}`);
  }
  
  markPromotionUsed(promoId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`http://localhost:5000/api/promotions/${promoId}/mark-used`, {}, { headers });
  }
  getMyOrders(): Observable<any[]> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token') || '';
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get<any[]>(`http://localhost:5000/api/orders/my`, { headers });
    } else {
      return of([]); // SSR fallback
    }
  }
  
}
