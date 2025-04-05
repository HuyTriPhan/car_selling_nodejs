import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, UpperCasePipe, CurrencyPipe } from '@angular/common';
import { CarService } from '../../services/car.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UpperCasePipe, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  carId = '';
  car: any;
  totalAmount = 0;
  paymentMethods = [
    { value: 'visa', label: 'VISA', image: 'visa.png' },
    { value: 'mastercard', label: 'MasterCard', image: 'mastercard.png' },
    { value: 'jcb', label: 'JCB', image: 'jcb.jpg' },
    { value: 'momo', label: 'MoMo', image: 'momo.png' },
    { value: 'vnpay', label: 'VNPay', image: 'vnpay.jpg' },
    { value: 'zalopay', label: 'ZaloPay', image: 'zalopay.png' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private carService: CarService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy carId từ route parameters (ví dụ URL: /checkout/123)
    this.carId = this.route.snapshot.params['id'];
    if (this.carId) {
      this.loadCarInfo();
    } else {
      console.error('Không tìm thấy thông tin xe.');
    }
    this.initForm();
  }

  initForm() {
    // Khởi tạo form với các trường cần thiết. 
    // Lưu ý: Nếu backend mong đợi trường "carId" và "name", "phone", "address", bạn có thể đặt tên các trường theo cách bạn muốn và sau đó ánh xạ lại trong onSubmit().
    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerAddress: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Giá trị mặc định của phương thức thanh toán là 'vnpay'
      method: ['', Validators.required]
    });
  }

  loadCarInfo() {
    this.carService.getCarDetailPublic(this.carId).subscribe(car => {
      this.car = car;
      this.totalAmount = car.price;
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) return;
  
    const orderData = {
      car: this.carId,  // Gửi trường "car" thay vì "carId"
      customerName: this.checkoutForm.value.customerName,
      customerPhone: this.checkoutForm.value.customerPhone,
      customerAddress: this.checkoutForm.value.customerAddress,
      customerEmail: this.checkoutForm.value.email, // Đổi email thành customerEmail
      method: this.checkoutForm.value.method,          // Phương thức thanh toán (có giá trị mặc định 'vnpay')
      totalAmount: this.totalAmount                     // Sử dụng trường totalAmount
    };
  
    this.orderService.createOrder(orderData).subscribe({
      next: (res: any) => {
        // Điều hướng sang trang checkout-success với order id trả về từ backend
        this.router.navigate(['/checkout-success', res._id]);
      },
      error: (err) => {
        console.error('Lỗi tạo đơn hàng:', err);
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/detail', this.carId]);
  }
}
