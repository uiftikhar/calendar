import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

interface Date {
  value: number;
  isActive: boolean;
}

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

  constructor() {}

  ngOnInit() {
    moment.locale(this.localeString);
    this.navDate = moment();
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

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  range = (start, end) => Array.from(Array(end - start), (_, i) => start + i);

  fillDates(currentMoment: moment.Moment): any[] {
    const firstOfMonth = moment(currentMoment)
      .startOf('month')
      .day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');

    const start = firstDayOfGrid.date();

    return this.range(start, start + 42).map(
      (date: number): any => {
        const value = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(value),
          isSelectedMonth: this.isSelectedMonth(value),
          isActive: false,
          value,
        };
      },
    );
  }

  isSelectedMonth(date: moment.Moment): boolean {
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
    console.log(day, this.activeDate);
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
