import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  imports: [CommonModule, RouterModule, RouterOutlet]
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const localUser = localStorage.getItem('user');
    this.user = localUser ? JSON.parse(localUser) : null;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
