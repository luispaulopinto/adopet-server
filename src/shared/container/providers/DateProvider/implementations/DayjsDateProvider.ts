import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import IDateProvider from '../contracts/IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  dateNow(): Date;

  dateNow(milliseconds: number): Date;

  dateNow(milliseconds?: number): Date {
    if (milliseconds) return dayjs(milliseconds).toDate();

    return dayjs().toDate();
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  compareInMinutes(startDate: Date, endDate: Date): number {
    const endDateUtc = this.convertToUTC(endDate);
    const startDateUtc = this.convertToUTC(startDate);

    return dayjs(endDateUtc).diff(startDateUtc, 'minutes');
  }

  compareInHours(startDate: Date, endDate: Date): number {
    const endDateUtc = this.convertToUTC(endDate);
    const startDateUtc = this.convertToUTC(startDate);

    return dayjs(endDateUtc).diff(startDateUtc, 'hours');
  }

  compareInDays(startDate: Date, endDate: Date): number {
    const endDateUtc = this.convertToUTC(endDate);
    const startDateUtc = this.convertToUTC(startDate);

    return dayjs(endDateUtc).diff(startDateUtc, 'days');
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    const endDateUtc = this.convertToUTC(endDate);
    const startDateUtc = this.convertToUTC(startDate);
    return dayjs(startDateUtc).isBefore(endDateUtc);
  }

  addDays(days: number): Date;

  addDays(days: number, date: Date): Date;

  addDays(days: number, date?: Date): Date {
    if (date) return dayjs(date).add(days, 'days').toDate();

    return dayjs().add(days, 'days').toDate();
  }

  addHours(hours: number): Date;

  addHours(hours: number, date: Date): Date;

  addHours(hours: number, date?: Date): Date {
    if (date) return dayjs(date).add(hours, 'hour').toDate();

    return dayjs().add(hours, 'hour').toDate();
  }

  addMinutes(minutes: number): Date;

  addMinutes(minutes: number, date: Date): Date;

  addMinutes(minutes: number, date?: Date): Date {
    if (date) return dayjs(date).add(minutes, 'minutes').toDate();

    return dayjs().add(minutes, 'minutes').toDate();
  }

  formatUtcDate(date: Date, format: string): string {
    return dayjs(date).utc().format(format);
  }
}

export default DayjsDateProvider;
