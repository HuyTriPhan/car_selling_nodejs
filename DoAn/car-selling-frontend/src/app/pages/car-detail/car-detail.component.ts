import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarService } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent implements OnInit, AfterViewInit {
  carId: string = '';
  car: any;
  relatedCars: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private carService: CarService, 
    private router: Router,
    private authService: AuthService 
  ) {}
  
  ngOnInit(): void {
    this.carId = this.route.snapshot.params['id'];
    this.loadCarInfo();
    this.loadRelatedCars(); 
  }
   
  ngAfterViewInit() {
    if (typeof window !== 'undefined' && typeof $ !== 'undefined') {
      setTimeout(() => {
        if ($('.related-carousel').length) {
          $('.related-carousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            dots: false,
            autoplay: true,
            smartSpeed: 1000,
            navText: [
              '<i class="fa fa-angle-left custom-nav-icon"></i>',
              '<i class="fa fa-angle-right custom-nav-icon"></i>'
            ],
            responsive: {
              0: { items: 1 },
              768: { items: 2 },
              992: { items: 3 }
            }
          });
        }
      }, 100);
    }
  }  

  loadCarDetail(): void {
    // Sử dụng phương thức public để lấy chi tiết xe dành cho user
    this.carService.getCarDetailPublic(this.carId).subscribe({
      next: (data) => {
        this.car = data;
      },
      error: (err) => {
        console.error('Lỗi lấy chi tiết xe:', err);
      }
    });
  }

  loadCarInfo(): void {
    this.carService.getCarDetailPublic(this.carId).subscribe({
      next: (data) => {
        this.car = data;
      },
      error: (err) => {
        console.error('Lỗi lấy chi tiết xe:', err);
      }
    });
  }

  loadRelatedCars(): void {
    // Lấy danh sách xe public, sau đó lọc bỏ xe hiện tại nếu cần
    this.carService.getAllCarsPublic().subscribe({
      next: (data) => {
        this.relatedCars = data.filter((item: any) => item._id !== this.carId);
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách xe liên quan:', err);
      }
    });
  }

  goToDetail(id: string): void {
    this.router.navigate(['/detail', id]); 
  }

  goToCheckout(carId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout', carId]);
    } else {
      this.router.navigate(['/login']);
    }
  }
     
}
