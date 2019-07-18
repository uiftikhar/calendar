import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as moment from 'moment';

import { DatePickerComponent } from './date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { DatePickerService } from '../core/services/date-picker.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        HttpClientTestingModule,
        HttpClientModule,
      ],
      providers: [HttpClientModule, DatePickerService],
      declarations: [DatePickerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Date picker generation', () => {
    it('should generate week day header', () => {
      expect(component.weekDaysHeader.length).toEqual(7);
    });

    it('should generate calendar grid array', () => {
      component.makeGrid();
      fixture.detectChanges();
      expect(component.calendarGrid.length).toEqual(35);
    });

    it('should generate June 2019 correctly', () => {
      component.activeDate = moment('2019-06-07');
      component.makeGrid();
      fixture.detectChanges();
      expect(component.calendarGrid[0].value.date()).toEqual(26);
    });

    it('should generate 1st of month correctly', () => {
      const firstOfMonth = moment(moment())
        .startOf('month')
        .date();
      component.makeGrid();
      fixture.detectChanges();
      expect(component.calendarGrid[firstOfMonth].value.date()).toEqual(1);
    });
  });

  describe('Year navigation', () => {
    it('should go forward 1 year', () => {
      component.activeDate = moment('2019-07-18');
      fixture.detectChanges();
      component.nextYear();
      fixture.detectChanges();
      expect(component.activeDate.year()).toEqual(2020);
    });

    it('should go backward 1 year', () => {
      component.activeDate = moment('2019-07-18');
      fixture.detectChanges();
      component.prevYear();
      fixture.detectChanges();
      expect(component.activeDate.year()).toEqual(2018);
    });
  });

  describe('Month navigation', () => {
    it('should set month to june', () => {
      component.onUpdateMonth({ isActive: false, month: 'Jun' });
      fixture.detectChanges();
      expect(component.activeDate.month()).toEqual(5);
    });
  });

  describe('events', () => {
    it('should reset events list', () => {
      component.resetCurrentEvents();
      fixture.detectChanges();
      expect(component.events.length).toEqual(0);
    });

    it('should add event from current event list', () => {
      component.currentEvents = [
        {
          date: moment().toISOString(),
          title: 'test 1',
        },
        {
          date: moment()
            .add(2, 'days')
            .toISOString(),
          title: 'test 1',
        },
        {
          date: moment()
            .add(6, 'days')
            .toISOString(),
          title: 'test 1',
        },
        {
          date: moment().toISOString(),
          title: 'test 1',
        },
      ];

      component.addEvent('test case event');

      expect(component.currentEvents.length).toEqual(5);
    });

    it('should delete event from current event list', () => {
      component.currentEvents = [
        {
          date: moment().toISOString(),
          title: 'test 1',
        },
        {
          date: moment()
            .add(2, 'days')
            .toISOString(),
          title: 'test 3',
        },
        {
          date: moment()
            .add(6, 'days')
            .toISOString(),
          title: 'test 5',
        },
        {
          date: moment().toISOString(),
          title: 'test 7',
        },
      ];

      component.deleteEvent('test 7');

      expect(component.currentEvents.length).toEqual(3);
    });
  });
});
