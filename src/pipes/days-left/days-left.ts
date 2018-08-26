import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DaysLeftPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'daysLeft',
})
export class DaysLeftPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if (value) {
      const date = new Date(value);
      date.setDate(date.getDate());
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const interval = Math.floor(seconds / 86400); // days
      const abs = Math.abs(interval);
      if (interval <= 0 && abs >= 0)
        return abs;
      return 'N/A';
    }
    return 'N/A';
  }
}
