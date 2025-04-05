import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CarService } from '../../services/car.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NgIf, FormsModule], 
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  userRole = '';

  // Điều chỉnh phạm vi giá từ 1 tỷ đến 10 tỷ
  minPrice: number = 1000000000;      
  maxPrice: number = 10000000000;  
  priceRange: number = 1000000000;  // Mức giá mặc định 1 tỷ
  modelLines: any[] = [];

  constructor(private auth: AuthService, private router: Router, private carService: CarService) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isLoggedIn = this.auth.isLoggedIn();
      const user = this.auth.getUser();
      this.userName = user?.username || user?.name || '';
      this.userRole = user?.role || '';
    });
    this.carService.getAllModelLines().subscribe({
      next: (data) => (this.modelLines = data),
      error: (err) => console.error('Lỗi lấy dòng xe:', err),
    });
  }

  updatePriceRange(): void {
    // Đảm bảo minPrice luôn nhỏ hơn maxPrice
    if (this.priceRange < this.minPrice) {
      this.priceRange = this.minPrice;
    }

    if (this.priceRange > this.maxPrice) {
      this.priceRange = this.maxPrice;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload(); 
    });
  }

  onSearch(formData: any) {
    this.router.navigate(['/list'], {
      queryParams: {
        name: formData.name,
        modelLine: formData.modelLine,
        seats: formData.seats,
        priceRange: formData.priceRange // Truyền giá trị priceRange vào query params
      }
    });
  }
}
