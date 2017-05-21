import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

import { DetailsPage } from '../details/details';
import { DesignPage } from '../design/design';
import { ChatPage } from '../chat/chat';

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
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService,
              private projectService: ProjectService,
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
    Promise.all([this.projectService.getProjectDetailType(this.project.projectId, "CONCEPT"), this.projectService.getProjectDetailType(this.project.projectId, "FLOOR_PLAN")])
    .then(data => {
      console.log("design page received concepts and floorplan:");
      console.log(data);
      if (!data['exception']) {
        const concepts = data[0];
        var conceptIds = [];
        for (var key in concepts) {
          const detail = concepts[key];
          conceptIds.push(detail.fileEntryId);
          if (detail && detail.projectDetailStatus == 'APPROVED') {
            self.conceptboard = {};
            console.log("concept was approved:");
            console.log(detail);
            self.projectService.getFileEntry(detail.fileEntryId)
            .then(data => {
              console.log("design page received approved concept file:");
              console.log(data);
              if (!data['exception']) {
                self.conceptboard = data;
              }
            });
          }
        }
        const floorplans = data[1];
        var floorplanIds = [];
        for (var key in floorplans) {
          const file = floorplans[key];
          floorplanIds.push(file.fileEntryId);
        }
        self.projectService.getFileEntry(floorplanIds[0])
        .then(data => {
          console.log("design page received floorplan file:");
          console.log(data);
          if (!data['exception']) {
            self.floorplan = data;
          }
        });
        if (!concepts['exception'] && !floorplans['exception'] ) {
          self.view = 'FLOOR_PLAN';
        }
      }
    });
  }

  stringForView(view) {
    return view.replace("_", " ");
  }

  homePressed() {
    console.log("logo pressed");
    this.navCtrl.setRoot('Dashboard');
  }

  selectTab() {
    const self = this;
    console.log("toggling tab dropdown");
    let popover = this.popoverCtrl.create('TabDropdown', {
      tabs: ['DETAILS', 'DESIGN', 'FINAL DELIVERY']
    });
    popover.onDidDismiss(data => {
      if (data) {
        var page: any;
        if (data == 'DESIGN')
          page = DesignPage;
        if (data == 'FINAL DELIVERY')
          page = FinalDeliveryPage;
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
    let popover = this.popoverCtrl.create('TabDropdown', {
      tabs: ['DESIGNER NOTE', 'FLOOR PLAN', 'CONCEPT BOARD', '3D MODEL', 'SNAPSHOTS', 'FINAL NOTES', 'SHOPPING CART']
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
    } else {
      this.view = link;
    }
  }

}