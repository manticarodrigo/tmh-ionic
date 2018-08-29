import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'collection-box',
  templateUrl: 'collection-box.html'
})
export class CollectionBoxComponent {
  @Input() roleView: string;
  @Input() itemsView: string;
  @Input() project: any;
  @Input() items: Array<any>;

  constructor() {
  }

}
