import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule]
})

export class DashboardComponent implements OnInit {
  userCount = 0;
  orderCount = 0;
  totalIncome = 0;
  carStock = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe(data => {
      this.userCount = data.totalUsers;
      this.orderCount = data.totalOrders;
      this.totalIncome = data.totalRevenue;
      this.carStock = data.totalCars;
    });
  }
  
}
