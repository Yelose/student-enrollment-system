import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentsList } from './enrollments-list';

describe('EnrollmentsList', () => {
  let component: EnrollmentsList;
  let fixture: ComponentFixture<EnrollmentsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
