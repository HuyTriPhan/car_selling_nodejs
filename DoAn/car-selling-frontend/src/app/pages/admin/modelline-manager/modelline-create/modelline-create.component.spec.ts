import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellineCreateComponent } from './modelline-create.component';

describe('ModellineCreateComponent', () => {
  let component: ModellineCreateComponent;
  let fixture: ComponentFixture<ModellineCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModellineCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModellineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
