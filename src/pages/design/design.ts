import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';
import * as Leaflet from 'leaflet';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';
import { ImageService } from '../../providers/image-service';

@IonicPage({
  name: 'design',
  segment: 'design/:id'
})
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
  view = 'APPROVE_CONCEPT';
  viewMode = 'CLIENT';
  itemsViewMode = 'PENDING';
  concepts: any;
  selectedConcept: any;
  conceptboard: any;
  markers = {};
  floorplan: any;
  floorplanMap: any;
  alternateItemsMap = {};
  pendingItems: any;
  modifiedItems: any;
  approvedItems: any;
  pendingItemsMap = {};
  modifiedItemsMap = {};
  approvedItemsMap = {};
  pendingCollectionTotal = 0;
  modifiedCollectionTotal = 0;
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
     // Fetch current user
    this.userService.fetchCurrentUser()
    .then(user => {
      if (user) {
        self.user = user;
        if (self.user.designer) {
          console.log("current user is a designer");
          self.viewMode = "DESIGNER";
        }
        if (self.user.admin) {
          console.log("current user is an admin");
          self.viewMode = "DESIGNER";
        }
        self.fetchProject();
      } else {
        self.navCtrl.setRoot('login');
      }
    });
  }

  fetchProject() {
    const self = this;
    console.log("fetching project");
    if (this.navParams.get('project')) {
      self.project = self.navParams.get('project');
      self.project.endDateReadable = self.getDaysLeftStringFrom(self.project.endDate);
      if (self.project.projectStatus == 'FINAL_DELIVERY' || self.project.projectStatus == 'SHOPPING_CART' || self.project.projectStatus == 'ESTIMATE_SHIPPING_AND_TAX' || self.project.projectStatus == 'ARCHIVED') {
          self.itemsViewMode = 'APPROVED';
      }
      self.fetchDetails();
      self.fetchItems();
    } else if (this.navParams.get('id')) {
      const id = self.navParams.get('id');
      self.projectService.findByProjectId(id)
      .then(project => {
        if (!project['exception']) {
          self.project = project;
          self.project.endDateReadable = self.getDaysLeftStringFrom(self.project.endDate);
          if (self.project.projectStatus == 'FINAL_DELIVERY' || self.project.projectStatus == 'SHOPPING_CART' || self.project.projectStatus == 'ESTIMATE_SHIPPING_AND_TAX' || self.project.projectStatus == 'ARCHIVED') {
              self.itemsViewMode = 'APPROVED';
          }
          self.fetchDetails();
          self.fetchItems();
        }
      });
    }
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
            console.log("concept was approved:");
            console.log(detail);
            self.conceptboard = detail;
            self.view = 'APPROVE_FLOOR_PLAN';
          }
          concepts.push(detail);
        }
        if (concepts.length > 0) {
          self.concepts = concepts;
          self.selectedConcept = concepts[0];
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
        var modifiedItems = [];
        var approvedItems = [];

        var pendingCollectionTotal = 0;
        var modifiedCollectionTotal = 0;
        var approvedCollectionTotal = 0;

        for (var key in data) {
          var item = data[key];
          if (item.parentProjectItemId != 0) {
            if (!self.alternateItemsMap[item.parentProjectItemId]) {
              self.alternateItemsMap[item.parentProjectItemId] = [];
            }
            self.alternateItemsMap[item.parentProjectItemId].push(item);
          } else {
            if (self.project.projectStatus == 'REQUEST_ALTERNATIVES' || self.project.projectStatus == 'ALTERNATIVES_READY') {
              if (item.projectItemStatus == 'PENDING' || item.projectItemStatus == 'SUBMITTED') {
                modifiedItems.push(item);
                modifiedCollectionTotal += item.itemPrice;
                self.imageService.getFileEntry(item.fileEntryId)
                .then(data => {
                  if (!data['exception']) {
                    self.modifiedItemsMap[data['fileEntryId']] = data;
                  }
                });
              } else if (item.projectItemStatus == 'APPROVED') {
                approvedItems.push(item);
                approvedCollectionTotal += item.itemPrice;
                self.imageService.getFileEntry(item.fileEntryId)
                .then(data => {
                  if (!data['exception']) {
                    self.approvedItemsMap[data['fileEntryId']] = data;
                  }
                });
              } else {
                pendingItems.push(item);
                pendingCollectionTotal += item.itemPrice;
                self.imageService.getFileEntry(item.fileEntryId)
                .then(data => {
                  if (!data['exception']) {
                    self.pendingItemsMap[data['fileEntryId']] = data;
                  }
                });
              }
            } else {
              if (item.projectItemStatus == 'APPROVED') {
                approvedItems.push(item);
                approvedCollectionTotal += item.itemPrice;
                self.imageService.getFileEntry(item.fileEntryId)
                .then(data => {
                  if (!data['exception']) {
                    self.pendingItemsMap[data['fileEntryId']] = data;
                  }
                });
              } else {
                pendingItems.push(item);
                pendingCollectionTotal += item.itemPrice;
                self.imageService.getFileEntry(item.fileEntryId)
                .then(data => {
                  if (!data['exception']) {
                    self.pendingItemsMap[data['fileEntryId']] = data;
                  }
                });
              }
            }
          }
        }
        if (pendingItems.length > 0) {
          self.pendingItems = pendingItems;
        } else {
          self.pendingItems = null;
        }
        if (modifiedItems.length > 0) {
          self.modifiedItems = modifiedItems;
        } else {
          self.modifiedItems = null;
        }
        if (approvedItems.length > 0) {
          self.approvedItems = approvedItems;
        } else {
          self.approvedItems = null;
        }
        self.pendingCollectionTotal = pendingCollectionTotal;
        self.modifiedCollectionTotal = modifiedCollectionTotal;
        self.approvedCollectionTotal = approvedCollectionTotal;
        self.drawFloorplan();
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
      var abs = Math.abs(interval);
      if (interval < 0 && abs == 1)
        return '1 day left';
      if (interval <=0 && abs >= 0 && abs < 15)
        return abs + ' days left';
      return '';
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
    if (self.view == 'FLOOR_PLAN') {
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

        // draw markers
        if (self.itemsViewMode == 'PENDING' && self.pendingItems) {
          self.createMarkers(self.pendingItems, w, h);
        } else if (self.itemsViewMode == 'MODIFIED' && self.modifiedItems) {
          self.createMarkers(self.modifiedItems, w, h);
        } else if (self.approvedItems) {
          self.createMarkers(self.approvedItems, w, h);
        }
        // listen for new marker event
        this.floorplanMap.on('dblclick', function(e) {
          console.log(e);
          if (self.viewMode == 'DESIGNER') {
            var numberIcon = Leaflet.divIcon({
              className: "number-icon",
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
              html: "*"       
            });
            const marker = new Leaflet.Marker(e.latlng, {
                icon: numberIcon
            });
            marker.addTo(self.floorplanMap);
            let popover = self.popoverCtrl.create('edit-item');
            popover.onDidDismiss(data => {
              console.log(data);
              if (data) {
                data.YCoordinate = e.latlng.lat / -h * 8 ;
                data.XCoordinate = e.latlng.lng / w * 8;
                self.projectService.addItem(self.project, data)
                .then(itemData => {
                  if (!itemData['exception']) {
                    self.fetchItems();
                  }
                });
              } else {
                marker.remove();
              }
            });
            popover.present();
          }
        });

        self.loading = false;
      }, 2000);
    }
  }

  createMarkers(items, w, h) {
    const self = this;
    var validItemCount = 0;
    for (var key in items) {
      const item = items[key];
      if (item.YCoordinate && item.XCoordinate) {
        validItemCount += 1;
        var latlng = new Leaflet.LatLng(item.YCoordinate * -h/8, item.XCoordinate * w/8);
        console.log("adding marker at coordinates:");
        console.log(latlng);
        // The text could also be letters instead of numbers if that's more appropriate
        var numberIcon = Leaflet.divIcon({
          className: "number-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
          html: String(validItemCount)       
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
  }

  createPopup(item) {
    var popup = "";
    if (this.itemsViewMode == 'PENDING' && this.pendingItemsMap[item.fileEntryId]) {
      popup += "<img style='width:150px;height:150px;object-fit:cover;' src='" + this.pendingItemsMap[item.fileEntryId] + "'>";
    }
    if (this.itemsViewMode == 'MODIFIED' && this.modifiedItemsMap[item.fileEntryId]) {
      popup += "<img style='width:150px;height:150px;object-fit:cover;' src='" + this.modifiedItemsMap[item.fileEntryId] + "'>";
    }
    if (this.itemsViewMode == 'APPROVED' && this.approvedItemsMap[item.fileEntryId]) {
      popup += "<img style='width:150px;height:150px;object-fit:cover;' src='" + this.approvedItemsMap[item.fileEntryId] + "'>";
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
    if (popup == "") {
      popup += "<h3>No item info.</h3>"
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
    this.navCtrl.setRoot('dashboard');
  }

  selectTab() {
    const self = this;
    console.log("toggling tab dropdown");
    let popover = this.popoverCtrl.create('dropdown', {
      items: ['DETAILS', 'DESIGN', 'FINAL DELIVERY']
    }, 
    {
      cssClass: 'tab-popover'
    });
    popover.onDidDismiss(data => {
      if (data) {
        var page: any;
        if (data == 'DETAILS')
          page = 'details';
        if (data == 'FINAL DELIVERY')
          page = 'final-delivery';
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
    if (link == 'FINAL_DELIVERY')
      page = 'final-delivery';
    if (page)
      this.navCtrl.setRoot(page, {
        project: self.project,
        id: self.project.projectId
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

  submitConcepts() {
    const self = this;
    console.log("submit concepts pressed");
    let modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the confimation below, the concept boards will be submitted to your client.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        var conceptCount = 0;
        for (var key in this.concepts) {
          const concept = this.concepts[key];
          this.projectService.updateDetailStatus(concept, 'SUBMITTED')
          .then(data => {
            console.log(data);
            conceptCount += 1;
            if (conceptCount == self.concepts.length) {
              this.projectService.updateStatus(self.project, 'CONCEPT')
              .then(data => {
                if (!data['exception']) {
                  self.fetchProject();
                }
              });
            }
          });
        }
      }
    });
    modal.present();
  }

  approveConcept() {
    const self = this;
    console.log("approve concepts pressed");
    let modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the confirmation below, you are approving a concept board.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        var conceptCount = 0;
        for (var key in this.concepts) {
          const concept = this.concepts[key];
          this.projectService.updateDetailStatus(concept, 'APPROVED')
          .then(data => {
            console.log(data);
            conceptCount += 1;
            if (conceptCount == self.concepts.length) {
              if (!data['exception']) {
                self.fetchProject();
              }
            }
          });
        }
      }
    });
    modal.present();
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
    if (this.view == 'APPROVE_CONCEPT') {
      this.projectService.addDetail(this.project, file, 'CONCEPT', 'PENDING')
      .then(data => {
        console.log(data);
        if (!data['exception']) {
          self.fetchDetails();
        }
      });
    }
    if (this.view == 'APPROVE_FLOOR_PLAN') {
      this.projectService.addDetail(this.project, file, 'FLOOR_PLAN', 'PENDING')
      .then(data => {
        console.log(data);
        if (!data['exception']) {
          self.fetchDetails();
        }
      });
    }
  }

  editItem(item, i) {
    const self = this;
    console.log("edit item pressed:");
    console.log(item);
    item.number = i + 1;
    let popover = self.popoverCtrl.create('edit-item', {
      item: item
    });
    popover.onDidDismiss(data => {
      console.log(data);
      if (data) {
        self.projectService.updateItem(self.project, data, 'PENDING')
        .then(itemData => {
          if (!itemData['exception']) {
            self.fetchItems();
          }
        });
      }
    });
    popover.present();
  }

  submitCollection() {
    const self = this;
    console.log("submit collection pressed");
    let modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the confimation below, the collection, floor plan and concept board will be submitted to your client.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        var status = '';
        if (self.project.projectStatus == 'CONCEPTS') {
          status = 'FLOOR_PLAN';
        }
        if (self.project.projectStatus == 'FLOOR_PLAN') {
          status = 'ALTERNATIVES_READY';
        }
        if (self.project.projectStatus == 'REQUEST_ALTERNATIVES') {
          status = 'ALTERNATIVES_READY';
        }
        if (self.project.revisionCount == 3) {
          status = 'FINAL_DELIVERY';
        }
        this.projectService.updateRevisionCount(self.project, status)
        .then(data => {
          console.log(data);
          if (!data['exception']) {
            self.fetchProject();
          }
        });
      }
    });
    modal.present();
  }

  approveCollection() {
    const self = this;
    console.log("approve collection pressed");
    let modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the button below, you are approving the collection and requesting alternates from your designer.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.projectService.updateStatus(self.project, 'REQUEST_ALTERNATIVES')
        .then(data => {
          console.log(data);
          if (!data['exception']) {
            self.fetchProject();
          }
        });
      }
    });
    modal.present();
  }

  offerAlternative(item, i) {
    const self = this;
    console.log("offer alt item pressed:");
    console.log(item);
    item.number = i + 1;
    let modal = self.modalCtrl.create('alternatives', {
      item: item,
      alts: self.alternateItemsMap[item.projectItemId]
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        const alts = data[0];
        const files = data[1];
        var altCount = 0;
        for (var key in alts) {
          var alt = alts[key];
          const file = files[key];
          if (alt.projectItemId) {
            alt.file = file;
            self.projectService.updateItem(self.project, alt, "ALTERNATE")
            .then(itemData => {
              altCount++;
              if (altCount == alts.length) {
                self.fetchItems();
              }
            });
          } else {
            self.projectService.addAlternative(self.project, alt, file, item)
            .then(itemData => {
              altCount++;
              if (altCount == alts.length) {
                self.fetchItems();
              }
            });
          }
        }
      }
    });
    modal.present();
  }

  viewAlternatives(item, i) {
    const self = this;
    console.log("view alternatives pressed:");
    console.log(item);
    item.number = i + 1;
    let modal = self.modalCtrl.create('alternatives', {
      item: item,
      alts: self.alternateItemsMap[item.projectItemId]
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        
      }
    });
    modal.present();
  }

  requestAlternative(item) {
    const self = this;
    console.log("request alternative pressed");
    this.projectService.updateItemStatus(item, 'REQUEST_ALTERNATIVE')
    .then(data => {
      if (!data['exception']) {
        self.fetchItems();
      }
    });
  }

  undoAlternative(item) {
    const self = this;
    console.log("undo alternative pressed");
    this.projectService.updateItemStatus(item, 'SUBMITTED')
    .then(data => {
      if (!data['exception']) {
        self.fetchItems();
      }
    });
  }

}