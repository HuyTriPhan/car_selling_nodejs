// ✅ promotion-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PromotionService } from '../../../../services/Promotion.Service';

interface Promotion {
  name: string;
  discount: number;
  description: string;
  expiredAt: string;
  [key: string]: any;
}

@Component({
  selector: 'app-promotion-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './promotion-edit.component.html',
  styleUrls: ['./promotion-edit.component.scss']
})
export class PromotionEditComponent implements OnInit {
  promoForm!: FormGroup;
  promoId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.promoId = this.route.snapshot.params['id'];
    this.promotionService.getPromotionById(this.promoId).subscribe((promo) => {
      const data = promo as Promotion;
      this.promoForm = this.fb.group({
        name: [data.name, Validators.required],
        discount: [data.discount, [Validators.required, Validators.min(1), Validators.max(100)]],
        description: [data.description],
        expiredAt: [data.expiredAt, Validators.required]
      });
    });
  }

  onSubmit() {
    if (this.promoForm.valid) {
      this.promotionService.updatePromotion(this.promoId, this.promoForm.value).subscribe({
        next: () => this.router.navigate(['/admin/promotion']),
        error: (err) => console.error('Lỗi cập nhật khuyến mãi:', err)
      });
    }
  }
}
