import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  lockUser(id: string) {
    if (confirm('Bạn có chắc chắn muốn khóa tài khoản này không?')) {
      this.userService.lockUser(id, true).subscribe(() => {
        this.fetchUsers();
      });
    }
  }

  unlockUser(id: string) {
    if (confirm('Bạn có chắc chắn muốn mở khóa tài khoản này không?')) {
      this.userService.lockUser(id, false).subscribe(() => {
        this.fetchUsers();
      });
    }
  }
}
