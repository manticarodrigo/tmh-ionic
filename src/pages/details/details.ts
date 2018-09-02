import { Component } from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

@IonicPage({
  name: 'details',
  segment: 'details/:id'
})
@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
  // User & project vars
  user: any;
  project: any;
  client: any;
  // Step flow
  status = {
    UPLOADED_DRAWING: false,
    UPLOADED_INSPIRATION: false,
    UPLOADED_FURNITURE: false
  };
  loading = true;
  view = 'DRAWING';
  isStaff: boolean;
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
    private modalCtrl: ModalController,
  ) {
    // Fetch current user
    this.userService.fetchCurrentUser()
      .subscribe((user: any) => {
        if (user) {
          this.user = user;
          this.isStaff = Boolean(user.is_staff);
          this.fetchProject();
        }
      });
  }

  toggleStaffView() {
    console.log('toggling staff view', this.isStaff);
    this.isStaff = !this.isStaff;
  }

  fetchProject() {
    console.log('fetching projects');
    if (this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      this.fetchDetails();
    } else if (this.navParams.get('id')) {
      const id = this.navParams.get('id');
      this.projectService.findByProjectId(id)
      .then((project) => {
        this.project = project;
        this.fetchDetails();
      });
    }
  }

  fetchDetails() {
    console.log('fetching details');
    this.projectService.fetchProjectDetails(this.project.id)
      .then(data => {
        let drawings = [];
        let inspirations = [];
        let furnitures = [];
        for (let key in data) {
          let detail =  data[key];
          switch (detail.type) {
            case 'DRAWING':
              drawings.push(detail);
              break;
            case 'INSPIRATION':
              inspirations.push(detail);
              break;
            case 'FURNITURE':
              furnitures.push(detail);
              break;
            default:
              console.log('detail mismatch', detail);
          }
        }
        if (this.loading) { this.loading = false; }

        if (drawings.length > 0) {
          this.status.UPLOADED_DRAWING = true;
          this.selectedDrawing = drawings[0];
          this.drawings = drawings;
        } else {
          this.status.UPLOADED_DRAWING = false;
          this.selectedDrawing = null;
          this.drawings = null;
        }

        if (inspirations.length > 0) {
          this.status.UPLOADED_INSPIRATION = true;
          this.selectedInspiration = inspirations[0];
          this.inspirations = inspirations;
        } else {
          this.status.UPLOADED_INSPIRATION = false;
          this.selectedInspiration = null;
          this.inspirations = null;
        }
        
        if (furnitures.length > 0) {
          this.status.UPLOADED_FURNITURE = true;
          this.selectedFurniture = furnitures[0];
          this.furnitures = furnitures;
        } else {
          this.status.UPLOADED_FURNITURE = false;
          this.selectedFurniture = null;
          this.furnitures = null;
        }
      });
  }

  selectDrawing(drawing) {
    console.log('thumb pressed for drawing:', drawing);
    this.selectedDrawing = drawing;
  }

  selectInspiration(inspiration) {
    console.log('thumb pressed for inspiration:', inspiration);
    this.selectedInspiration = inspiration;
  }

  selectFurniture(furniture) {
    console.log('thumb pressed for furniture:', furniture);
    this.selectedFurniture = furniture;
  }

  selectMenuItem(item) {
    console.log('menu item pressed:', item);
    this.view = item;
  }

  submitToDesigner() {
    const self = this;
    console.log('submit to designer pressed');
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
    console.log('file changed:', event.target.files[0]);
    const file = event.target.files[0];
    switch (this.view) {
      case 'DRAWING':
        this.projectService.addDetail(this.project, file, 'DRAWING', 'APPROVED')
          .then(data => {
            console.log(data);
            this.fetchDetails();
          });
          break;
      case 'INSPIRATION':
        this.projectService.addDetail(this.project, file, 'INSPIRATION', 'APPROVED')
          .then(data => {
            console.log(data);
            this.fetchDetails();
          });
          break;
      case 'FURNITURE':
        this.projectService.addDetail(this.project, file, 'FURNITURE', 'APPROVED')
          .then(data => {
            console.log(data);
            this.fetchDetails();
          });
          break;
      default:
        console.log('view mismatch', this.view);
    }
    // reset files
    event.target.value = null;
  }

  deleteDetail(detail) {
    console.log('deleting detail:', detail);
    this.projectService.deleteDetail(detail)
      .then(data => {
        console.log(data);
        this.fetchDetails();
      });
  }

}
