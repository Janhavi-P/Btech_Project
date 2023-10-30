import { TestBed } from '@angular/core/testing';

import { CreateAccService } from './create-acc.service';

describe('CreateAccService', () => {
  let service: CreateAccService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAccService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
