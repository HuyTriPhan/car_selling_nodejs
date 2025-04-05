import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { ModellineService } from '../../../../services/modelLine.service';

@Component({
  selector: 'app-modelline-create',
  standalone: true,
  imports: [CommonModule,RouterModule, ReactiveFormsModule],
  templateUrl: './modelline-create.component.html',
  styleUrls: ['./modelline-create.component.scss']
})
export class ModellineCreateComponent {
  modellineForm: FormGroup;

  constructor(private fb: FormBuilder, private modellineService: ModellineService, private router: Router) {
    this.modellineForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.modellineForm.valid) {
      this.modellineService.addModelLine(this.modellineForm.value).subscribe(() => {
        this.router.navigate(['/admin/modelline']);
      });
    }
  }
}
