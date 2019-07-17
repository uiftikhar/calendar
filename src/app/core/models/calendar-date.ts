import { Date } from './date';

export interface CalendarDate {
  today: boolean;
  isCurrentMonth: boolean;
  event: Date[];
  isActive: boolean;
  value: number;
}
