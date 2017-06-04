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
    if (this.userService.currentUser.designer) {
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
    this.projectService.fetchProjectDetail(this.project.projectId, "CONCEPT")
    .then(data => {
      console.log("design page received concepts and floorplan:");
      console.log(data);
      if (!data['exception']) {
        for (var key in data) {
          var detail = data[key];
          if (detail && detail.projectDetailStatus == 'APPROVED') {
            detail.url = self.createFileUrl(detail.file);
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
            detail.url = self.createFileUrl(detail.file);
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
          detail.url = self.createFileUrl(detail.file);
          snapshots.push(detail);
        }
        if (snapshots.length > 0) {
          self.snapshots = detail;
        }
      }
    });
  }

  createFileUrl(data) {
    const repositoryId = data.repositoryId;
    const folderId = data.folderId;
    const title = data.title;
    const uuid = data.uuid;
    const version = data.version;
    const createDate = data.createDate;
    return "http://stage.themanhome.com/documents/" + repositoryId + "/" + folderId + "/" + title + "/" + uuid + "?version=" + version + "&t=" + createDate;
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