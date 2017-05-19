import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';
import * as Leaflet from 'leaflet';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

import { DetailsPage } from '../details/details';
import { FinalDeliveryPage } from '../final-delivery/final-delivery';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-design',
  templateUrl: 'design.html',
})
export class DesignPage {
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
  view = 'APPROVE';
  viewMode = 'CLIENT';
  concepts: any;
  selectedConcept: any;
  conceptboard: any;
  floorplan: any;
  floorplanMap: any;
  items: any;
  collectionTotal: any;
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
        console.log("design page received project client data:");
        console.log(data);
        if (!data.exception) {
          self.client = data;
        }
      });
    }
    this.projectService.getProjectDetailType(this.project.projectId, "CONCEPT")
    .then(data => {
      console.log("design page received concepts:");
      console.log(data);
      if (!data['exception']) {
        var ids = [];
        for (var key in data) {
          const detail = data[key];
          ids.push(detail.fileEntryId);
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
                if (!self.floorplan) {
                  self.view = 'CONCEPT_BOARD';
                }
              }
            });
          }
        }
        if (!self.conceptboard) {
          self.projectService.getFileEntries(ids)
          .then(files => {
            console.log("design page received concept files:");
            console.log(files);
            self.concepts = data;
            self.selectedConcept = data[0];
          });
        }
      }
    });
    this.projectService.getProjectDetailType(this.project.projectId, "FLOOR_PLAN")
    .then(data => {
      console.log("design page received floorplan:");
      console.log(data);
      if (!data['exception']) {
        var ids = [];
        for (var key in data) {
          const file = data[key];
          ids.push(file.fileEntryId);
        }
        self.projectService.getFileEntry(ids[0])
        .then(data => {
          console.log("design page received floorplan file:");
          console.log(data);
          if (!data['exception']) {
            self.floorplan = data;
            self.view = 'FLOOR_PLAN';
            setTimeout(() => {
              self.drawFloorplan();
            }, 1000);
          }
        });
      }
    });
    this.projectService.fetchItems(this.project)
    .then(data => {
      console.log("design page received item data:");
      console.log(data);
      if (!data['exception']) {
        self.items = data;
        var collectionTotal = 0;
        for (var key in data) {
          const item = data[key];
          self.addItemPhotoUrl(item.fileEntryId, key);
          collectionTotal += item.itemPrice;
        }
        self.collectionTotal = collectionTotal;
      }
    });
  }

  drawFloorplan() {
    const self = this;
    console.log("drawing floorplan with marker map");
    // create the floorplan map
    this.floorplanMap = Leaflet.map('floorplan-map', {
      attributionControl: false,
      scrollWheelZoom: false,
      minZoom: 1,
      maxZoom: 4,
      center: [0, 0],
      zoom: 1,
      crs: Leaflet.CRS.Simple
    });
    // dimensions of the image
    var w = 3000, // this.floorplanMap.getSize().x * 4,
        h = 2250, // this.floorplanMap.getSize().y * 4,
        url = self.floorplan.url;
    console.log("map dimensions:");
    console.log(w);
    console.log(h);

    // calculate the edges of the image, in coordinate space
    var southWest = this.floorplanMap.unproject([0, h], this.floorplanMap.getMaxZoom()-1);
    var northEast = this.floorplanMap.unproject([w, 0], this.floorplanMap.getMaxZoom()-1);
    var bounds = new Leaflet.LatLngBounds(southWest, northEast);

    // add the image overlay, 
    // so that it covers the entire map
    Leaflet.imageOverlay(url, bounds).addTo(this.floorplanMap);

    // tell leaflet that the map is exactly as big as the image
    this.floorplanMap.setMaxBounds(bounds);

    // draw a marker
    for (var key in self.items) {
      const item = self.items[key];
      var latlng = new Leaflet.LatLng(item.XCoordinate * 100, item.YCoordinate * 100);
      Leaflet.marker(latlng).addTo(this.floorplanMap)
          .bindPopup("View detailed info for item " + key + " below.");
    }
  }

  addItemPhotoUrl(fileEntryId, index) {
    const self = this;
    this.projectService.getFileEntry(fileEntryId)
    .then(data => {
      console.log("design page received item file");
      console.log(data);
      if (!data['exception']) {
        console.log("adding file url to item map at index:");
        console.log(index);
        self.items[index].url = data['url'];
      }
    });
  }

  homePressed() {
    let alert = this.alertCtrl.create({
      title: 'NEW PROJECT',
      message: 'Press start to begin a new project.',
      buttons: 
      [{
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
              console.log('Cancel pressed');
          }
      },
      {
          text: 'Start',
          handler: data => {
              this.navCtrl.setRoot('Onboarding')
          }
      }]
    });
    alert.present();
  }

  toggleDropdown() {
    console.log("Toggling dropdown!");
    let popover = this.popoverCtrl.create('Dropdown');
    let width = this.platform.width();
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '65',
            left: width
          };
        }
      }
    };
    popover.onDidDismiss(data => {
      if (data == 'PROFILE') {
        this.navCtrl.setRoot('Profile');
      }
      if (data == 'ALL') {
        this.navCtrl.setRoot('Dashboard');
      }
      if (data == 'NEW') {
        this.navCtrl.setRoot('Onboarding');
      }
      if (data == 'LOGOUT') {
        this.userService.logout();
        this.navCtrl.setRoot('Login');
      }
    });
    popover.present({ev});
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
        if (data == 'DETAILS')
          page = DetailsPage;
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
    if (link == 'FINAL DELIVERY')
      page = FinalDeliveryPage;
    if (page)
      this.navCtrl.setRoot(page, {
        project: self.project
      });
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
    this.floorplanMap.remove();
    setTimeout(() => {
      this.drawFloorplan();
    }, 1000);
  }

  selectFloorplan() {
    console.log("selected switcher floorplan link");
    if (this.view != 'FLOOR_PLAN') {
      this.view = 'FLOOR_PLAN';
      this.drawFloorplan();
    }
  }

  selectConceptboard() {
    console.log("selected switcher conceptboard link");
    this.view = 'CONCEPT_BOARD';
  }

}
