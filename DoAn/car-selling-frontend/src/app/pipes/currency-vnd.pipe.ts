import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyVND',
  standalone: true
})
export class CurrencyVndPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('vi-VN') + ' vnđ';
  }
}
