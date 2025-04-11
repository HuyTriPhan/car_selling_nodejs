import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { CurrencyVndPipe } from '../../pipes/currency-vnd.pipe';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule, UpperCasePipe,CurrencyVndPipe],
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  order: any;
  orderId: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['orderId'];
    console.log("Order ID từ route:", this.orderId); 
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để xem thông tin đơn hàng');
      this.router.navigate(['/login']);
      return;
    }
  
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (data: any) => {
          console.log("Order trả về:", data);
          this.order = data;
        },
        error: (err: any) => {
          console.error('Lỗi lấy thông tin đơn hàng:', err);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/']);
          }
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }
  
  
  payWithVNPAY() {
    if (!this.order || !this.order._id || !this.order.totalAmount) {
      alert('Thông tin đơn hàng không hợp lệ!');
      return;
    }
  
    // Gửi yêu cầu tạo thanh toán đến backend
    this.orderService.createVnpayPayment({
      orderId: this.order._id,
      amount: this.order.totalAmount
    }).subscribe({
      next: (res: any) => {
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl; // Redirect sang VNPay
        } else {
          alert('Không lấy được đường dẫn thanh toán!');
        }
      },
      error: (err) => {
        console.error('Lỗi thanh toán:', err);
        alert('Không thể tạo thanh toán!');
      }
    });
  }
  
}


