import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceTotal',
})
export class PriceTotalPipe implements PipeTransform {
  transform(value: Array<any>, ...args) {
    const total = value.reduce((total, item) => {
      total += parseFloat(item.price);
      return total;
    }, 0.00);
    return total.toFixed(2);
  }
}
