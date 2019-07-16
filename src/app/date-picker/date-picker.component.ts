import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

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
  selectedDate: any;

  constructor() {}

  ngOnInit() {
    moment.locale(this.localeString);
    this.navDate = moment();
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

  makeGrid() {
    console.log('make grid');
    this.gridArr = [];

    const firstDayDate = moment(this.navDate).startOf('month');
    const initialEmptyCells = firstDayDate.weekday();
    const lastDayDate = moment(this.navDate).endOf('month');
    const lastEmptyCells = 6 - lastDayDate.weekday();
    const daysInMonth = this.navDate.daysInMonth();
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;

    for (let i = 0; i < arrayLength; i++) {
      const obj: any = {};
      if (i < initialEmptyCells) {
        obj.value = moment(this.navDate)
          .date(-i)
          .date();
      } else if (i > initialEmptyCells + daysInMonth - 1) {
        obj.value = moment(this.navDate)
          .date(i)
          .date();
      } else {
        obj.value = i - initialEmptyCells + 1;
      }
      this.gridArr.push(obj);
    }
  }

  dateFromNum(num: number, referenceDate: any): any {
    const returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  selectDay(day: any) {
    console.log(day);

    if (day.available) {
      this.selectedDate = this.dateFromNum(day.value, this.navDate);
    }
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
