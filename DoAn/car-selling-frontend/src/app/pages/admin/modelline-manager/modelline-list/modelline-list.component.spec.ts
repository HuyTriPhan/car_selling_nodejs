import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellineListComponent } from './modelline-list.component';

describe('ModellineListComponent', () => {
  let component: ModellineListComponent;
  let fixture: ComponentFixture<ModellineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModellineListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModellineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
