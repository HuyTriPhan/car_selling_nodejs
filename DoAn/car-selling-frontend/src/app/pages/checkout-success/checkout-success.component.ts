import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, UpperCasePipe],
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  order: any;
  orderId: string = '';

  constructor(private route: ActivatedRoute, private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['orderId'];
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (data: any) => {
          console.log('Order data:', data); // Kiểm tra console
          this.order = data; // Sẽ chứa order.car, order.payment.method, ...
        },
        error: (err: any) => {
          console.error('Lỗi lấy thông tin đơn hàng:', err);
        }
      });
    } else {
      console.error('Không tìm thấy orderId trong URL');
    }
  }
  
}
