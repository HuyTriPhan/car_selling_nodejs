import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CurrencyVndPipe } from '../../pipes/currency-vnd.pipe';

@Component({
  selector: 'app-checkout-invoice',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CurrencyVndPipe],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class CheckoutInvoiceComponent implements OnInit {
  orderId: string = '';
  order: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParams['orderId'];

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('Token hiện tại:', token);

      if (this.orderId && token) {
        this.fetchOrder(this.orderId);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  fetchOrder(id: string) {
    this.orderService.getOrderById(id).subscribe({
      next: (data: any) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi lấy đơn hàng:', err);
        this.router.navigate(['/']);
      }
    });
  }

  printInvoice() {
    const data = document.getElementById('invoice-content');
  
    if (data) {
      // Ẩn nút trước khi render canvas
      const btnGroup = data.querySelector('.btn-group') as HTMLElement;
      if (btnGroup) {
        btnGroup.style.display = 'none';
      }
  
      html2canvas(data).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${this.order?._id || 'order'}.pdf`);
  
        // Hiện lại nút sau khi in
        if (btnGroup) {
          btnGroup.style.display = 'flex';
        }
      });
    }
  }
  
}
