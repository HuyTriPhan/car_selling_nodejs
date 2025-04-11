import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, NgIf, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
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

  minPrice: number = 1000000000;
  maxPrice: number = 10000000000;
  priceRange: number = 1000000000;
  modelLines: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private carService: CarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ Gán lại giá trị từ localStorage ngay lập tức khi component khởi tạo
      const user = this.auth.getUser();
      if (user) {
        this.isLoggedIn = this.auth.isLoggedIn();
        this.userName = user?.username || user?.name || '';
        this.userRole = user?.role || '';
      }

      // ✅ Gán lại nếu có thay đổi router
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          const user = this.auth.getUser();
          this.isLoggedIn = this.auth.isLoggedIn();
          this.userName = user?.username || user?.name || '';
          this.userRole = user?.role || '';
        });

      // ✅ Gọi API lấy dòng xe
      this.carService.getAllModelLines().subscribe({
        next: (data) => (this.modelLines = data),
        error: (err) => console.error('Lỗi lấy dòng xe:', err),
      });
    }
  }

  updatePriceRange(): void {
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
        priceRange: formData.priceRange,
      },
    });
  }
}
