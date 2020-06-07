import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'main'
})
export class MainPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
