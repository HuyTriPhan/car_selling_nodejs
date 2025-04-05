import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellineEditComponent } from './modelline-edit.component';

describe('ModellineEditComponent', () => {
  let component: ModellineEditComponent;
  let fixture: ComponentFixture<ModellineEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModellineEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModellineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
