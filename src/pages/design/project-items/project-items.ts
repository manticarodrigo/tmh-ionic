import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, PopoverController } from 'ionic-angular';

import { ProjectService } from '../../../providers/project-service';

@Component({
  selector: 'project-items',
  templateUrl: 'project-items.html'
})
export class ProjectItemsComponent {
  @Input() isStaff: boolean;
  @Input() itemsView: string;
  @Input() loading = true;
  @Input() project: any;
  @Input() floorplan: any;
  @Input() items: any;
  @Output() onReload = new EventEmitter();

  map: any;
  markers: any;
  drawTimer: any;

  constructor(
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private projectService: ProjectService
  ) {}

  editItem(ev, item, i) {
    console.log('edit item pressed:', ev, item, i);
    item.number = i + 1;
    const popover = this.popoverCtrl.create(
      'edit-item',
      { item: item }
    );
    popover.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.projectService.updateItem(
          this.project,
          data,
          'PENDING'
        )
          .then(itemData => {
            console.log(itemData);
            this.onReload.emit();
          });
      }
    });
    // popover.present({ev});
    popover.present();
  }

  offerAlternative(item, i) {
    console.log('offer alt item pressed:', item);
    item.number = ++i;
    const alts = this.items.alternate;
    const modal = this.modalCtrl.create(
      'alternatives',
      {
        item,
        alts: alts ? alts[item.id] : null
      }
    );
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        const promises = [];
        data.forEach(alt => {
          if (alt.id) {
            promises.push(this.projectService.updateItem(this.project, alt, 'ALTERNATE_READY'));
          } else {
            promises.push(this.projectService.addAlternative(this.project, alt, item));
          }
        });
        this.onReload.emit();
      }
    });
    modal.present();
  }

  viewAlternatives(item, i) {
    console.log('view alternatives pressed:', item, i);
    const alts = this.items.alternate
    if (alts) {
      item.number = i + 1;
      const modal = this.modalCtrl.create(
        'alternatives',
        { item, alts: alts[item.id]}
      );
      modal.onDidDismiss(data => {
        console.log(data);
      });
      modal.present(); 
    }
  }

  requestAlternative(item) {
    console.log('request alternative:', item);
    Promise.all([
      this.projectService.updateItemStatus(item, 'REQUEST_ALTERNATIVE'),
      this.projectService.updateStatus(this.project, 'REQUEST_ALTERNATIVES')
    ])
      .then(data => {
        console.log(data);
        this.onReload.emit();
      });
  }

  undoAlternative(item) {
    console.log('undo alternative:', item);
    this.projectService.updateItemStatus(item, 'SUBMITTED')
      .then(data => {
        console.log(data);
        this.onReload.emit();
      });
  }
}
