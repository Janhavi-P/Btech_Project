import { TestBed } from '@angular/core/testing';

import { DoccountService } from './doccount.service';

describe('DoccountService', () => {
  let service: DoccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
