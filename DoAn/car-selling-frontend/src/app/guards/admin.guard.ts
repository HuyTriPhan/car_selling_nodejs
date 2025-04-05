import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      // Nếu có token và role là admin, cho phép truy cập
      if (token && role === 'admin') {
        return true;
      }
    }
    // Nếu chưa đăng nhập hoặc không có quyền admin, chuyển hướng đến trang admin/login
    this.router.navigate(['/admin/login']);
    return false;
  }
}
