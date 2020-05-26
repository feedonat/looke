import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'reverse',
})
export class ReversePipe implements PipeTransform {
      isArray(value: any): boolean {
        return Array.isArray(value);
      }
    transform(input: any): any {
    if (!this.isArray(input)) {
      return input;
    }

    return [...input].reverse();
  }
}

@NgModule({
  declarations: [ReversePipe],
  exports: [ReversePipe],
})
export class NgReversePipeModule {}