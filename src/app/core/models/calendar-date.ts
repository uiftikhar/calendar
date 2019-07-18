import { Date } from './date';
import { Moment } from 'moment';

export interface CalendarDate {
  today: boolean;
  isCurrentMonth: boolean;
  event: Date[];
  isActive: boolean;
  value: Moment;
}
