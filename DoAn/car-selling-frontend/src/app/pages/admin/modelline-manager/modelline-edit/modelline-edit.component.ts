import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModellineService } from '../../../../services/modelLine.service';

@Component({
  selector: 'app-modelline-edit',
  standalone: true,
  imports: [CommonModule,RouterModule, ReactiveFormsModule],
  templateUrl: './modelline-edit.component.html',
  styleUrls: ['./modelline-edit.component.scss']
})
export class ModellineEditComponent implements OnInit {
  modellineForm!: FormGroup;
  modellineId!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modellineService: ModellineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modellineId = this.route.snapshot.params['id'];
    this.modellineService.getModelLineById(this.modellineId).subscribe(line => {
      this.modellineForm = this.fb.group({
        name: [line.name, Validators.required],
        description: [line.description]
      });
    });
  }

  onSubmit() {
    if (this.modellineForm.valid) {
      this.modellineService.updateModelLine(this.modellineId, this.modellineForm.value).subscribe(() => {
        this.router.navigate(['/admin/modelline']);
      });
    }
  }
}
