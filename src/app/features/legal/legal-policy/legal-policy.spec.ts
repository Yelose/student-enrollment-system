import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalPolicy } from './legal-policy';

describe('LegalPolicy', () => {
  let component: LegalPolicy;
  let fixture: ComponentFixture<LegalPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalPolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalPolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
