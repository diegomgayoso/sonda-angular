import { TestBed } from '@angular/core/testing';

import { SicknotesService } from './sicknotes.service';

describe('SicknotesService', () => {
  let service: SicknotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SicknotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
