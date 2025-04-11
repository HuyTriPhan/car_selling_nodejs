import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { CarService } from '../../services/car.service';
import { OrderService } from '../../services/order.service';
import { CurrencyVndPipe } from '../../pipes/currency-vnd.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UpperCasePipe, CurrencyVndPipe, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  carId = '';
  car: any;
  totalAmount = 0;
  discountPercent = 0;
  discountAmount = 0;
  promoCode = '';
  promoMessage = '';
  promoValid = false;

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
    this.carId = this.route.snapshot.params['id'];
    if (this.carId) {
      this.loadCarInfo();
    } else {
      console.error('Không tìm thấy thông tin xe.');
    }
    this.initForm();
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerAddress: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      method: ['', Validators.required],
      promoCode: [''] // ✅ thêm promoCode vào FormGroup
    });
  }

  loadCarInfo() {
    this.carService.getCarDetailPublic(this.carId).subscribe({
      next: (car) => {
        console.log('Car loaded:', car);
        this.car = car;
        this.totalAmount = car.price;
      },
      error: (err) => {
        console.error('Không thể load thông tin xe:', err);
        alert('Không thể load thông tin xe!');
      }
    });
  }
  

  applyPromotion() {
    const code = this.checkoutForm.value.promoCode?.trim();
    if (!code) return;

    this.orderService.checkPromotion(code).subscribe({
      next: (promo) => {
        const now = new Date();
        const expired = new Date(promo.expiredAt);

        if (!promo.active) {
          this.promoMessage = 'Mã đã bị vô hiệu hóa!';
          this.promoValid = false;
        } else if (expired < now) {
          this.promoMessage = 'Mã đã hết hạn!';
          this.promoValid = false;
        } else {
          this.promoMessage = `Áp dụng thành công: Giảm ${promo.discount}%`;
          this.promoValid = true;
          this.promoCode = code; 
          this.discountPercent = promo.discount;
          this.discountAmount = this.car.price * promo.discount / 100;
          this.totalAmount = this.car.price - this.discountAmount;
        }
      },
      error: () => {
        this.promoMessage = 'Mã không hợp lệ!';
        this.promoValid = false;
      }
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid || !this.carId || !this.totalAmount) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const orderData = {
      car: this.carId,
      customerName: this.checkoutForm.value.customerName,
      customerPhone: this.checkoutForm.value.customerPhone,
      customerAddress: this.checkoutForm.value.customerAddress,
      customerEmail: this.checkoutForm.value.email,
      method: this.checkoutForm.value.method,
      totalAmount: this.totalAmount,
      promotionCode: this.promoValid ? this.promoCode : null,
      discountAmount: this.promoValid ? this.discountAmount : 0
    };

    console.log('Đơn hàng chuẩn bị gửi:', orderData);

    this.orderService.createOrder(orderData).subscribe({
      next: (res: any) => {
        this.router.navigate(['/checkout-success', res._id]);
        if (this.promoValid && this.promoCode) {
          this.orderService.getPromotionByCode(this.promoCode).subscribe(promo => {
            this.orderService.markPromotionUsed(promo._id).subscribe();
          });
        }
        
      },
      error: (err) => {
        console.error('Lỗi tạo đơn hàng:', err);
        alert(err?.error?.message || 'Không thể tạo đơn hàng');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/detail', this.carId]);
  }
}
