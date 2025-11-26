import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsForm } from './students-form';

describe('StudentsForm', () => {
  let component: StudentsForm;
  let fixture: ComponentFixture<StudentsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
