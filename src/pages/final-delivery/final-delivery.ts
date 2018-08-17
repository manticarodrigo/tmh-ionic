import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';
import { ImageService } from '../../providers/image-service';

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
  types = {
    BEDROOM: 'Bedroom',
    LIVING_ROOM: 'Living Room',
    MULTIPURPOSE_ROOM: 'Multipurpose Room',
    STUDIO: 'Studio',
    DINING_ROOM: 'Dining Room',
    HOME_OFFICE: 'Office'
  }
  status = {
    UPLOADED_DRAWING: false,
    UPLOADED_INSPIRATION: false,
    UPLOADED_FURNITURE: false
  };
  view = 'DESIGNER_NOTE';
  viewMode = 'CLIENT';
  designerNote = '';
  floorplan: any;
  conceptboard: any;
  videoUrl = '';
  snapshots: any;
  finalNote = '';
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService,
              private projectService: ProjectService,
              private imageService: ImageService,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private modalCtrl: ModalController,
              private platform: Platform) {
    const self = this;
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          self.user = user;
          if (self.user.designer) {
            self.viewMode = "DESIGNER";
          }
          if (self.user.admin) {
            self.viewMode = "DESIGNER";
          }
          self.fetchProject();
        }
      });
    
  }

  fetchProject() {
    const self = this;
    if (this.navParams.get('project')) {
      self.project = this.navParams.get('project');
      if (self.project && self.project.designerNote != '') {
        self.designerNote = this.project.designerNote;
      }
      self.fetchDetails();
    } else if (this.navParams.get('id')) {
      const id = self.navParams.get('id');
      self.projectService.findByProjectId(id)
      .then(project => {
        if (!project['exception']) {
          self.project = project;
          if (self.project && self.project.designerNote != '') {
            self.designerNote = self.project.designerNote;
          }
          self.fetchDetails();
        }
      });
    }
  }

  fetchDetails() {
    const self = this;
    console.log("fetching project details");
    this.projectService.fetchProjectDetail(this.project.projectId, "CONCEPT")
    .then(data => {
      console.log("design page received concepts and floorplan:");
      console.log(data);
      if (!data['exception']) {
        for (var key in data) {
          var detail = data[key];
          if (detail && detail.projectDetailStatus == 'APPROVED') {
            detail.url = self.imageService.createFileUrl(detail.file);
            self.conceptboard = detail;
          }
        }
      }
    });
    this.projectService.fetchProjectDetail(this.project.projectId, "FLOOR_PLAN")
    .then(data => {
      console.log("design page received concepts and floorplan:");
      console.log(data);
      if (!data['exception']) {
        for (var key in data) {
          var detail = data[key];
          if (detail && detail.projectDetailStatus == 'APPROVED') {
            detail.url = self.imageService.createFileUrl(detail.file);
            self.floorplan = detail;
          }
        }
      }
    });
    this.projectService.fetchProjectDetail(this.project.projectId, "FINAL_SNAPSHOTS")
    .then(data => {
      console.log("details page received final snapshots:");
      console.log(data);
      if (!data['exception']) {
        var snapshots = [];
        for (var key in data) {
          var detail = data[key];
          detail.url = self.imageService.createFileUrl(detail.file);
          snapshots.push(detail);
        }
        if (snapshots.length > 0) {
          self.snapshots = detail;
        }
      }
    });
  }

  stringForView(view) {
    return view.replace("_", " ");
  }

  homePressed() {
    console.log("logo pressed");
    this.navCtrl.setRoot('dashboard');
  }

  selectTab() {
    const self = this;
    console.log("toggling tab dropdown");
    let popover = this.popoverCtrl.create('dropdown', {
      items: ['DETAILS', 'DESIGN', 'FINAL DELIVERY']
    });
    popover.onDidDismiss(data => {
      if (data) {
        var page: any;
        if (data == 'DETAILS')
          page = 'details';
        if (data == 'DESIGN')
          page = 'design';
        if (page)
          this.navCtrl.setRoot(page, {
            project: self.project,
            id: self.project.projectId
          });
      }
    });
    popover.present();
  }

  selectTabLink(link) {
    const self = this;
    console.log("selected tab link:");
    console.log(link);
    var page: any;
    if (link == 'DETAILS')
      page = 'details';
    if (link == 'DESIGN')
      page = 'design';
    if (page)
      this.navCtrl.setRoot(page, {
        project: self.project,
        id: self.project.projectId
      });
  }

  selectFooterTab() {
    const self = this;
    console.log("toggling tab dropdown");
    let popover = this.popoverCtrl.create('Dropdown', {
      items: ['DESIGNER NOTE', 'FLOOR PLAN', 'CONCEPT BOARD', '3D MODEL', 'SNAPSHOTS', 'FINAL NOTES', 'SHOPPING CART']
    }, 
    {
      cssClass: 'tab-popover'
    });
    popover.onDidDismiss(data => {
      if (data) {
        if (data == 'SHOPPING CART') {
          console.log("selected footer tab shopping cart");
        } else {
          self.view = data.replace(" ", "_");
        }
      }
    });
    popover.present();
  }

  selectFooterTabLink(link) {
    const self = this;
    console.log("selected footer tab link:");
    console.log(link);
    if (link == 'SHOPPING_CART') {
      console.log("selected footer tab shopping cart");
      this.navCtrl.setRoot('shopping-cart', {
        project: self.project,
        id: self.project.projectId
      });
    } else {
      this.view = link;
    }
  }

}