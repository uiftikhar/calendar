import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DatePickerService } from '../core/services/date-picker.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Date } from '../core/models/date';
import { CalendarDate } from '../core/models/calendar-date';
import { range } from '../core/utils';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  localeString: string = 'en';
  weekDaysHeader: Array<string> = [];
  monthsHeader: Array<string> = [];
  calendarGrid: Array<CalendarDate> = [];
  activeDate: Moment;
  currentEvents: Date[] = [];
  events: Date[] = [];
  currentEventsForm: FormGroup;
  private MAX_NUMBER_DAYS_IN_CALENDAR = 35;

  constructor(
    protected formBuilder: FormBuilder,
    private datePicker: DatePickerService,
  ) {
    this.currentEvents = [];

    this.currentEventsForm = this.formBuilder.group({
      currentEvents: [[]],
    });
  }

  ngOnInit() {
    moment.locale(this.localeString);
    this.activeDate = moment();
    this.monthsHeader = moment.monthsShort();
    this._makeHeader();
    this.datePicker.getEvents().subscribe(res => {
      this.events = res;
      this.datePicker.currentEvents = this.events;
      this._makeGrid();
    });
  }

  private _makeHeader() {
    const weekDaysArray: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArray.forEach(day =>
      this.weekDaysHeader.push(moment().weekday(day).format('ddd')),
    );
  }

  private _makeGrid(): void {
    this.calendarGrid = this._fillDates(this.activeDate);
  }

  private _fillDates(currentMoment: Moment) {
    const firstOfMonth = moment(currentMoment)
      .startOf('month')
      .day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');

    const start = firstDayOfGrid.date();

    return range(start, start + this.MAX_NUMBER_DAYS_IN_CALENDAR).map(
      (date: number) => {
        const value = moment(firstDayOfGrid).date(date);
        return {
          today: this._isToday(value),
          isCurrentMonth: this._isCurrentMonth(value),
          event: this._eventsForDate(value),
          isActive: this._isToday(value),
          value,
        };
      },
    );
  }

  private _isToday(date: Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  private _isCurrentMonth(date: Moment): boolean {
    return moment(date).isSame(this.activeDate, 'month');
  }

  private _eventsForDate(date: Moment): Date[] {
    const events = [];
    this.events.forEach(event => {
      if (this._areDatesEqual(event.date, date)) {
        events.push(event);
      }
    });
    return events;
  }

  private _areDatesEqual(firstDate: string, secondDate: Moment): boolean {
    return moment(firstDate).isSame(moment(secondDate), 'day');
  }

  addEvent() {
    const newEvent = {
      date: this.activeDate.toISOString(),
      title: this.currentEventsForm.get('currentEvents').value,
    };

    this.datePicker.addEvent(newEvent).subscribe(() => {
      this.currentEvents.push(newEvent);
      this.currentEventsForm.setValue({ currentEvents: '' });
    });
  }

  deleteEvent(title: string) {
    this.currentEvents = this.currentEvents.filter(
      event => event.title !== title,
    );
  }

  onSelectDay(day: CalendarDate): void {
    this._resetCurrentEvents();
    this.activeDate = moment(day.value);
    day.isActive = true;
    this.currentEvents = day.event;
  }

  private _resetCurrentEvents(): void {
    this.currentEvents = [];
    this.calendarGrid.forEach(item =>
      item.isActive ? (item.isActive = false) : item,
    );
  }

  nextYear(): void {
    this.activeDate.add(1, 'y');
    this._makeGrid();
  }

  prevYear(): void {
    this.activeDate.subtract(1, 'y');
    this._makeGrid();
  }

  updateMonth(month): void {
    this.activeDate.month(month);
    this._makeGrid();
  }
}
