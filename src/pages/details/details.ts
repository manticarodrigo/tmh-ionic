import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

import { DesignPage } from '../design/design';
import { FinalDeliveryPage } from '../final-delivery/final-delivery';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
  // Chat vars
  false = false;
  minimized = false;
  maximized = false;
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
  view = 'DRAWING';
  viewMode = 'CLIENT';
  selectedDrawing: any;
  selectedInspiration: any;
  selectedFurniture: any;
  drawings: any;
  inspirations: any;
  furnitures: any;
  answers = {};
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
    this.project = this.navParams.get('project');
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
    this.projectService.getProjectDetailType(this.project.projectId, "DRAWING")
    .then(data => {
      console.log("details page received drawings:");
      console.log(data);
      if (!data['exception']) {
        var ids = [];
        for (var key in data) {
          const file = data[key];
          ids.push(file.fileEntryId);
        }
        self.projectService.getFileEntries(ids)
        .then(files => {
          console.log("details page received drawings files:");
          console.log(files);
          self.status.UPLOADED_DRAWING = true;
          self.selectedDrawing = files[0];
          self.drawings = files;
        });
      }
    });
    this.projectService.getProjectDetailType(this.project.projectId, "INSPIRATION")
    .then(data => {
      console.log("details page received inspirations:");
      console.log(data);
      if (!data['exception']) {
        var ids = [];
        for (var key in data) {
          const file = data[key];
          ids.push(file.fileEntryId);
        }
        self.projectService.getFileEntries(ids)
        .then(files => {
          console.log("details page received inspirations files");
          console.log(files);
          self.status.UPLOADED_INSPIRATION = true;
          self.selectedInspiration = files[0];
          self.inspirations = files;
        });
      }
    });
    this.projectService.getProjectDetailType(this.project.projectId, "FURNITURE")
    .then(data => {
      console.log("details page received furnitures:");
      console.log(data);
      if (!data['exception']) {
        var ids = [];
        for (var key in data) {
          const file = data[key];
          ids.push(file.fileEntryId);
        }
        self.projectService.getFileEntries(ids)
        .then(files => {
          console.log("details page received furnitures files:");
          console.log(files);
          self.status.UPLOADED_FURNITURE = true;
          self.selectedFurniture = files[0];
          self.furnitures = files;
        });
      }
    });
    this.projectService.fetchQuestionAnswers(this.project)
    .then(answers => {
      console.log("details page received answers:");
      console.log(answers);
      self.answers = answers;
    });
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
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '145'
          };
        }
      }
    };
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
    popover.present({ev});
  }

  selectTabLink(link) {
    const self = this;
    console.log("selected tab link:");
    console.log(link);
    var page: any;
    if (link == 'DESIGN')
      page = DesignPage;
    if (link == 'FINAL_DELIVERY')
      page = FinalDeliveryPage;
    if (page)
      this.navCtrl.setRoot(page, {
        project: self.project
      });
  }

  selectDrawing(drawing) {
    console.log("thumb pressed for drawing:");
    console.log(drawing);
    this.selectedDrawing = drawing;
  }

  selectInspiration(inspiration) {
    console.log("thumb pressed for inspiration:");
    console.log(inspiration);
    this.selectedInspiration = inspiration;
  }

  selectFurniture(furniture) {
    console.log("thumb pressed for furniture:");
    console.log(furniture);
    this.selectedFurniture = furniture;
  }

  selectMenuItem(item) {
    console.log("menu item pressed:");
    console.log(item);
    this.view = item;
  }

  maximizeChat() {
    console.log("chat fab pressed for project");
    this.maximized = !this.maximized;
  }

  chatToggled() {
    console.log("chat toggled");
    this.minimized = !this.minimized;
    if (this.maximized) {
      this.maximized = !this.maximized;
    }
  }

}
