import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;

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
      this.userService.lockUser(id, true).subscribe(() => this.fetchUsers());
    }
  }

  unlockUser(id: string) {
    if (confirm('Bạn có chắc chắn muốn mở khóa tài khoản này không?')) {
      this.userService.lockUser(id, false).subscribe(() => this.fetchUsers());
    }
  }

  get filteredUsers() {
    const term = this.searchTerm.trim().toLowerCase();
    return !term
      ? this.users
      : this.users.filter(u =>
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
        );
  }

  get pagedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  selectedUser: any = null;

  toggleDetail(user: any) {
    if (this.selectedUser?._id === user._id) {
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
    }
  }

}

