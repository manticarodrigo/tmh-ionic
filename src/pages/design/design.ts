import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  ModalController
} from 'ionic-angular';

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
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userService: UserService,
    private projectService: ProjectService,
    private imageService: ImageService,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {
     // Fetch current user
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          this.user = user;
          if (this.user.designer) {
            console.log('current user is a designer');
            this.viewMode = 'DESIGNER';
          }
          if (this.user.admin) {
            console.log('current user is an admin');
            this.viewMode = 'DESIGNER';
          }
          this.fetchProject();
        }
      });
  }

  fetchProject() {
    console.log('fetching project');
    if (this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      this.project.endDateReadable = this.getDaysLeftStringFrom(this.project.end_date);
      if (
        this.project.status == 'FINAL_DELIVERY' ||
        this.project.status == 'SHOPPING_CART' ||
        this.project.status == 'ESTIMATE_SHIPPING_AND_TAX' ||
        this.project.status == 'ARCHIVED'
      ) {
        this.itemsViewMode = 'APPROVED';
      }
      this.fetchDetails();
      this.fetchItems();
    } else if (this.navParams.get('id')) {
      const id = this.navParams.get('id');
      this.projectService.findByProjectId(id)
        .then(project => {
          this.project = project;
          this.project.endDateReadable = this.getDaysLeftStringFrom(this.project.end_date);
          if (
            this.project.status == 'FINAL_DELIVERY' ||
            this.project.status == 'SHOPPING_CART' ||
            this.project.status == 'ESTIMATE_SHIPPING_AND_TAX' ||
            this.project.status == 'ARCHIVED'
          ) {
              this.itemsViewMode = 'APPROVED';
          }
          this.fetchDetails();
          this.fetchItems();
        });
    }
  }

  fetchDetails() {
    this.projectService.fetchProjectDetails(this.project.id)
      .then(data => {
        console.log('design received details:', data);
        const concepts = [];
        const floorplans = [];
        for (const key in data) {
          const detail = data[key];
          if (detail && (detail.type === 'CONCEPT' && detail.status === 'APPROVED')) {
            console.log('approved concept:', detail);
            this.conceptboard = detail;
            this.view = 'APPROVE_FLOOR_PLAN';
          }
          concepts.push(detail);
          if (detail && detail.type === 'FLOOR_PLAN') {
            console.log('floor plan:', detail);
            this.view = 'APPROVE_FLOOR_PLAN';
          }
          floorplans.push(detail);
        }
        if (concepts.length > 0) {
          this.concepts = concepts;
          this.selectedConcept = concepts[0];
        }
        if (floorplans.length > 0) {
          this.floorplan = floorplans[0];
        }
        if (concepts.length > 0 && floorplans.length > 0) {
          this.view = 'FLOOR_PLAN';
        }
        this.loading = false;
      });
  }

  fetchItems() {
    this.projectService.fetchItems(this.project)
      .then(data => {
        console.log('design page received item data:', data);
        if (data && Array(data).length > 0) {
          const pendingItems = [];
          const modifiedItems = [];
          const approvedItems = [];

          let pendingCollectionTotal = 0;
          let modifiedCollectionTotal = 0;
          let approvedCollectionTotal = 0;

          for (const key in data) {
            const item = data[key];
            if (item.parentProjectItemId != 0) {
              if (!this.alternateItemsMap[item.parentProjectItemId]) {
                this.alternateItemsMap[item.parentProjectItemId] = [];
              }
              this.alternateItemsMap[item.parentProjectItemId].push(item);
            } else {
              if (this.project.status == 'REQUEST_ALTERNATIVES' || this.project.status == 'ALTERNATIVES_READY') {
                if (item.projectItemStatus == 'PENDING' || item.projectItemStatus == 'SUBMITTED') {
                  modifiedItems.push(item);
                  modifiedCollectionTotal += item.itemPrice;
                  this.imageService.getFileEntry(item.fileEntryId)
                  .then(data => {
                    if (!data['exception']) {
                      this.modifiedItemsMap[data['fileEntryId']] = data;
                    }
                  });
                } else if (item.projectItemStatus == 'APPROVED') {
                  approvedItems.push(item);
                  approvedCollectionTotal += item.itemPrice;
                  this.imageService.getFileEntry(item.fileEntryId)
                  .then(data => {
                    if (!data['exception']) {
                      this.approvedItemsMap[data['fileEntryId']] = data;
                    }
                  });
                } else {
                  pendingItems.push(item);
                  pendingCollectionTotal += item.itemPrice;
                  this.imageService.getFileEntry(item.fileEntryId)
                  .then(data => {
                    if (!data['exception']) {
                      this.pendingItemsMap[data['fileEntryId']] = data;
                    }
                  });
                }
              } else {
                if (item.projectItemStatus == 'APPROVED') {
                  approvedItems.push(item);
                  approvedCollectionTotal += item.itemPrice;
                  this.imageService.getFileEntry(item.fileEntryId)
                  .then(data => {
                    if (!data['exception']) {
                      this.pendingItemsMap[data['fileEntryId']] = data;
                    }
                  });
                } else {
                  pendingItems.push(item);
                  pendingCollectionTotal += item.itemPrice;
                  this.imageService.getFileEntry(item.fileEntryId)
                  .then(data => {
                    if (!data['exception']) {
                      this.pendingItemsMap[data['fileEntryId']] = data;
                    }
                  });
                }
              }
            }
          }
          if (pendingItems.length > 0) {
            this.pendingItems = pendingItems;
          } else {
            this.pendingItems = null;
          }
          if (modifiedItems.length > 0) {
            this.modifiedItems = modifiedItems;
          } else {
            this.modifiedItems = null;
          }
          if (approvedItems.length > 0) {
            this.approvedItems = approvedItems;
          } else {
            this.approvedItems = null;
          }
          this.pendingCollectionTotal = pendingCollectionTotal;
          this.modifiedCollectionTotal = modifiedCollectionTotal;
          this.approvedCollectionTotal = approvedCollectionTotal;
          this.drawFloorplan();
        }
      });
  }

  getDaysLeftStringFrom(timestamp) {
    if (timestamp) {
      const date = new Date(timestamp);
      date.setDate(date.getDate());
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const interval = Math.floor(seconds / 86400); // days
      const abs = Math.abs(interval);
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
    console.log('drawing floorplan with marker map in 2 seconds');
    this.loading = true;
    if (this.floorplanMap) {
      this.floorplanMap.remove();
    }
    if (this.view == 'FLOOR_PLAN') {
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
        const w = this.floorplanMap.getSize().x,
            h = this.floorplanMap.getSize().y,
            url = this.floorplan.url;
        console.log('map dimensions:');
        console.log(w);
        console.log(h);

        // calculate the edges of the image, in coordinate space
        const southWest = this.floorplanMap.unproject([0, h], this.floorplanMap.getMaxZoom()-1);
        const northEast = this.floorplanMap.unproject([w, 0], this.floorplanMap.getMaxZoom()-1);
        const bounds = new Leaflet.LatLngBounds(southWest, northEast);
        
        // add the image overlay, 
        // so that it covers the entire map
        Leaflet.imageOverlay(url, bounds).addTo(this.floorplanMap);
        
        this.floorplanMap.fitBounds(bounds);

        // draw markers
        if (this.itemsViewMode == 'PENDING' && this.pendingItems) {
          this.createMarkers(this.pendingItems, w, h);
        } else if (this.itemsViewMode == 'MODIFIED' && this.modifiedItems) {
          this.createMarkers(this.modifiedItems, w, h);
        } else if (this.approvedItems) {
          this.createMarkers(this.approvedItems, w, h);
        }
        // listen for new marker event
        this.floorplanMap.on('dblclick', function(e) {
          console.log(e);
          if (this.viewMode == 'DESIGNER') {
            const numberIcon = Leaflet.divIcon({
              className: 'number-icon',
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
              html: '*'       
            });
            const marker = new Leaflet.Marker(e.latlng, {
                icon: numberIcon
            });
            marker.addTo(this.floorplanMap);
            const popover = this.popoverCtrl.create('edit-item');
            popover.onDidDismiss(data => {
              console.log(data);
              if (data) {
                data.YCoordinate = e.latlng.lat / -h * 8 ;
                data.XCoordinate = e.latlng.lng / w * 8;
                this.projectService.addItem(this.project, data)
                .then(itemData => {
                  if (!itemData['exception']) {
                    this.fetchItems();
                  }
                });
              } else {
                marker.remove();
              }
            });
            popover.present();
          }
        });

        this.loading = false;
      }, 2000);
    }
  }

  createMarkers(items, w, h) {
    let validItemCount = 0;
    for (const key in items) {
      const item = items[key];
      if (item.YCoordinate && item.XCoordinate) {
        validItemCount += 1;
        const latlng = new Leaflet.LatLng(item.YCoordinate * -h/8, item.XCoordinate * w/8);
        console.log('adding marker at coordinates:');
        console.log(latlng);
        // The text could also be constters instead of numbers if that's more appropriate
        const numberIcon = Leaflet.divIcon({
          className: 'number-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
          html: String(validItemCount)       
        });
        // Add the each marker to the marker map with projectItemId as key
        this.markers[item.projectItemId] = new Leaflet.Marker(latlng, {
            draggable: true,
            icon: numberIcon
        });
        // Add popups
        this.markers[item.projectItemId].addTo(this.floorplanMap)
          .bindPopup(this.createPopup(item));
      }
    }
  }

  createPopup(item) {
    let popup = '';
    if (this.itemsViewMode == 'PENDING' && this.pendingItemsMap[item.fileEntryId]) {
      popup += "<img style='width:150px;height:150px;object-fit:cover;' src='" + this.pendingItemsMap[item.fileEntryId] + "'>";
    }
    if (this.itemsViewMode == 'MODIFIED' && this.modifiedItemsMap[item.fileEntryId]) {
      popup += "<img style='width:150px;height:150px;object-fit:cover; src='" + this.modifiedItemsMap[item.fileEntryId] + "'>";
    }
    if (this.itemsViewMode == 'APPROVED' && this.approvedItemsMap[item.fileEntryId]) {
      popup += "<img style='width:150px;height:150px;object-fit:cover;' src='" + this.approvedItemsMap[item.fileEntryId] + "'>";
    }
    if (item.itemMake) {
      popup += '<h3>' + item.itemMake + '</h3>';
    }
    if (item.itemType) {
      popup += '<p>' + item.itemType + '</p>';
    }
    if (item.itemPrice) {
      popup += '<h4>$' + item.itemPrice/100 + '</h4>';
    }
    if (popup == '') {
      popup += '<h3>No item info.</h3>'
    }
    return popup;
  }

  editMarkerLocations() {
    console.log('edit marker location activated');
    if (this.itemsViewMode == 'PENDING') {
      // Keep track of drag events
      for (const key in this.pendingItems) {
        const item = this.pendingItems[key];
        console.log(key);
        console.log(item);
        this.markers[item.projectItemId].on('drag', function(e) {
          console.log('moving marker');
          const marker = e.target;
          const position = marker.getLatLng();
          console.log(position);
        });
      }
    } else {
      // Keep track of drag events
      for (const key in this.approvedItems) {
        const item = this.approvedItems[key];
        console.log(key);
        console.log(item);
        this.markers[item.projectItemId].on('drag', function(e) {
          console.log('moving marker');
          const marker = e.target;
          const position = marker.getLatLng();
          console.log(position);
        });
      }
    }
  }

  homePressed() {
    console.log('logo pressed');
    this.navCtrl.setRoot('dashboard');
  }

  selectTab() {
    console.log('toggling tab dropdown');
    const popover = this.popoverCtrl.create(
      'dropdown',
      { items: ['DETAILS', 'DESIGN', 'FINAL DELIVERY'] }, 
      { cssClass: 'tab-popover'}
    );
    popover.onDidDismiss(data => {
      if (data) {
        let page: any;
        if (data == 'DETAILS')
          page = 'details';
        if (data == 'FINAL DELIVERY')
          page = 'final-delivery';
        if (page)
          this.navCtrl.setRoot(page, {
            project: this.project,
            id: this.project.id
          });
      }
    });
    popover.present();
  }

  selectTabLink(link) {
    console.log('selected tab link:', link);
    let page: any;
    if (link == 'DETAILS')
      page = 'details';
    if (link == 'FINAL_DELIVERY')
      page = 'final-delivery';
    if (page)
      this.navCtrl.setRoot(page, {
        project: this.project,
        id: this.project.id
      });
  }

  maximizeChat() {
    console.log('chat fab pressed for project');
    this.maximized = !this.maximized;
  }

  chatToggled() {
    console.log('chat toggled');
    this.minimized = !this.minimized;
    if (this.maximized) {
      this.maximized = !this.maximized;
    }
    this.drawFloorplan();
  }

  selectFloorplan() {
    console.log('selected switcher floorplan link');
    if (this.view !== 'FLOOR_PLAN') {
      this.view = 'FLOOR_PLAN';
      this.drawFloorplan();
    }
  }

  selectConceptboard() {
    console.log('selected switcher conceptboard link');
    this.view = 'CONCEPT_BOARD';
  }

  submitConcepts() {
    console.log('submit concepts pressed');
    const modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the confimation below, the concept boards will be submitted to your client.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        let conceptCount = 0;
        for (const key in this.concepts) {
          const concept = this.concepts[key];
          this.projectService.updateDetailStatus(concept, 'SUBMITTED')
            .then(data => {
              console.log(data);
              conceptCount += 1;
              if (conceptCount === this.concepts.length) {
                this.projectService.updateStatus(this.project, 'CONCEPT')
                  .then(data => {
                    console.log(data);
                    this.fetchProject();
                  });
              }
            });
        }
      }
    });
    modal.present();
  }

  approveConcept() {
    console.log('approve concepts pressed');
    const modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the confirmation below, you are approving a concept board.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        let conceptCount = 0;
        for (const key in this.concepts) {
          const concept = this.concepts[key];
          this.projectService.updateDetailStatus(concept, 'APPROVED')
          .then(data => {
            console.log(data);
            conceptCount += 1;
            if (conceptCount == this.concepts.length) {
              this.fetchProject();
            }
          });
        }
      }
    });
    modal.present();
  }

  itemViewSwitched() {
    console.log('item view switched');
    this.drawFloorplan();
  }

  fileChanged(event) {
    console.log('file changed:', event.target.files[0]);
    const file = event.target.files[0];
    if (this.view == 'APPROVE_CONCEPT') {
      this.projectService.addDetail(this.project, file, 'CONCEPT', 'PENDING')
        .then(data => {
          console.log(data);
          this.fetchDetails();
        });
    }
    if (this.view == 'APPROVE_FLOOR_PLAN') {
      this.projectService.addDetail(this.project, file, 'FLOOR_PLAN', 'PENDING')
        .then(data => {
          console.log(data);
          this.fetchDetails();
        });
    }
  }

  editItem(item, i) {
    console.log('edit item pressed:', item);
    item.number = i + 1;
    const popover = this.popoverCtrl.create('edit-item', {
      item: item
    });
    popover.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.projectService.updateItem(this.project, data, 'PENDING')
          .then(itemData => {
            console.log(itemData);
            this.fetchItems();
          });
      }
    });
    popover.present();
  }

  submitCollection() {
    console.log('submit collection pressed');
    const modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the confimation below, the collection, floor plan and concept board will be submitted to your client.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        let status = '';
        if (this.project.status == 'CONCEPTS') {
          status = 'FLOOR_PLAN';
        }
        if (this.project.status == 'FLOOR_PLAN') {
          status = 'ALTERNATIVES_READY';
        }
        if (this.project.status == 'REQUEST_ALTERNATIVES') {
          status = 'ALTERNATIVES_READY';
        }
        if (this.project.revisionCount == 3) {
          status = 'FINAL_DELIVERY';
        }
        this.projectService.updateRevisionCount(this.project, status)
          .then(data => {
            console.log(data);
            this.fetchProject();
          });
      }
    });
    modal.present();
  }

  approveCollection() {
    console.log('approve collection pressed');
    const modal = this.modalCtrl.create('confirm', {
      message: 'By selecting the button below, you are approving the collection and requesting alternates from your designer.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.projectService.updateStatus(this.project, 'REQUEST_ALTERNATIVES')
          .then(data => {
            console.log(data);
            this.fetchProject();
          });
      }
    });
    modal.present();
  }

  offerAlternative(item, i) {
    console.log('offer alt item pressed:', item);
    item.number = i + 1;
    const modal = this.modalCtrl.create('alternatives', {
      item: item,
      alts: this.alternateItemsMap[item.projectItemId]
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        const alts = data[0];
        const files = data[1];
        let altCount = 0;
        for (const key in alts) {
          const alt = alts[key];
          const file = files[key];
          if (alt.projectItemId) {
            alt.file = file;
            this.projectService.updateItem(this.project, alt, 'ALTERNATE')
            .then(itemData => {
              console.log(itemData);
              altCount++;
              if (altCount == alts.length) {
                this.fetchItems();
              }
            });
          } else {
            this.projectService.addAlternative(this.project, alt, file, item)
            .then(itemData => {
              console.log(itemData);
              altCount++;
              if (altCount == alts.length) {
                this.fetchItems();
              }
            });
          }
        }
      }
    });
    modal.present();
  }

  viewAlternatives(item, i) {
    
    console.log('view alternatives pressed:');
    console.log(item);
    item.number = i + 1;
    const modal = this.modalCtrl.create('alternatives', {
      item: item,
      alts: this.alternateItemsMap[item.projectItemId]
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        
      }
    });
    modal.present();
  }

  requestAlternative(item) {
    
    console.log('request alternative pressed');
    this.projectService.updateItemStatus(item, 'REQUEST_ALTERNATIVE')
    .then(data => {
      if (!data['exception']) {
        this.fetchItems();
      }
    });
  }

  undoAlternative(item) {
    
    console.log('undo alternative pressed');
    this.projectService.updateItemStatus(item, 'SUBMITTED')
    .then(data => {
      if (!data['exception']) {
        this.fetchItems();
      }
    });
  }

}