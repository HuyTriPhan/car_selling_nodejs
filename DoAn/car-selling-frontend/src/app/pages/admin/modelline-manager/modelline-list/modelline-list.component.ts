import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModellineService } from '../../../../services/modelLine.service';

@Component({
  selector: 'app-modelline-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './modelline-list.component.html',
  styleUrls: ['./modelline-list.component.scss']
})
export class ModellineListComponent implements OnInit {
  modellines: any[] = [];
  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;

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

  get filteredModelLines() {
    if (!this.searchTerm.trim()) return this.modellines;
    return this.modellines.filter(line =>
      line.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get pagedModelLines() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredModelLines.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredModelLines.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
