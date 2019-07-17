import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DatePickerService } from '../core/services/date-picker.service';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Date {
  date: string;
  title: string;
}

interface CalendarDate {
  today: boolean;
  isSelectedMonth: boolean;
  event: Date[];
  isActive: boolean;
  value: number;
}

const MAX_NUMBER_WEEKS_IN_CALENDAR = 42;
const range = (start, end) =>
  Array.from(Array(end - start), (_, index) => start + index);

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})

export class DatePickerComponent implements OnInit {
  localeString: string = 'en';
  navDate: Moment;
  weekDaysHeaderArr: Array<string> = [];
  monthsHeader: Array<string> = [];
  gridArr: Array<CalendarDate> = [];
  activeDate: Moment;
  currentEvents: Date[] = [];
  events: Date[] = [];
  currentEventsForm: FormGroup;

  constructor(
    protected formBuilder: FormBuilder,
    private datePicker: DatePickerService,
  ) {
    this.navDate = moment();
    this.currentEvents = [];

    this.currentEventsForm = this.formBuilder.group({
      currentEvents: [[]],
    });
  }

  ngOnInit() {
    moment.locale(this.localeString);
    this.activeDate = this.navDate;
    this.monthsHeader = moment.monthsShort();
    this.makeHeader();

    this.datePicker.getEvents().subscribe(res => {
      this.events = res;
      this.datePicker.currentEvents = this.events;
      this.makeGrid();
    });
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

  makeHeader() {
    const weekDaysArray: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArray.forEach(day =>
      this.weekDaysHeaderArr.push(this.activeDate.weekday(day).format('ddd')),
    );
  }

  isToday(date: Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  fillDates(currentMoment: Moment): any[] {
    const firstOfMonth = moment(currentMoment)
      .startOf('month')
      .day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');

    const start = firstDayOfGrid.date();

    return range(start, start + MAX_NUMBER_WEEKS_IN_CALENDAR).map(
      (date: number): any => {
        const value = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(value),
          isSelectedMonth: this.isSelectedMonth(value),
          event: this.eventsForDate(value),
          isActive: false,
          value,
        };
      },
    );
  }

  eventsForDate(date: Moment): any {
    const events = [];
    this.events.forEach(event => {
      if (this.areDatesEqual(event.date, date)) {
        events.push(event);
      }
    });
    return events;
  }

  areDatesEqual(firstDate: string, secondDate: Moment) {
    return moment(firstDate).isSame(moment(secondDate), 'day');
  }

  isSelectedMonth(date: Moment): boolean {
    return moment(date).isSame(this.navDate, 'month');
  }

  makeGrid() {
    this.gridArr = this.fillDates(this.navDate);
  }

  onSelectDay(day: CalendarDate) {
    this.resetCurrentEvents();
    this.activeDate = moment(day.value);
    day.isActive = true;
    this.currentEvents = day.event;
  }

  private resetCurrentEvents() {
    this.currentEvents = [];
    this.gridArr.forEach(item =>
      item.isActive ? (item.isActive = false) : item,
    );
  }

  nextYear() {
    this.navDate.add(1, 'y');
    this.makeGrid();
  }

  prevYear() {
    this.navDate.subtract(1, 'y');
    this.makeGrid();
  }

  updateMonth(month) {
    this.navDate.month(month);
    this.makeGrid();
  }
}
