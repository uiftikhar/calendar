import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

interface Date {
  value: number;
  isActive: boolean;
}

const MAX_NUMBER_WEEKS_IN_CALENDAR = 42;
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
  gridArr: Array<any> = [];
  activeDate: Moment;
  events: {
    title: string;
    date: Moment;
  }[];

  currentEvents = [];

  constructor() {
    this.navDate = moment();
    this.events = [
      {
        title: 'test 1',
        date: moment(),
      },
      {
        title: 'A',
        date: moment(),
      },
      {
        title: 'B',
        date: moment(),
      },
      {
        title: 'test 2',
        date: moment().add(2, 'days'),
      },
      {
        title: 'test 3',
        date: moment().add(7, 'days'),
      },
      {
        title: 'test 4',
        date: moment().add(1, 'month'),
      },
      {
        title: 'test 5',
        date: moment().add(6, 'days'),
      },
    ];
  }

  ngOnInit() {
    moment.locale(this.localeString);

    this.activeDate = this.navDate;
    this.monthsHeader = moment.monthsShort();
    this.makeHeader();
    this.makeGrid();
  }

  makeHeader() {
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day =>
      this.weekDaysHeaderArr.push(
        moment()
          .weekday(day)
          .format('ddd'),
      ),
    );
  }

  isToday(date: Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  range = (start, end) => Array.from(Array(end - start), (_, i) => start + i);

  fillDates(currentMoment: Moment): any[] {
    const firstOfMonth = moment(currentMoment)
      .startOf('month')
      .day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');

    const start = firstDayOfGrid.date();

    return this.range(start, start + MAX_NUMBER_WEEKS_IN_CALENDAR).map(
      (date: number): any => {
        const value = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(value),
          isSelectedMonth: this.isSelectedMonth(value),
          event: this.hasEvent(value),
          isActive: false,
          value,
        };
      },
    );
  }

  hasEvent(date: Moment): any {
    const events = [];
    this.events.forEach(event => {
      if (this.areDatesEqual(event.date, date)) {
        events.push(event);
      }
    });
    return events;
  }

  areDatesEqual(firstDate: Moment, secondDate: Moment) {
    return moment(firstDate, 'MM/D/YYYY').isSame(
      moment(secondDate, 'MM/D/YYYY'),
      'date',
    );
  }

  isSelectedMonth(date: Moment): boolean {
    return moment(date).isSame(this.navDate, 'month');
  }

  makeGrid() {
    this.gridArr = this.fillDates(this.navDate);
    console.log(this.gridArr);
  }

  dateFromNum(num: number, referenceDate: any): any {
    const returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any) {
    this.currentEvents = [];
    this.gridArr.forEach(item =>
      item.isActive ? (item.isActive = false) : item,
    );
    this.activeDate = moment(day.value);
    day.isActive = true;
    this.currentEvents = day.event;
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
