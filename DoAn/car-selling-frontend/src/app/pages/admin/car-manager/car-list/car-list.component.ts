import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarService } from '../../../../services/car.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.fetchCars();
  }

  fetchCars() {
    this.carService.getAllCars().subscribe(data => this.cars = data);
  }

  deleteCar(id: string) {
    if (confirm('Bạn có chắc muốn xoá xe này không?')) {
      this.carService.deleteCar(id).subscribe(() => this.fetchCars());
    }
  }
}
