import { TestBed } from '@angular/core/testing';

import { LoginPopup } from './login-popup';

describe('LoginPopup', () => {
  let service: LoginPopup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginPopup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
