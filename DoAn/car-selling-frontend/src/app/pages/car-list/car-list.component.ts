import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CarService } from '../../services/car.service';
import { CurrencyVndPipe } from '../../pipes/currency-vnd.pipe';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule,CurrencyVndPipe],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  filteredCars: any[] = [];
  displayedItems: number = 6;  // Giới hạn ban đầu là 6 sản phẩm khi không tìm kiếm

  constructor(private carService: CarService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fetchCars(params);
    });
  }

  fetchCars(params: any): void {
    console.log('Query params:', params);  // Log tham số
    this.carService.getAllCarsPublic().subscribe({
      next: (data) => {
        console.log('Cars data received:', data); // Log dữ liệu xe nhận được
        this.cars = data;
        this.filteredCars = this.applyFilters(data, params);

        // Kiểm tra nếu có tham số tìm kiếm, thì hiển thị tất cả xe tìm được
        if (params.name || params.modelLine || params.seats || params.priceRange) {
          this.displayedItems = this.filteredCars.length; // Hiển thị tất cả các sản phẩm
        }
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách xe:', err);
      }
    });
  }

  applyFilters(data: any[], filters: any): any[] {
    return data.filter(car => {
      const matchName = !filters.name || car.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchModel = !filters.modelLine || car.modelLine?.name.toLowerCase().includes(filters.modelLine.toLowerCase());
      const matchSeats = !filters.seats || car.seatCount === +filters.seats;
      const matchPrice = !filters.priceRange || car.price <= +filters.priceRange;
      return matchName && matchModel && matchSeats && matchPrice;
    });
  }

  goToDetail(id: string): void {
    // Điều hướng đến trang chi tiết của xe
    this.router.navigate(['/detail', id]);
  }

  loadMore(): void {
    // Hiển thị thêm xe
    this.displayedItems += 6;
  }
}
