import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';
import { ImageService } from '../../providers/image-service';

import { DetailsPage } from '../details/details';
import { DesignPage } from '../design/design';

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
    this.user = this.userService.currentUser;
    if (this.userService.currentUserGroups.designer) {
      console.log("current user is a designer");
      this.viewMode = "DESIGNER";
    }
    if (this.user.admin) {
      console.log("current user is an admin");
      this.viewMode = "DESIGNER";
    }
    this.project = this.navParams.get('project');
    if (this.project.designerNote != '') {
      this.designerNote = this.project.designerNote;
    }
    if (this.project.userId == this.user.userId) {
      console.log("current user's project");
      this.client = this.user;
    } else {
      this.userService.fetchUser(this.project.userId, (data) => {
        console.log("details page received project client data:");
        console.log(data);
        if (!data.exception) {
          self.client = data;
        }
      });
    }
    this.projectService.getProjectDetailType(this.project.projectId, "CONCEPT")
    .then(data => {
      console.log("design page received concepts and floorplan:");
      console.log(data);
      if (!data['exception']) {
        var conceptIds = [];
        for (var key in data) {
          const detail = data[key];
          conceptIds.push(detail.fileEntryId);
          if (detail && detail.projectDetailStatus == 'APPROVED') {
            self.conceptboard = {};
            console.log("concept was approved:");
            console.log(detail);
            self.imageService.getFileEntry(detail.fileEntryId)
            .then(data => {
              console.log("design page received approved concept file:");
              console.log(data);
              if (!data['exception']) {
                self.conceptboard = data;
              }
            });
          }
        }
      }
    });
    this.projectService.getProjectDetailType(this.project.projectId, "FLOOR_PLAN")
    .then(data => {
      console.log("design page received concepts and floorplan:");
      console.log(data);
      if (!data['exception']) {
        var floorplanIds = [];
        for (var key in data) {
          const file = data[key];
          floorplanIds.push(file.fileEntryId);
        }
        self.imageService.getFileEntry(floorplanIds[0])
        .then(data => {
          console.log("design page received floorplan file:");
          console.log(data);
          if (!data['exception']) {
            self.floorplan = data;
          }
        });
      }
    });
    this.projectService.getProjectDetailType(this.project.projectId, "FINAL_SNAPSHOTS")
    .then(data => {
      console.log("details page received final snapshots:");
      console.log(data);
      if (!data['exception']) {
        var ids = [];
        for (var key in data) {
          const file = data[key];
          ids.push(file.fileEntryId);
        }
        self.imageService.getFileEntries(ids)
        .then(files => {
          console.log("details page received final snapshot files:");
          console.log(files);
          self.snapshots = files;
        });
      }
    });
  }

  stringForView(view) {
    return view.replace("_", " ");
  }

  homePressed() {
    console.log("logo pressed");
    this.navCtrl.setRoot('DashboardPage');
  }

  selectTab() {
    const self = this;
    console.log("toggling tab dropdown");
    let popover = this.popoverCtrl.create('Dropdown', {
      items: ['DETAILS', 'DESIGN', 'FINAL DELIVERY']
    });
    popover.onDidDismiss(data => {
      if (data) {
        var page: any;
        if (data == 'DETAILS')
          page = DetailsPage;
        if (data == 'DESIGN')
          page = DesignPage;
        if (page)
          this.navCtrl.setRoot(page, {
            project: self.project
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
      page = DetailsPage;
    if (link == 'DESIGN')
      page = DesignPage;
    if (page)
      this.navCtrl.setRoot(page, {
        project: self.project
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
    console.log("selected footer tab link:");
    console.log(link);
    if (link == 'SHOPPING_CART') {
      console.log("selected footer tab shopping cart");
      this.navCtrl.setRoot('ShoppingCartPage');
    } else {
      this.view = link;
    }
  }

}