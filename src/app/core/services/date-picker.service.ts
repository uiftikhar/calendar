import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DatePickerService {
  private apiUrl =
    'https://www.jsonstore.io/e49d05b6c6c847cd17b52ad120cb289b837faf9d793702182ba12d30b987ffac';

  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get(this.apiUrl);
  }

  addEvent(body) {
    return this.http.post(this.apiUrl, body);
  }
}
