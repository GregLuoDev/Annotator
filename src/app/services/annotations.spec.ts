import { TestBed } from '@angular/core/testing';

import { Annotations } from './annotations';

describe('Annotations', () => {
  let service: Annotations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Annotations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
