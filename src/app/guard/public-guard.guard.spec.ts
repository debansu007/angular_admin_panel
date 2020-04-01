import { TestBed, async, inject } from '@angular/core/testing';

import { PublicGuardGuard } from './public-guard.guard';

describe('PublicGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicGuardGuard]
    });
  });

  it('should ...', inject([PublicGuardGuard], (guard: PublicGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
