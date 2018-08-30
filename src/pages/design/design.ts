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
  loading = true;
  view = 'APPROVE_CONCEPT';
  roleView = 'CLIENT';
  itemsView = 'PENDING';
  concepts: any;
  selectedConcept: any;
  conceptboard: any;
  floorplan: any;
  // Leaflet
  map: any;
  markers: any;
  // Items
  items: any = {};
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userService: UserService,
    private projectService: ProjectService,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {
     // Fetch current user
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          this.user = user;
          if (this.user.is_staff) {
            this.roleView = 'DESIGNER';
          }
          this.fetchProject();
        }
      });
  }

  fetchProject() {
    console.log('fetching project');
    if (this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      if (
        this.project.status === 'FINAL_DELIVERY' ||
        this.project.status === 'SHOPPING_CART' ||
        this.project.status === 'ESTIMATE_SHIPPING_AND_TAX' ||
        this.project.status === 'ARCHIVED'
      ) {
        this.itemsView = 'APPROVED';
        console.log('items view switched', this.itemsView);
      }
      this.fetchDetails();
      this.fetchItems();
    } else if (this.navParams.get('id')) {
      const id = this.navParams.get('id');
      this.projectService.findByProjectId(id)
        .then(project => {
          this.project = project;
          if (
            this.project.status === 'FINAL_DELIVERY' ||
            this.project.status === 'SHOPPING_CART' ||
            this.project.status === 'ESTIMATE_SHIPPING_AND_TAX' ||
            this.project.status === 'ARCHIVED'
          ) {
              this.itemsView = 'APPROVED';
              console.log('items view switched', this.itemsView);
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
          if (detail && detail.type === 'CONCEPT') {
            if (detail.status === 'APPROVED') {
              console.log('approved concept:', detail);
              this.conceptboard = detail;
              this.view = 'APPROVE_FLOOR_PLAN';
            }
            concepts.push(detail);
          }
          if (detail && detail.type === 'FLOOR_PLAN') {
            console.log('floor plan:', detail);
            this.view = 'APPROVE_FLOOR_PLAN';
            floorplans.push(detail);
          }
        }
        if (concepts.length > 0) {
          this.concepts = concepts;
          this.selectedConcept = concepts[0];
        }
        if (floorplans.length > 0) {
          this.floorplan = floorplans[0];
          this.drawFloorplan();
        }
        if (concepts.length > 0 && floorplans.length > 0) {
          this.view = 'FLOOR_PLAN';
        }
        this.loading = false;
      });
  }

  fetchItems() {
    this.projectService.fetchItems(this.project)
      .then((data: Array<any>) => {
        console.log('design page received item data:', data);
        if (data && Array(data).length > 0) {
          const items = data.reduce((items, item) => {
            if (item.parent) {
              const type = items.alternate
              const parent = type[item.parent]
              items.alternate[item.parent] = parent ? [...parent, item] : [item]
              return items;
            }
            switch (item.status) {
              case 'PENDING':
              case 'SUBMITTED':
                let type = items.modified;
                items.modified = type ? [...type, item] : [item];
                break;
              case 'APPROVED':
                type = items.approved;
                items.approved = type ? [...type, item] : [item];
                break;
              default:
                type = items.pending;
                items.pending = type ? [...type, item] : [item];
            }
            return items;
          }, {});
          console.log('reduced items:', items);
          this.items = items;
          if (items.modified) {
            this.itemsView = 'MODIFIED';
            console.log('items view switched', this.itemsView);
          }
          this.drawMarkers();
        } else {
          this.items = null;
        }
      });
  }

  drawFloorplan() {
    console.log('drawing map');
    this.loading = true;
    setTimeout(() => {
      // create the floorplan map
      this.map = Leaflet.map('floorplan-map', {
        attributionControl: false,
        dragging: false,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
        minZoom: 1,
        maxZoom: 4,
        center: [0, 0],
        zoom: 1,
        crs: Leaflet.CRS.Simple
      });
      // dimensions of the image
      const w = this.map.getSize().x,
          h = this.map.getSize().y,
          url = this.floorplan.image;
      console.log('map dimensions:', w, h);
      // calculate the edges of the image, in coordinate space
      const southWest = this.map.unproject([0, h], this.map.getMaxZoom()-1);
      const northEast = this.map.unproject([w, 0], this.map.getMaxZoom()-1);
      const bounds = new Leaflet.LatLngBounds(southWest, northEast);
      // add the image overlay, 
      // so that it covers the entire map
      Leaflet.imageOverlay(url, bounds).addTo(this.map);
      this.map.fitBounds(bounds);
      // create the markers layer
      this.markers = new Leaflet.LayerGroup().addTo(this.map);
      // draw markers
      this.drawMarkers();
      this.loading = false;
      // listen for map double click event
      const self = this;
      this.map.on('dblclick', function(e) {
        console.log('clicked map', e, self.roleView);
        if (self.roleView === 'DESIGNER') {
          const numberIcon = Leaflet.divIcon({
            className: 'number-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
            html: '*'       
          });
          const marker = new Leaflet.Marker(
            e.latlng,
            { icon: numberIcon }
          );
          marker.addTo(self.markers);
          const popover = self.popoverCtrl.create('edit-item');
          popover.onDidDismiss(data => {
            console.log('adding item:', data);
            if (data) {
              data.lat = e.latlng.lat / -h;
              data.lng = e.latlng.lng / w;
              self.projectService.addItem(self.project, data)
                .then(data => {
                  console.log('design page received item:', data)
                  self.fetchItems();
                });
            } else {
              marker.remove();
            }
          });
          // const ev = e.originalEvent;
          // popover.present({ev});
          popover.present();
        }
      });
    }, 2000)
  }

  drawMarkers() {
    if (this.map) {
      let items = [];
      const w = this.map.getSize().x,
            h = this.map.getSize().y;
      // choose marker items
      switch (this.itemsView) {
        case 'PENDING':
          items = this.items.pending;
          break;
        case 'MODIFIED':
          items = this.items.modified;
          break;
        default:
          items = this.items.approved;
      }
      console.log('drawing markers', this.itemsView, items);
      // clear existing layers
      this.markers.clearLayers();
      if (items) {
        items.forEach((item, i) => {
          if (item.lat && item.lng) {
            const latlng = new Leaflet.LatLng(item.lat * -h, item.lng * w);
            console.log('adding marker at coordinates:', latlng);
            // the text could also be letters instead of numbers if that's more appropriate
            const numberIcon = Leaflet.divIcon({
              className: 'number-icon',
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
              html: i + 1      
            });
            // add the each marker to the marker map with id as key
            const marker = new Leaflet.Marker(latlng, {
                draggable: true,
                icon: numberIcon
            });
            // add popups
            marker.addTo(this.markers)
              .bindPopup(this.createPopup(item));
            // listen for marker drag event
            marker.on('drag', function(e) {
              const point = e.target;
              const latlng = point.getLatLng();
              console.log('moving marker', item.id, latlng);
            });
          }
        });
      }
    }
  }

  createPopup(item) {
    let popup = '';
    switch (true) {
      case Boolean(item.image):
        popup += `<img src='${item.image}'>`;
      case Boolean(item.make):
        popup += `<h3>${item.make}</h3>`;
      case Boolean(item.type):
        popup += `<p>${item.type}</p>`;
      case Boolean(item.price):
        popup += `<h4>$${item.price}</h4>`;
      default:
        popup === '' ? popup += '<h3>No item info.</h3>' : null;
    }
    return popup;
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
        if (data === 'DETAILS')
          page = 'details';
        if (data === 'FINAL DELIVERY')
          page = 'final-delivery';
        if (page)
          this.navCtrl.setRoot(page, {
            project: this.project,
            id: this.project.id
          });
      }
    });
    popover.present({animate: false});
  }

  selectTabLink(link) {
    console.log('selected tab link:', link);
    let page: any;
    if (link === 'DETAILS')
      page = 'details';
    if (link === 'FINAL_DELIVERY')
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
    this.drawMarkers();
  }

  selectFloorplan() {
    console.log('selected switcher floorplan link');
    if (this.view !== 'FLOOR_PLAN') {
      this.view = 'FLOOR_PLAN';
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
                this.projectService.updateStatus(this.project, 'CONCEPTS')
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
            if (conceptCount === this.concepts.length) {
              this.fetchProject();
            }
          });
        }
      }
    });
    modal.present();
  }

  itemViewSwitched() {
    console.log('items view switched', this.itemsView);
    this.drawMarkers();
  }

  fileChanged(event) {
    console.log('file changed:', event.target.files[0]);
    const file = event.target.files[0];
    if (this.view === 'APPROVE_CONCEPT') {
      this.projectService.addDetail(this.project, file, 'CONCEPT', 'PENDING')
        .then(data => {
          console.log(data);
          this.fetchDetails();
        });
    }
    if (this.view === 'APPROVE_FLOOR_PLAN') {
      const { addDetail, updateStatus } = this.projectService;
      const createDetail = addDetail(this.project, file, 'FLOOR_PLAN', 'PENDING');
      const updateProject = updateStatus(this.project, 'FLOOR_PLAN')
      Promise.all([createDetail, updateProject])
        .then(data => {
          console.log('upload floorplan returned data:', data);
          this.fetchProject();
          this.fetchDetails();
        });
    }
    // reset files
    event.target.value = null;
  }

  editItem(ev, item, i) {
    console.log('edit item pressed:', ev, item, i);
    item.number = i + 1;
    const popover = this.popoverCtrl.create(
      'edit-item',
      { item: item }
    );
    popover.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.projectService.updateItem(
          this.project,
          data,
          'PENDING'
        )
          .then(itemData => {
            console.log(itemData);
            this.fetchItems();
          });
      }
    });
    // popover.present({ev});
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
        switch (this.project.status) {
          case 'CONCEPTS':
            status = 'FLOOR_PLAN';
            break;
          case 'FLOOR_PLAN':
          case 'REQUEST_ALTERNATIVES':
            status = 'ALTERNATIVES_READY';
            break;
          default:
            null
        }
        if (this.project.revision_count === 3) {
          status = 'FINAL_DELIVERY';
        }
        this.projectService.updateRevisionCount(this.project, status)
          .then(data => {
            console.log('update revision count returned:', data);
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
            console.log('update status returned:', data);
            this.fetchProject();
          });
      }
    });
    modal.present();
  }

  offerAlternative(item, i) {
    console.log('offer alt item pressed:', item);
    const alts = this.items.alternate
    item.number = i + 1;
    const modal = this.modalCtrl.create(
      'alternatives',
      {
        item,
        alts: alts ? alts[item.id] : null
      }
    );
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        const alts = data[0];
        const images = data[1];
        let altCount = 0;
        for (const key in alts) {
          const alt = alts[key];
          const image = images[key];
          if (alt.id) {
            alt.image = image;
            this.projectService.updateItem(this.project, alt, 'ALTERNATE')
            .then(itemData => {
              console.log(itemData);
              altCount++;
              if (altCount === alts.length) {
                this.fetchItems();
              }
            });
          } else {
            this.projectService.addAlternative(this.project, alt, image, item)
            .then(itemData => {
              console.log(itemData);
              altCount++;
              if (altCount === alts.length) {
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
    console.log('view alternatives pressed:', item);
    const alts = this.items.alternate
    if (alts) {
      item.number = i + 1;
      const modal = this.modalCtrl.create(
        'alternatives',
        { item, alts: alts[item.id]}
      );
      modal.onDidDismiss(data => {
        console.log(data);
      });
      modal.present(); 
    }
  }

  requestAlternative(item) {
    console.log('request alternative pressed');
    const { updateItemStatus, updateStatus } = this.projectService;
    const updateItem = updateItemStatus(item, 'REQUEST_ALTERNATIVE');
    const updateProject = updateStatus(this.project, 'REQUEST_ALTERNATIVES')
    Promise.all([updateItem, updateProject])
      .then(data => {
        console.log(data);
        this.fetchItems();
      });
  }

  undoAlternative(item) {
    console.log('undo alternative pressed');
    this.projectService.updateItemStatus(item, 'SUBMITTED')
      .then(data => {
        console.log(data);
        this.fetchItems();
      });
  }

}