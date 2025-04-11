import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../../../services/car.service';
import { CurrencyVndPipe } from '../../../../pipes/currency-vnd.pipe';


@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyVndPipe],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.fetchCars();
  }

  fetchCars() {
    this.carService.getAllCars().subscribe(data => this.cars = data);
  }

  deleteCar(id: string) {
    if (confirm('Bạn có chắc muốn xoá xe này không?')) {
      this.carService.deleteCar(id).subscribe(() => this.fetchCars());
    }
  }

  // ✅ Lọc xe theo tên
  get filteredCars() {
    if (!this.searchTerm.trim()) return this.cars;
    return this.cars.filter(car =>
      car.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // ✅ Áp dụng phân trang lên danh sách đã lọc
  get pagedCars() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCars.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCars.length / this.pageSize);
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

