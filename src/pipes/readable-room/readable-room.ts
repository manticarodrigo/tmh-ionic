import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableRoom',
})
export class ReadableRoomPipe implements PipeTransform {
  types = {
    BEDROOM: 'Bedroom',
    LIVING_ROOM: 'Living Room',
    MULTIPURPOSE_ROOM: 'Multipurpose Room',
    STUDIO: 'Studio',
    DINING_ROOM: 'Dining Room',
    HOME_OFFICE: 'Office'
  };
  transform(value: string, ...args) {
    return this.types[value];
  }
}
