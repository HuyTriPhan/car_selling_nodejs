import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { CarService } from '../../../../services/car.service';
import { ModellineService } from '../../../../services/modelLine.service';

@Component({
  selector: 'app-car-create',
  standalone: true,
  imports: [CommonModule,RouterModule, ReactiveFormsModule],
  templateUrl: './car-create.component.html',
  styleUrls: ['./car-create.component.scss']
})
export class CarCreateComponent implements OnInit {
  carForm!: FormGroup;
  modelLines: any[] = [];
  fileToUpload: File | null = null;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private modellineService: ModellineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Khởi tạo form
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      modelLine: ['', Validators.required],
      price: [0, Validators.required],
      year: [''],
      origin: [''],
      seatCount: [''],
      description: ['']
      // Ảnh không dùng formControl vì sẽ được gửi qua FormData
    });

    // Lấy danh sách dòng xe để hiển thị dropdown
    this.modellineService.getAllModelLines().subscribe(lines => {
      this.modelLines = lines;
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.fileToUpload = target.files[0];
    }
  }

  onSubmit() {
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
      
      // Debug: In ra các cặp key-value của FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Gọi API thêm xe, sau khi thành công chuyển về trang danh sách xe
      this.carService.addCar(formData).subscribe({
        next: () => {
          // Chuyển hướng về danh sách xe.
          this.router.navigate(['/admin/car']);
        },
        error: (err) => {
          console.error('Lỗi thêm xe:', err);
        }
      });
    }
  }
}
