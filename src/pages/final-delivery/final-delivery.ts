import { Component } from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

@IonicPage({
  name: 'final-delivery',
  segment: 'final-delivery/:id'
})
@Component({
  selector: 'page-final-delivery',
  templateUrl: 'final-delivery.html',
})
export class FinalDeliveryPage {
  // User & project vars
  user: any;
  project: any;
  client: any;
  // Step flow
  status = {
    UPLOADED_DRAWING: false,
    UPLOADED_INSPIRATION: false,
    UPLOADED_FURNITURE: false
  };
  view = 'DESIGNER_NOTE';
  roleView = 'CLIENT';
  designerNote = '';
  floorplan: any;
  conceptboard: any;
  videoUrl = '';
  snapshots: any;
  finalNote = '';
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userService: UserService,
    private projectService: ProjectService,
    private popoverCtrl: PopoverController
  ) {
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          this.user = user;
          if (this.user.is_staff) {
            this.viewMode = 'DESIGNER';
          }
          this.fetchProject();
        }
      });
  }

  fetchProject() {
    if (this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      if (this.project && this.project.designer_note != '') {
        this.designerNote = this.project.designer_note;
      }
      this.fetchDetails();
    } else if (this.navParams.get('id')) {
      const id = this.navParams.get('id');
      this.projectService.findByProjectId(id)
        .then(project => {
          console.log('final delivery received project:', project);
          this.project = project;
          if (this.project && this.project.designer_note != '') {
            this.designerNote = this.project.designer_note;
          }
          this.fetchDetails();
        });
    }
  }

  fetchDetails() {
    console.log('fetching project details');
    this.projectService.fetchProjectDetails(this.project.id)
      .then(data => {
        console.log('final-delivery page received details:', data);
        const snapshots = [];
        for (const key in data) {
          const detail = data[key];
          if (detail && (detail.type === 'CONCEPT' && detail.status == 'APPROVED')) {
            this.conceptboard = detail;
          }
          if (detail && (detail.type === 'FLOOR_PLAN' && detail.status == 'APPROVED')) {
            this.floorplan = detail;
          }
          if (detail && (detail.type === 'FINAL_SNAPSHOT' && detail.status == 'APPROVED')) {
            snapshots.push(detail);
          }
        }
        if (snapshots.length > 0) {
          this.snapshots = snapshots;
        }
      });
  }

  stringForView(view) {
    return view.replace('_', ' ');
  }

  homePressed() {
    console.log('logo pressed');
    this.navCtrl.setRoot('dashboard');
  }

  selectTab() {
    console.log('toggling tab dropdown');
    let popover = this.popoverCtrl.create(
      'dropdown',
      { items: ['DETAILS', 'DESIGN', 'FINAL DELIVERY'] },
      { cssClass: 'tab-popover'}
    );
    popover.onDidDismiss(data => {
      if (data) {
        let page: any;
        if (data == 'DETAILS')
          page = 'details';
        if (data == 'DESIGN')
          page = 'design';
        if (page)
          this.navCtrl.setRoot(page, {
            project: this.project,
            id: this.project.projectId
          });
      }
    });
    popover.present({animate: false});
  }

  selectTabLink(link) {
    console.log('selected tab link:', link);
    let page: any;
    if (link === 'DETAILS')
      page = 'details';
    if (link === 'DESIGN')
      page = 'design';
    if (page)
      this.navCtrl.setRoot(page, {
        project: this.project,
        id: this.project.projectId
      });
  }

  selectFooterTab() {
    console.log('toggling tab dropdown');
    let popover = this.popoverCtrl.create(
      'dropdown',
    { items:
      [
        'DESIGNER NOTE',
        'FLOOR PLAN',
        'CONCEPT BOARD',
        '3D MODEL',
        'SNAPSHOTS',
        'FINAL NOTES',
        'SHOPPING CART'
      ]
    }, 
    { cssClass: 'footer-popover' });
    popover.onDidDismiss(data => {
      if (data) {
        if (data == 'SHOPPING CART') {
          console.log('selected footer tab shopping cart');
        } else {
          this.view = data.replace(' ', '_');
        }
      }
    });
    popover.present({animate: false});
  }

  selectFooterTabLink(link) {
    console.log('selected footer tab link:', link);
    if (link == 'SHOPPING_CART') {
      console.log('selected footer tab shopping cart');
      this.navCtrl.setRoot('shopping-cart', {
        project: this.project,
        id: this.project.projectId
      });
    } else {
      this.view = link;
    }
  }

}