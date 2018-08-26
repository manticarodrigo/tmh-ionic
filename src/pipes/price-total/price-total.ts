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
    return value.map(item => parseInt(item.price)/100);
  }
}
