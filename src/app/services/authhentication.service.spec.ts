import { TestBed } from '@angular/core/testing';

import { AuthhenticationService } from './authhentication.service';

describe('AuthhenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthhenticationService = TestBed.get(AuthhenticationService);
    expect(service).toBeTruthy();
  });
});
