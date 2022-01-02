import { TestBed } from '@angular/core/testing';

import { StudentListPDFService } from './student-list-pdf.service';

describe('StudentListPDFService', () => {
  let service: StudentListPDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentListPDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
