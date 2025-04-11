import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PromotionService } from '../../../../services/Promotion.Service';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent implements OnInit {
  promotions: any[] = [];
  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private promotionService: PromotionService) {}

  ngOnInit(): void {
    this.fetchPromotions();
  }

  fetchPromotions() {
    this.promotionService.getAllPromotions().subscribe(data => this.promotions = data);
  }

  deletePromo(id: string) {
    if (confirm('Xoá mã khuyến mãi này?')) {
      this.promotionService.deletePromotion(id).subscribe(() => this.fetchPromotions());
    }
  }

  // ✅ Lọc theo tên khuyến mãi
  get filteredPromotions() {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.promotions
      : this.promotions.filter(promo =>
          promo.name?.toLowerCase().includes(term)
        );
  }

  get pagedPromotions() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPromotions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPromotions.length / this.pageSize);
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
