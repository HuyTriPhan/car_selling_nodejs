import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  errorMsg = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          // Lưu token và thông tin user
          this.auth.saveToken(res.token);
          this.auth.saveUser(res.user);
          localStorage.setItem('role', res.user.role);

          // Kiểm tra role admin
          if (res.user.role === 'admin') {
            // Điều hướng đến Dashboard admin (hoặc route admin mong muốn)
            this.router.navigate(['/admin']);
          } else {
            this.errorMsg = 'Tài khoản không phải admin';
          }
        },
        error: (err) => {
          this.errorMsg = err.error.message || 'Lỗi đăng nhập';
        }
      });
    }
  }

  // ---- Các phương thức bổ sung không thay đổi code gốc ----

  onForgotPassword() {
    // Xử lý chuyển hướng đến trang quên mật khẩu hoặc logic liên quan
    console.log('Forgot password clicked');
    // Ví dụ: this.router.navigate(['/forgot-password']);
  }

  loginWithGoogle() {
    // Xử lý đăng nhập qua Google
    console.log('Login with Google clicked');
    // Thực hiện logic đăng nhập với Google tại đây
  }

  loginWithTwitter() {
    // Xử lý đăng nhập qua Twitter
    console.log('Login with Twitter clicked');
    // Thực hiện logic đăng nhập với Twitter tại đây
  }

  loginWithFacebook() {
    // Xử lý đăng nhập qua Facebook
    console.log('Login with Facebook clicked');
    // Thực hiện logic đăng nhập với Facebook tại đây
  }
}
