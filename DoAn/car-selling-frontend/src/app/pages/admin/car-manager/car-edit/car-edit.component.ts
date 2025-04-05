import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarService } from '../../../../services/car.service';
import { ModellineService } from '../../../../services/modelLine.service';

@Component({
  selector: 'app-car-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.scss']
})
export class CarEditComponent implements OnInit {
  carForm!: FormGroup;
  carId!: string;
  modelLines: any[] = [];
  fileToUpload: File | null = null; // Dùng để lưu file mới được chọn
  existingImage: string = ''; // Lưu tên ảnh hiện có

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private carService: CarService,
    private modellineService: ModellineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy danh sách dòng xe để hiển thị dropdown
    this.modellineService.getAllModelLines().subscribe(lines => {
      this.modelLines = lines;
    });

    // Lấy ID xe từ route và load dữ liệu xe
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.carId = id;
        this.loadCarData();
      }
    });
  }

  loadCarData(): void {
    this.carService.getCarById(this.carId).subscribe(car => {
      // Khởi tạo form với dữ liệu xe
      this.carForm = this.fb.group({
        name: [car.name, Validators.required],
        modelLine: [car.modelLine, Validators.required],
        price: [car.price, Validators.required],
        year: [car.year],
        origin: [car.origin],
        seatCount: [car.seatCount],
        description: [car.description],
      });
      // Lưu lại tên ảnh hiện có
      this.existingImage = car.image;
    });
  }

  // Xử lý thay đổi file input (ảnh mới)
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.fileToUpload = target.files[0];
    }
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const formData = new FormData();
      formData.append('name', this.carForm.get('name')?.value);
      formData.append('modelLine', this.carForm.get('modelLine')?.value);
      formData.append('price', this.carForm.get('price')?.value);
      formData.append('year', this.carForm.get('year')?.value);
      formData.append('origin', this.carForm.get('origin')?.value);
      formData.append('seatCount', this.carForm.get('seatCount')?.value);
      formData.append('description', this.carForm.get('description')?.value);
      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload);
      }
      
      // Gọi API cập nhật xe
      this.carService.updateCar(this.carId, formData).subscribe({
        next: () => {
          // Sau khi cập nhật thành công, chuyển về trang danh sách xe
          this.router.navigate(['/admin/car']);
        },
        error: (err) => {
          console.error('Lỗi cập nhật xe:', err);
        }
      });
    }
  }
}
