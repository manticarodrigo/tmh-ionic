import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PriceTotalPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'priceTotal',
})
export class PriceTotalPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Array<any>, ...args) {
    const total = value.reduce((total, item) => {
      total += parseFloat(item.price);
      return total;
    }, 0.00);
    return total.toFixed(2);
  }
}
