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
  itemsViewMode = 'PENDING';
  concepts: any;
  selectedConcept: any;
  conceptboard: any;
  floorplan: any;
  floorplanMap: any;
  loading = false;
  items: any;
  markers = {};
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
    if (this.userService.currentUserGroups.designer) {
      console.log("current user is a designer");
      this.viewMode = "DESIGNER";
    }
    if (this.user.admin) {
      console.log("current user is an admin");
      this.viewMode = "DESIGNER";
    }
    this.project = this.navParams.get('project');
    this.project.endDateReadable = this.getDaysLeftStringFrom(this.project.endDate);
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
        self.projectService.getFileEntries(conceptIds)
        .then(files => {
          console.log("design page received concept files:");
          console.log(files);
          self.concepts = data;
          self.selectedConcept = data[0];
        });
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
            self.drawFloorplan();
          }
        });
        if (!concepts['exception'] && !floorplans['exception'] ) {
          self.view = 'FLOOR_PLAN';
        }
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

  isItemVisible(item) {
    if (this.itemsViewMode == 'PENDING' && item.projectItemStatus != 'APPROVED')
      return true;
    if (this.itemsViewMode == 'APPROVED' && item.projectItemStatus == 'APPROVED')
      return true;
    return false;
  }

  getDaysLeftStringFrom(timestamp) {
    if (timestamp) {
      let date = new Date(timestamp);
      date.setDate(date.getDate());
      let now = new Date();
      var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      var interval = Math.floor(seconds / 86400); // days
      if (interval == 1)
        return '1 day left';
      if (interval > 0 && interval < 15)
        return interval + ' days left';
      return '0 days left';
    } else {
      return '';
    }
  }

  drawFloorplan() {
    console.log("drawing floorplan with marker map in 2 seconds");
    const self = this;
    self.loading = true;
    setTimeout(() => {
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
      var w = this.floorplanMap.getSize().x,
          h = this.floorplanMap.getSize().y,
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
      
      this.floorplanMap.fitBounds(bounds);
      
      // tell leaflet that the map is exactly as big as the image
      this.floorplanMap.setMaxBounds(bounds);

      // draw a marker
      for (var key in self.items) {
        const item = self.items[key];
        var latlng = new Leaflet.LatLng(item.YCoordinate * -h/8, item.XCoordinate * w/8);
        console.log("adding marker at coordinates:");
        console.log(latlng);
        const itemNum = Number(key) + 1;
        // The text could also be letters instead of numbers if that's more appropriate
        var numberIcon = Leaflet.divIcon({
              className: "number-icon",
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
              html: String(itemNum)       
        });
        // Add the each marker to the marker map with projectItemId as key
        self.markers[item.projectItemId] = new Leaflet.Marker(latlng, {
            draggable: true,
            icon: numberIcon
        });
        // Add popups
        self.markers[item.projectItemId].addTo(this.floorplanMap)
          .bindPopup(this.createPopup(item));
      }
      self.loading = false;
    }, 2000);
  }

  createPopup(item) {
    var popup = "";
    if (item.url) {
      popup += "<img src='" + item.url + "'>";
    }
    if (item.itemMake) {
      popup += "<h1>" + item.itemMake + "</h1>";
    }
    if (item.itemType) {
      popup += "<p>" + item.itemType + "</p>";
    }
    if (item.itemPrice) {
      popup += "<h2>$" + item.itemPrice + "</h2>";
    }
    return popup;
  }

  editMarkerLocations() {
    console.log("edit marker location activated");
    const self = this;
    // Keep track of drag events
    for (var key in this.items) {
      const item = this.items[key];
      console.log(key);
      console.log(item);
      self.markers[item.projectItemId].on("drag", function(e) {
        console.log("moving marker");
        var marker = e.target;
        var position = marker.getLatLng();
        console.log(position);
      });
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
    if (link == 'FINAL_DELIVERY')
      page = FinalDeliveryPage;
    if (page)
      this.navCtrl.setRoot(page, {
        project: self.project
      });
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
    if (this.floorplanMap) {
      this.floorplanMap.remove();
    }
    this.drawFloorplan();
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

  uploadConcept() {
    console.log("upload concept pressed");
  }

}
