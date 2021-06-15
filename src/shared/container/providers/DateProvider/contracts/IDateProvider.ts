export default interface IDateProvider {
  dateNow(): Date;
  dateNow(milliseconds: number): Date;
  convertToUTC(date: Date): string;
  compareInMinutes(startDate: Date, endDate: Date): number;
  compareInHours(startDate: Date, endDate: Date): number;
  compareInDays(startDate: Date, endDate: Date): number;
  compareIfBefore(startDate: Date, endDate: Date): boolean;
  addDays(days: number): Date;
  addDays(days: number, date: Date): Date;
  addHours(hours: number): Date;
  addHours(hours: number, date: Date): Date;
  addMinutes(minutes: number): Date;
  addMinutes(minutes: number, date: Date): Date;
  formatUtcDate(date: Date, format: string): string;
}
