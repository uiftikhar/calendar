import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DatePickerService } from '@app/core/services/date-picker.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Date } from '@app/core/models/date';
import { CalendarDate } from '@app/core/models/calendar-date';
import { range } from '@app/core/utils';
import { Month } from '@app/core/models/month';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  localeString: string = 'en';
  weekDaysHeader: Array<string> = [];
  monthsHeader: Array<Month> = [];
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
      currentEvents: [[], Validators.required],
    });
  }

  ngOnInit() {
    moment.locale(this.localeString);
    this.activeDate = moment();
    this.makeMonthsHeader();
    this.makeWeekdayHeader();
    this.datePicker.getEvents().subscribe(res => {
      this.events = res;
      this.datePicker.currentEvents = this.events;
      this.makeGrid();
    });
  }

  makeWeekdayHeader() {
    const weekDaysArray: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArray.forEach(day =>
      this.weekDaysHeader.push(
        moment()
          .weekday(day)
          .format('ddd'),
      ),
    );
  }

  makeMonthsHeader() {
    const currentMonth = moment().format('MMM');
    moment.monthsShort().forEach(month => {
      const isActive = month === currentMonth ? true : false;
      this.monthsHeader.push({ month, isActive });
    });
  }

  makeGrid(): void {
    this.calendarGrid = this.fillDates(this.activeDate);
  }

  fillDates(currentMoment: Moment) {
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
          today: this.isToday(value),
          isCurrentMonth: this.isCurrentMonth(value),
          event: this.eventsForDate(value),
          isActive: false,
          value,
        };
      },
    );
  }

  isToday(date: Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isCurrentMonth(date: Moment): boolean {
    return moment(this.activeDate).isSame(date, 'month');
  }

  eventsForDate(date: Moment): Date[] {
    const events = [];
    this.events.forEach(event => {
      if (this.areDatesEqual(event.date, date)) {
        events.push(event);
      }
    });
    return events;
  }

  areDatesEqual(firstDate: string, secondDate: Moment): boolean {
    return moment(firstDate).isSame(moment(secondDate), 'day');
  }

  addEvent(title?: string) {
    title = title ? title : this.currentEventsForm.get('currentEvents').value;
    if (title) {
      const newEvent = {
        date: this.activeDate.toISOString(),
        title,
      };

      this.currentEvents.push(newEvent);
      this.datePicker.addEvent(newEvent).subscribe(() => {
        this.currentEventsForm.setValue({ currentEvents: '' });
      });
    }
  }

  deleteEvent(title: string) {
    this.currentEvents = this.currentEvents.filter(
      event => event.title !== title,
    );
  }

  onSelectDay(day: CalendarDate): void {
    this.resetCurrentEvents();
    this.activeDate = moment(day.value);
    day.isActive = true;
    this.currentEvents = day.event;
  }

  resetCurrentEvents(): void {
    this.currentEvents = [];
    this.calendarGrid.forEach(item =>
      item.isActive ? (item.isActive = false) : item,
    );
  }

  nextYear(): void {
    this.activeDate.add(1, 'y');
    this.makeGrid();
  }

  prevYear(): void {
    this.activeDate.subtract(1, 'y');
    this.makeGrid();
  }

  onUpdateMonth(selectedMonth: Month): void {
    this.activeDate.month(selectedMonth.month);
    this.resetSelectedMonths();
    this.resetCurrentEvents();
    this.makeGrid();
    selectedMonth.isActive = true;
  }

  resetSelectedMonths() {
    this.monthsHeader.forEach(month => (month.isActive = false));
  }

  trackByFn(index, item) {
    return index;
  }
}
