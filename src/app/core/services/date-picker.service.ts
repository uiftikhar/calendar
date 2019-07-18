import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class DatePickerService {
  private apiUrl =
    'https://www.jsonstore.io/e49d05b6c6c847cd17b52ad120cb289b837faf9d793702182ba12d30b987ffac';

  private _currentEvents = [];

  set currentEvents(currentEvents) {
    this._currentEvents = currentEvents;
  }

  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get(this.apiUrl).pipe(map((res: any) => res.result));
  }

  addEvent(body) {
    this._currentEvents.push(body);
    return this.http.post(this.apiUrl, this._currentEvents);
  }
}
