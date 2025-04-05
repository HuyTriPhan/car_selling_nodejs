import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="user-manager-container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class UserManagerComponent {}
