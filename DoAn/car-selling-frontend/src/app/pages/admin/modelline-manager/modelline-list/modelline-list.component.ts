import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModellineService } from '../../../../services/modelLine.service';

@Component({
  selector: 'app-modelline-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './modelline-list.component.html',
  styleUrls: ['./modelline-list.component.scss']
})
export class ModellineListComponent implements OnInit {
  modellines: any[] = [];

  constructor(private modellineService: ModellineService) {}

  ngOnInit(): void {
    this.fetchModelLines();
  }

  fetchModelLines() {
    this.modellineService.getAllModelLines().subscribe(data => this.modellines = data);
  }

  deleteModelLine(id: string) {
    if (confirm('Bạn có chắc muốn xoá dòng xe này không?')) {
      this.modellineService.deleteModelLine(id).subscribe(() => this.fetchModelLines());
    }
  }
}
