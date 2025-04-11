// ✅ promotion-create.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PromotionService } from '../../../../services/Promotion.Service';

@Component({
  selector: 'app-promotion-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './promotion-create.component.html',
  styleUrls: ['./promotion-create.component.scss']
})
export class PromotionCreateComponent implements OnInit {
  promoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private promotionService: PromotionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.promoForm = this.fb.group({
      name: ['', Validators.required],
      discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      description: [''],
      expiredAt: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.promoForm.valid) {
      this.promotionService.createPromotion(this.promoForm.value).subscribe({
        next: () => this.router.navigate(['/admin/promotion']),
        error: (err) => console.error('Lỗi tạo khuyến mãi:', err)
      });
    }
  }
}