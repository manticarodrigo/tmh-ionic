import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';
import { ImageService } from '../../providers/image-service';

@IonicPage({
  name: 'details',
  segment: 'details/:id'
})
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
  loading = true;
  view = 'DRAWING';
  viewMode = 'CLIENT';
  selectedDrawing: any;
  selectedInspiration: any;
  selectedFurniture: any;
  drawings: any;
  inspirations: any;
  furnitures: any;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userService: UserService,
    private projectService: ProjectService,
    private imageService: ImageService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    const self = this;
    // Fetch current user
    this.userService.fetchCurrentUser()
      .subscribe(user => {
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
        }
      });
  }

  fetchProject() {
    console.log("fetching projects");
    if (this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      this.project.endDateReadable = this.getDaysLeftStringFrom(this.project.end_date);
      this.fetchDetails();
    } else if (this.navParams.get('id')) {
      const id = this.navParams.get('id');
      this.projectService.findByProjectId(id)
      .then(project => {
        this.project = project;
        this.project.endDateReadable = this.getDaysLeftStringFrom(this.project.end_date);
        this.fetchDetails();
      });
    }
  }

  fetchDetails() {
    console.log("fetching details");
    this.fetchDrawings();
    this.fetchInspirations();
    this.fetchFurnitures();
  }

  fetchDrawings() {
    const self = this;
    this.projectService.fetchProjectDetail(this.project.id, "DRAWING")
    .then(data => {
      console.log("details page received drawings:");
      console.log(data);
      if (!data['exception']) {
        var drawings = [];
        for (var key in data) {
          var drawing = data[key];
          drawing.url = self.imageService.createFileUrl(drawing.file);
          drawings.push(drawing);
        }
        if (drawings.length > 0) {
          self.status.UPLOADED_DRAWING = true;
          self.selectedDrawing = drawings[0];
          self.drawings = drawings;
        } else {
          self.status.UPLOADED_DRAWING = false;
          self.selectedDrawing = null;
          self.drawings = null;
        }
        if (self.loading) {
          self.loading = false;
        }
      }
    });
  }

  fetchInspirations() {
    const self = this;
    this.projectService.fetchProjectDetail(this.project.id, "INSPIRATION")
    .then(data => {
      console.log("details page received inspirations:");
      console.log(data);
      if (!data['exception']) {
        var inspirations = [];
        for (var key in data) {
          var inspiration = data[key];
          inspiration.url = self.imageService.createFileUrl(inspiration.file);
          inspirations.push(inspiration);
        }
        if (inspirations.length > 0) {
          self.status.UPLOADED_INSPIRATION = true;
          self.selectedInspiration = inspirations[0];
          self.inspirations = inspirations;
        } else {
          self.status.UPLOADED_INSPIRATION = false;
          self.selectedInspiration = null;
          self.inspirations = null;
        }
      }
    });
  }

  fetchFurnitures() {
    const self = this;
    this.projectService.fetchProjectDetail(this.project.id, "FURNITURE")
    .then(data => {
      console.log("details page received furnitures:");
      console.log(data);
      if (!data['exception']) {
        var furnitures = [];
        for (var key in data) {
          var furniture = data[key];
          furniture.url = self.imageService.createFileUrl(furniture.file);
          furnitures.push(furniture);
        }
        if (furnitures.length > 0) {
          self.status.UPLOADED_FURNITURE = true;
          self.selectedFurniture = furnitures[0];
          self.furnitures = furnitures;
        } else {
          self.status.UPLOADED_FURNITURE = false;
          self.selectedFurniture = null;
          self.furnitures = null;
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
        if (data == 'DESIGN')
          page = 'design';
        if (data == 'FINAL DELIVERY')
          page = 'final-delivery';
        if (page)
          this.navCtrl.setRoot(page, {
            project: self.project,
            id: self.project.id
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
    if (link == 'DESIGN')
      page = 'design';
    if (link == 'FINAL_DELIVERY')
      page = 'final-delivery';
    if (page)
      this.navCtrl.setRoot(page, {
        project: self.project,
        id: self.project.id
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

  submitToDesigner() {
    const self = this;
    console.log("submit to designer pressed");
    let modal = this.modalCtrl.create('confirm', {
      message: 'Ready to connect with your designer? By selecting the confimation below, your details will be submitted so your designer can begin on your concept boards.'
    });
    modal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        self.projectService.updateStatus(self.project, 'DESIGN')
        .then(data => {
          self.navCtrl.setRoot('design', {
            project: self.project,
            id: self.project.id
          });
        });
      }
    });
    modal.present();
  }

  fileChanged(event) {
    const self = this;
    console.log("file changed:");
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (this.view == 'DRAWING') {
      this.projectService.addDetail(this.project, file, 'DRAWING', 'APPROVED')
      .then(data => {
        console.log(data);
        if (!data['exception']) {
          self.fetchDrawings();
        }
      });
    }
    if (this.view == 'INSPIRATION') {
      this.projectService.addDetail(this.project, file, 'INSPIRATION', 'APPROVED')
      .then(data => {
        console.log(data);
        if (!data['exception']) {
          self.fetchInspirations();
        }
      });
    }
    if (this.view == 'FURNITURE') {
      this.projectService.addDetail(this.project, file, 'FURNITURE', 'APPROVED')
      .then(data => {
        console.log(data);
        if (!data['exception']) {
          self.fetchFurnitures();
        }
      });
    }
  }

  deleteDetail(detail) {
    const self = this;
    console.log("delete detail pressed:");
    console.log(detail);
    this.projectService.deleteDetail(this.project, detail)
    .then(data => {
      console.log(data);
      if (!data['exception']) {
        if (this.view == 'DRAWING') {
          self.fetchDrawings();
        }
        if (this.view == 'INSPIRATION') {
          self.fetchInspirations();
        }
        if (this.view == 'FURNITURE') {
          self.fetchFurnitures();
        }
      }
    });
  }

}
