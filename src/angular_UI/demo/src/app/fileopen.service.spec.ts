import { TestBed } from '@angular/core/testing';

import { FileopenService } from './fileopen.service';

describe('FileopenService', () => {
  let service: FileopenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileopenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
