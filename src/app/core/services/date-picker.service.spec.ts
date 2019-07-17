import { TestBed } from '@angular/core/testing';

import { DatePickerService } from './date-picker.service';
import { HttpClientModule } from '@angular/common/http';

describe('DatePickerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClientModule],
    }),
  );

  it('should be created', () => {
    const service: DatePickerService = TestBed.get(DatePickerService);
    expect(service).toBeTruthy();
  });
});
