import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-update',
  standalone: true,
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class UserUpdateComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  user: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      address: [''],
      date: [''],
      image: [null]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  loadUser() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    this.http.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((user: any) => {
      this.user = user;
      this.profileForm.patchValue(user);
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    this.profileForm.patchValue({ image: file });
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  updateProfile() {
    const formData = new FormData();
    Object.keys(this.profileForm.value).forEach(key => {
      if (this.profileForm.value[key]) {
        formData.append(key, this.profileForm.value[key]);
      }
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    this.http.put('http://localhost:5000/api/users/profile', formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(() => {
      alert('✅ Cập nhật thành công!');
      this.router.navigate(['/user/info']); // ✅ Chuyển về trang thông tin
    });
  }

  changePassword() {
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert('❌ Mật khẩu nhập lại không khớp!');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    this.http.put('http://localhost:5000/api/users/password', this.passwordForm.value, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => alert('✅ Đổi mật khẩu thành công!'),
      error: err => alert(err.error.message || '❌ Lỗi đổi mật khẩu')
    });
  }
}
