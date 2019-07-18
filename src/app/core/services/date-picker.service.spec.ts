import { getTestBed, TestBed } from '@angular/core/testing';

import { DatePickerService } from './date-picker.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { API_URL } from '../../../../configs/config';

describe('DatePickerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: DatePickerService = TestBed.get(DatePickerService);
    expect(service).toBeTruthy();
  });

  it('should add Event', () => {
    const responseForm = { ok: true };
    const datePickerService = TestBed.get(DatePickerService);
    const http = TestBed.get(HttpTestingController);
    let response;

    datePickerService
      .addEvent({
        title: 'test',
        date: moment().toISOString(),
      })
      .subscribe(res => {
        response = res;
      });

    http
      .expectOne({
        url: API_URL,
        method: 'POST',
      })
      .flush(responseForm);

    expect(response).toEqual(responseForm);
  });
});
