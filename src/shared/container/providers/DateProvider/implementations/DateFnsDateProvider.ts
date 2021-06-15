// import {
//   differenceInDays,
//   differenceInHours,
//   differenceInMinutes,
//   addHours,
//   addDays,
//   isBefore,
//   addMinutes,
//   format,
// } from 'date-fns';

// import IDateProvider from '../contracts/IDateProvider';

// class DateFnsDateProvider implements IDateProvider {
//   dateNow(): Date {
//     return new Date();
//   }

//   convertToUTC(date: Date): string {
//     return format(
//       addMinutes(date, date.getTimezoneOffset()),
//       'yyyy-MM-dd HH:mm:ss',
//     );
//   }

//   compareInMinutes(startDate: Date, endDate: Date): number {
//     return differenceInMinutes(startDate, endDate);
//   }

//   compareInHours(startDate: Date, endDate: Date): number {
//     return differenceInHours(startDate, endDate);
//   }

//   compareInDays(startDate: Date, endDate: Date): number {
//     return differenceInDays(startDate, endDate);
//   }

//   compareIfBefore(startDate: Date, endDate: Date): boolean {
//     return isBefore(startDate, endDate);
//   }

//   addHours(hours: number): Date {
//     return addHours(new Date(), hours);
//   }

//   addDays(days: number): Date {
//     return addDays(new Date(), days);
//   }
// }

// export default DateFnsDateProvider;
