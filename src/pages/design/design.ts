import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';
import * as Leaflet from 'leaflet';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';
import { ImageService } from '../../providers/image-service';

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
  // Step flow
  types = {
    BEDROOM: 'Bedroom',
    LIVING_ROOM: 'Living Room',
    MULTIPURPOSE_ROOM: 'Multipurpose Room',
    STUDIO: 'Studio',
    DINING_ROOM: 'Dining Room',
    HOME_OFFICE: 'Office'
  }
  loading = true;
  view = 'APPROVE';
  viewMode = 'CLIENT';
  itemsViewMode = 'PENDING';
  concepts: any;
  selectedConcept: any;
  conceptboard: any;
  markers = {};
  floorplan: any;
  floorplanMap: any;
  pendingItems: any;
  approvedItems: any;
  pendingCollectionTotal = 0;
  approvedCollectionTotal = 0;
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
    this.project.endDateReadable = this.getDaysLeftStringFrom(this.project.endDate);
    if (this.project.projectStatus == 'FINAL_DELIVERY' || this.project.projectStatus == 'SHOPPING_CART' || this.project.projectStatus == 'ESTIMATE_SHIPPING_AND_TAX' || this.project.projectStatus == 'ARCHIVED') {
        this.itemsViewMode = 'APPROVED';
    }
    this.fetchDetails();
    this.fetchItems();
  }

  fetchDetails() {
    const self = this;
    Promise.all([this.projectService.fetchProjectDetail(this.project.projectId, "CONCEPT"), this.projectService.fetchProjectDetail(this.project.projectId, "FLOOR_PLAN")])
    .then(data => {
      console.log("design page received concepts and floorplan:");
      console.log(data);
      if (!data['exception']) {
        var concepts = [];
        for (var key in data[0]) {
          var detail = data[0][key];
          detail.url = self.imageService.createFileUrl(detail.file);
          if (detail && detail.projectDetailStatus == 'APPROVED') {
            self.conceptboard = {};
            console.log("concept was approved:");
            console.log(detail);
            self.conceptboard = data;
          }
          concepts.push(detail);
        }
        if (concepts.length > 0) {
          self.concepts = data;
          self.selectedConcept = data[0];
        }
        var floorplans = [];
        for (var key in data[1]) {
          var detail = data[1][key];
          detail.url = self.imageService.createFileUrl(detail.file);
          floorplans.push(detail);
        }
        if (floorplans.length > 0) {
          self.floorplan = floorplans[0];
        }
        if (concepts.length > 0 && floorplans.length > 0) {
          self.view = 'FLOOR_PLAN';
        }
      }
      self.loading = false;
    });
  }

  fetchItems() {
    const self = this;
    this.projectService.fetchItems(this.project)
    .then(data => {
      console.log("design page received item data:");
      console.log(data);
      if (!data['exception'] && Array(data).length > 0) {
        var pendingItems = [];
        var approvedItems = [];
        var pendingCollectionTotal = 0;
        var approvedCollectionTotal = 0;
        for (var key in data) {
          var item = data[key];
          item.url = self.imageService.createFileUrl(item.file);
          if (item.projectItemStatus == 'APPROVED') {
            approvedItems.push(item);
            approvedCollectionTotal += item.itemPrice;
          } else {
            pendingItems.push(item);
            pendingCollectionTotal += item.itemPrice;
          }
        }
        if (pendingItems.length > 0) {
          self.pendingItems = pendingItems;
        } else {
          self.pendingItems = null;
        }
        if (approvedItems.length > 0) {
          self.approvedItems = approvedItems;
        } else {
          self.approvedItems = null;
        }
        self.pendingCollectionTotal = pendingCollectionTotal;
        self.approvedCollectionTotal = approvedCollectionTotal;
        if (approvedItems.length > 0 || pendingItems.length > 0) {
          self.drawFloorplan();
        }
      }
    });
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
    if (this.floorplanMap) {
      this.floorplanMap.remove();
    }
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
      // this.floorplanMap.setMaxBounds(bounds);

      // draw markers
      if (self.itemsViewMode == 'PENDING') {
        for (var key in self.pendingItems) {
          const item = self.pendingItems[key];
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
      } else {
        for (var key in self.approvedItems) {
          const item = self.approvedItems[key];
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
      }
      self.loading = false;
    }, 2000);
  }

  createPopup(item) {
    var popup = "";
    if (item.url) {
      popup += "<img style='width:150px;height:150px;object-fit:cover;' src='" + item.url + "'>";
    }
    if (item.itemMake) {
      popup += "<h3>" + item.itemMake + "</h3>";
    }
    if (item.itemType) {
      popup += "<p>" + item.itemType + "</p>";
    }
    if (item.itemPrice) {
      popup += "<h4>$" + item.itemPrice/100 + "</h4>";
    }
    return popup;
  }

  editMarkerLocations() {
    console.log("edit marker location activated");
    const self = this;
    if (self.itemsViewMode == 'PENDING') {
      // Keep track of drag events
      for (var key in this.pendingItems) {
        const item = this.pendingItems[key];
        console.log(key);
        console.log(item);
        self.markers[item.projectItemId].on("drag", function(e) {
          console.log("moving marker");
          var marker = e.target;
          var position = marker.getLatLng();
          console.log(position);
        });
      }
    } else {
      // Keep track of drag events
      for (var key in this.approvedItems) {
        const item = this.approvedItems[key];
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
    }, 
    {
      cssClass: 'tab-popover'
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

  itemViewSwitched() {
    console.log("item view switched");
    this.drawFloorplan();
  }

  fileChanged(event) {
    const self = this;
    console.log("file changed:");
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (this.view == 'CONCEPT_BOARD') {
      this.projectService.addDetail(this.project, file, 'CONCEPT')
      .then(data => {
        console.log(data);
        if (!data['exception']) {
          self.fetchDetails();
        }
      });
    }
    if (this.view == 'FLOOR_PLAN') {
      this.projectService.addDetail(this.project, file, 'FLOOR_PLAN')
      .then(data => {
        console.log(data);
        if (!data['exception']) {
          self.fetchDetails();
        }
      });
    }
  }

}