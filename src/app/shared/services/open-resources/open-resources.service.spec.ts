import { TestBed } from '@angular/core/testing';

import { OpenResourcesService } from './open-resources.service';

describe('OpenResourcesService', () => {
  let service: OpenResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
