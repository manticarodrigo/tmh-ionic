import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import * as Leaflet from 'leaflet';

import { ProjectService } from '../../../providers/project-service';

@Component({
  selector: 'floorplan-map',
  templateUrl: 'floorplan-map.html'
})
export class FloorplanMapComponent {
  @Input() roleView: String;
  @Input() itemsView: String;
  @Input() loading = true;
  @Input() project: any;
  @Input() floorplan: any;
  @Input() items: any;
  @Output() onAddItem = new EventEmitter();

  map: any;
  markers: any;
  drawTimer: any;

  constructor(
    private popoverCtrl: PopoverController,
    private projectService: ProjectService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    const items = changes.items;
    if (items && JSON.stringify(items.currentValue) != '{}') {
      if (!this.map) this.drawFloorplan();
      this.drawMarkers();
    }
  }

  ngOnDestroy() {
    console.log('clearing draw timeout');
    clearTimeout(this.drawTimer);
  }

  drawFloorplan() {
    this.drawTimer = setTimeout(() => {
      console.log('drawing map', this.floorplan);
      this.loading = false;
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
                  self.onAddItem.emit();
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
    }, 2000);
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
}
