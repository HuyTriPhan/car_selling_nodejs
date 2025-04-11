import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; // ✅ Thêm dòng này
import { tap } from 'rxjs/operators';

const API = 'http://localhost:5000/api/users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // ✅ Thêm
  ) {}

  private hasToken(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token'); // ✅ Sử dụng kiểm tra trình duyệt
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId); // ✅ Hàm dùng chung kiểm tra platform
  }

  register(data: any): Observable<any> {
    return this.http.post(`http://localhost:5000/api/users/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${API}/login`, data).pipe(
      tap((result: any) => {
        if (result && result.token) {
          this.saveToken(result.token);
        }
      })
    );
  }
  

  saveToken(token: string) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      this.isLoggedInSubject.next(true);
    }
  }

  saveRole(role: string) {
    if (this.isBrowser()) {
      localStorage.setItem('role', role);
    }
  }

  saveUser(user: any) {
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getRole(): string | null {
    return this.isBrowser() ? localStorage.getItem('role') : null;
  }

  getUser(): any {
    if (this.isBrowser()) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!this.getToken();
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      this.isLoggedInSubject.next(false);
      this.userSubject.next(null);
    }
  }
  
}
