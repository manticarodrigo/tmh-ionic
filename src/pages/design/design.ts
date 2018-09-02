import { Component } from '@angular/core';

import {
  IonicPage,
  NavParams,
  ModalController
} from 'ionic-angular';

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
  // User & project vars
  user: any;
  project: any;
  // Step flow
  loading: boolean = true;
  view: string = 'APPROVE_CONCEPT';
  isStaff: boolean = false;
  itemsView: string = 'PENDING';
  concepts: any;
  selectedConcept: any;
  conceptboard: any;
  floorplan: any;
  // Items
  items: any = {};
  constructor(
    private navParams: NavParams,
    private userService: UserService,
    private projectService: ProjectService,
    private modalCtrl: ModalController
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
          // this.drawFloorplan();
        }
        if (concepts.length > 0 && floorplans.length > 0) {
          this.view = 'FLOOR_PLAN';
        }
      });
  }

  fetchItems() {
    this.projectService.fetchItems(this.project)
      .then((data: Array<any>) => {
        console.log('design page received item data:', data);
        if (data && Array(data).length > 0) {
          const items = data.reduce((items, item) => {
            if (item.parent) {
              const type = items.alternate;
              if (!type) items.alternate = {};
              const parent = items.alternate[item.parent];
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
          // his.drawMarkers();
        } else {
          this.items = null;
        }
      });
  }

  selectFloorplan() {
    console.log('selected switcher floorplan link');
    if (this.view !== 'FLOOR_PLAN') this.view = 'FLOOR_PLAN';
  }

  selectConceptboard() {
    console.log('selected switcher conceptboard link');
    if (this.view !== 'CONCEPT_BOARD') this.view = 'CONCEPT_BOARD';
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
    // this.drawMarkers();
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

}