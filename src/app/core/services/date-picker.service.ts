import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_URL } from '../../../../configs/config';
@Injectable({
  providedIn: 'root',
})
export class DatePickerService {
  private _currentEvents = [];

  set currentEvents(currentEvents) {
    this._currentEvents = currentEvents;
  }

  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get(API_URL).pipe(map((res: any) => res.result));
  }

  addEvent(body) {
    this._currentEvents.push(body);
    return this.http.post(API_URL, this._currentEvents);
  }

  deleteEvent(title) {
    this._currentEvents = this._currentEvents.filter(
      event => event.title !== title,
    );
    return this.http.post(API_URL, this._currentEvents);
  }
}
