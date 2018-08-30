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
  @Input() concepts: string;
  @Input() floorplan: string;
  @Output() onApprove = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  constructor() {
  }

}
