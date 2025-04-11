import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../services/order.service';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from '../../../../pipes/currency-vnd.pipe';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule,CurrencyVndPipe],
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getAllOrders().subscribe(data => this.orders = data);
  }

  deleteOrder(id: string) {
    if (confirm('Bạn có chắc muốn xoá đơn hàng này không?')) {
      this.orderService.deleteOrder(id).subscribe(() => this.fetchOrders());
    }
  }

  // ✅ Lọc theo tên khách hàng
  get filteredOrders() {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.orders
      : this.orders.filter(order =>
          order.customerName?.toLowerCase().includes(term)
        );
  }

  get pagedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
