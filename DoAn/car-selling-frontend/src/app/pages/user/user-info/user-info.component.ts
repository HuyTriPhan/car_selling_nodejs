import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    if (typeof window === 'undefined') return; 
  
    const token = localStorage.getItem('token');
    if (!token) return;
  
    this.http.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(data => this.user = data);
  }
  
}
