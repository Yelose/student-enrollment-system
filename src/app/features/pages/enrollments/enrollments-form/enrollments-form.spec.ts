import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentsForm } from './enrollments-form';

describe('EnrollmentsForm', () => {
  let component: EnrollmentsForm;
  let fixture: ComponentFixture<EnrollmentsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
