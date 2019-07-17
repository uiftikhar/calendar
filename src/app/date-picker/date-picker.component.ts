import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DatePickerService } from '../core/services/date-picker.service';

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
    date: string;
  }[] = [];

  constructor(private datePicker: DatePickerService) {
    this.navDate = moment();
  }

  ngOnInit() {
    moment.locale(this.localeString);

    this.activeDate = this.navDate;
    this.monthsHeader = moment.monthsShort();
    this.makeHeader();
    this.datePicker.getEvents().subscribe((res: any) => {
      this.events = res.result;
      this.makeGrid();
    });
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
    return this.events.find(event =>
      moment(event.date).isSame(moment(date), 'day'),
    );
  }

  isSelectedMonth(date: Moment): boolean {
    return moment(date).isSame(this.navDate, 'month');
  }

  makeGrid() {
    this.gridArr = this.fillDates(this.navDate);
  }

  dateFromNum(num: number, referenceDate: any): any {
    const returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any) {
    this.gridArr.forEach(item =>
      item.isActive ? (item.isActive = false) : item,
    );
    this.activeDate = moment(day.value);
    day.isActive = true;
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
