import { TestBed } from '@angular/core/testing';

import { LoginempService } from './loginemp.service';

describe('LoginempService', () => {
  let service: LoginempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
