import { TestBed } from '@angular/core/testing';

import { DateConvertion } from './date-convertion';

describe('DateConvertion', () => {
  let service: DateConvertion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateConvertion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
