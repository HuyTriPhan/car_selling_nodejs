import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { RouterModule } from '@angular/router';
import { CurrencyVndPipe } from '../../../pipes/currency-vnd.pipe';

@Component({
  selector: 'app-user-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyVndPipe],
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.scss']
})
export class UserOrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private orderService: OrderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.orderService.getMyOrders().subscribe({
        next: (data) => {
          // Chỉ giữ lại các đơn KHÔNG bị huỷ
          this.orders = data.filter(order => order.status !== 'cancelled');
        },
        error: (err) => console.error('Lỗi lấy lịch sử đơn hàng:', err)
      });
    }
  }
}
