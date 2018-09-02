import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ProjectService } from '../../../providers/project-service';

@Component({
  selector: 'collection-box',
  templateUrl: 'collection-box.html'
})
export class CollectionBoxComponent {
  @Input() isStaff: boolean;
  @Input() itemsView: string;
  @Input() project: any;
  @Input() items: Array<any>;
  @Input() concepts: string;
  @Input() floorplan: any;
  @Output() onSubmit = new EventEmitter();

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private projectService: ProjectService
  ) {
  }

  submitCollection() {
    console.log('submit collection pressed');
    const modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the confimation below, the collection, floor plan and concept board will be submitted to your client.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        let status = '';
        switch (this.project.status) {
          case 'CONCEPTS':
            status = 'FLOOR_PLAN';
            break;
          case 'FLOOR_PLAN':
          case 'REQUEST_ALTERNATIVES':
            status = 'ALTERNATIVES_READY';
            break;
          default:
            null
        }
        if (this.project.revision_count > 2) {
          status = 'FINAL_DELIVERY';
        }
        this.projectService.updateRevisionCount(this.project, status)
          .then(data => {
            console.log('update revision count returned:', data);
            if (this.project.revision_count > 2) {
              this.navCtrl.setRoot('final-delivery');
            } else {
              this.onSubmit.emit();
            }
          });
      }
    });
    modal.present();
  }

  approveCollection() {
    console.log('approve collection pressed');
    const modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the button below, you are approving the collection and requesting alternates from your designer.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.projectService.updateStatus(this.project, 'REQUEST_ALTERNATIVES')
          .then(data => {
            console.log('update status returned:', data);
            this.onSubmit.emit();
          });
      }
    });
    modal.present();
  }

}
