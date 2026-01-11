import { TestBed } from '@angular/core/testing';

import { AnnotationsService } from './annotations';

describe('Annotations', () => {
  let service: AnnotationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnotationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
