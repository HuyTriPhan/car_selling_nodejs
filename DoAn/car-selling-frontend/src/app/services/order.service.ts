import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
